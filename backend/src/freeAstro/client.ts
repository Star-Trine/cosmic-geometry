import { randomUUID } from "node:crypto";

import type { HoroscopeRequest } from "../api/horoscopeApiTypes.js";

const FREE_ASTRO_API_URL =
  "https://api.freeastroapi.com/api/v1/natal/calculate";
const DEFAULT_TIMEOUT_MS = 10_000;

export type FreeAstroClientErrorKind =
  | "rate_limit"
  | "authentication"
  | "request_failed"
  | "invalid_json";

export class FreeAstroClientError extends Error {
  constructor(
    readonly kind: FreeAstroClientErrorKind,
    message: string,
    readonly upstreamStatus?: number,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "FreeAstroClientError";
  }
}

export type FreeAstroClientOptions = {
  apiKey?: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
  onResponse?: (metadata: FreeAstroResponseMetadata) => void;
};

export type FreeAstroResponseMetadata = {
  status: number;
  statusText: string;
  contentType: string | null;
  rateLimit: {
    limit: string | null;
    remaining: string | null;
    reset: string | null;
    retryAfter: string | null;
  };
};

const createPayload = (request: HoroscopeRequest): Record<string, unknown> => {
  const [year, month, day] = request.date.split("-").map(Number);
  const payload: Record<string, unknown> = {
    name: request.place.name,
    year,
    month,
    day,
    time_known: request.timeKnown,
    city: request.place.city,
    lat: request.place.latitude,
    lng: request.place.longitude,
    tz_str: request.place.timezone,
    response_format: "full",
    house_system: "placidus",
    zodiac_type: "tropical",
  };

  if (request.timeKnown && request.time !== null) {
    const [hour, minute] = request.time.split(":").map(Number);
    payload.hour = hour;
    payload.minute = minute;
  }
  return payload;
};

export const fetchFreeAstroNatal = async (
  request: HoroscopeRequest,
  options: FreeAstroClientOptions = {},
): Promise<unknown> => {
  const apiKey = (options.apiKey ?? process.env.FREE_ASTRO_API_KEY)?.trim();
  if (!apiKey) {
    throw new FreeAstroClientError(
      "authentication",
      "FREE_ASTRO_API_KEY is not configured",
    );
  }

  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const fetchImpl = options.fetchImpl ?? fetch;
  let response: Response;

  try {
    response = await fetchImpl(FREE_ASTRO_API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Idempotency-Key": randomUUID(),
        "x-api-key": apiKey,
      },
      body: JSON.stringify(createPayload(request)),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error: unknown) {
    throw new FreeAstroClientError(
      "request_failed",
      "FreeAstroAPI request failed or timed out",
      undefined,
      { cause: error },
    );
  }

  options.onResponse?.({
    status: response.status,
    statusText: response.statusText,
    contentType: response.headers.get("content-type"),
    rateLimit: {
      limit: response.headers.get("x-ratelimit-limit"),
      remaining: response.headers.get("x-ratelimit-remaining"),
      reset: response.headers.get("x-ratelimit-reset"),
      retryAfter: response.headers.get("retry-after"),
    },
  });

  if (response.status === 429) {
    throw new FreeAstroClientError(
      "rate_limit",
      "FreeAstroAPI rate limit reached",
      response.status,
    );
  }
  if (response.status === 401 || response.status === 403) {
    throw new FreeAstroClientError(
      "authentication",
      "FreeAstroAPI authentication failed",
      response.status,
    );
  }
  if (!response.ok) {
    throw new FreeAstroClientError(
      "request_failed",
      `FreeAstroAPI returned HTTP ${response.status}`,
      response.status,
    );
  }

  try {
    return (await response.json()) as unknown;
  } catch (error: unknown) {
    throw new FreeAstroClientError(
      "invalid_json",
      "FreeAstroAPI returned invalid JSON",
      response.status,
      { cause: error },
    );
  }
};
