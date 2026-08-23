import type { Geocoder } from "./geocoder.js";
import type {
  GeocodedLocationCandidate,
  LocationSearchRequest,
} from "./types.js";

const GEOAPIFY_GEOCODING_URL = "https://api.geoapify.com/v1/geocode/search";
const DEFAULT_TIMEOUT_MS = 10_000;
const MAX_CANDIDATES = 5;

export type GeoapifyGeocoderErrorKind =
  | "rate_limit"
  | "authentication"
  | "request_failed"
  | "invalid_response";

export class GeoapifyGeocoderError extends Error {
  constructor(
    readonly kind: GeoapifyGeocoderErrorKind,
    message: string,
    readonly upstreamStatus?: number,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "GeoapifyGeocoderError";
  }
}

type GeoapifyGeocoderOptions = {
  apiKey?: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const optionalText = (
  value: Record<string, unknown>,
  keys: readonly string[],
): string | null => {
  for (const key of keys) {
    const candidate = value[key];
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }
  return null;
};

const coordinate = (
  value: Record<string, unknown>,
  key: "lat" | "lon",
  min: number,
  max: number,
): number | null => {
  const candidate = value[key];
  return typeof candidate === "number" &&
    Number.isFinite(candidate) &&
    candidate >= min &&
    candidate <= max
    ? candidate
    : null;
};

export const normalizeGeoapifyResponse = (
  value: unknown,
): GeocodedLocationCandidate[] => {
  if (!isRecord(value) || !Array.isArray(value.results)) {
    throw new GeoapifyGeocoderError(
      "invalid_response",
      "Geoapify response does not contain a results array",
    );
  }

  const candidates: GeocodedLocationCandidate[] = [];
  for (const rawResult of value.results) {
    if (!isRecord(rawResult)) continue;

    const latitude = coordinate(rawResult, "lat", -90, 90);
    const longitude = coordinate(rawResult, "lon", -180, 180);
    const label = optionalText(rawResult, ["formatted", "address_line1"]);
    const country = optionalText(rawResult, ["country"]);
    const countryCode = optionalText(rawResult, ["country_code"]);
    if (
      latitude === null ||
      longitude === null ||
      label === null ||
      country === null ||
      countryCode === null
    ) {
      continue;
    }

    const providerId = rawResult.place_id;
    const id =
      (typeof providerId === "string" || typeof providerId === "number") &&
      String(providerId).trim()
        ? String(providerId)
        : `${latitude},${longitude}`;

    candidates.push({
      id,
      label,
      locality: optionalText(rawResult, [
        "city",
        "town",
        "village",
        "municipality",
        "suburb",
      ]),
      region: optionalText(rawResult, ["state", "county"]),
      country,
      countryCode: countryCode.toLowerCase(),
      latitude,
      longitude,
    });
  }
  return candidates.slice(0, MAX_CANDIDATES);
};

export class GeoapifyGeocoder implements Geocoder {
  readonly apiKey: string | undefined;
  readonly fetchImpl: typeof fetch;
  readonly timeoutMs: number;

  constructor(options: GeoapifyGeocoderOptions = {}) {
    this.apiKey = options.apiKey ?? process.env.GEOAPIFY_API_KEY?.trim();
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  }

  async search(
    request: LocationSearchRequest,
  ): Promise<GeocodedLocationCandidate[]> {
    if (!this.apiKey) {
      throw new GeoapifyGeocoderError(
        "authentication",
        "GEOAPIFY_API_KEY is not configured",
      );
    }

    const url = new URL(GEOAPIFY_GEOCODING_URL);
    url.searchParams.set("city", request.city);
    url.searchParams.set("country", request.country);
    url.searchParams.set("type", "city");
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", String(MAX_CANDIDATES));
    url.searchParams.set("apiKey", this.apiKey);

    let response: Response;
    try {
      response = await this.fetchImpl(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(this.timeoutMs),
      });
    } catch {
      throw new GeoapifyGeocoderError(
        "request_failed",
        "Geoapify request failed or timed out",
      );
    }

    if (response.status === 429) {
      throw new GeoapifyGeocoderError(
        "rate_limit",
        "Geoapify rate limit reached",
        response.status,
      );
    }
    if (response.status === 401 || response.status === 403) {
      throw new GeoapifyGeocoderError(
        "authentication",
        "Geoapify authentication failed",
        response.status,
      );
    }
    if (!response.ok) {
      throw new GeoapifyGeocoderError(
        "request_failed",
        `Geoapify returned HTTP ${response.status}`,
        response.status,
      );
    }

    let body: unknown;
    try {
      body = (await response.json()) as unknown;
    } catch {
      throw new GeoapifyGeocoderError(
        "invalid_response",
        "Geoapify returned invalid JSON",
        response.status,
      );
    }
    return normalizeGeoapifyResponse(body);
  }
}
