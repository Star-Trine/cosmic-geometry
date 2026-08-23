import type { Geocoder } from "./geocoder.js";
import type { TimezoneResolver } from "./timezoneResolver.js";
import type {
  LocationSearchRequest,
  LocationSearchResponse,
} from "./types.js";

const MAX_CITY_LENGTH = 120;
const MAX_COUNTRY_LENGTH = 100;

export class LocationRequestValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LocationRequestValidationError";
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const readRequiredText = (
  value: Record<string, unknown>,
  field: "city" | "country",
  maxLength: number,
): string => {
  const text = value[field];
  if (typeof text !== "string") {
    throw new LocationRequestValidationError(`${field} must be a string`);
  }

  const trimmed = text.trim();
  if (!trimmed) {
    throw new LocationRequestValidationError(`${field} must not be empty`);
  }
  if (trimmed.length > maxLength) {
    throw new LocationRequestValidationError(`${field} is too long`);
  }
  return trimmed;
};

export const validateLocationSearchRequest = (
  value: unknown,
): LocationSearchRequest => {
  if (!isRecord(value)) {
    throw new LocationRequestValidationError("request body must be an object");
  }

  return {
    city: readRequiredText(value, "city", MAX_CITY_LENGTH),
    country: readRequiredText(value, "country", MAX_COUNTRY_LENGTH),
  };
};

export const searchLocations = async (
  request: LocationSearchRequest,
  geocoder: Geocoder,
  timezoneResolver: TimezoneResolver,
): Promise<LocationSearchResponse> => {
  const geocodedCandidates = await geocoder.search(request);
  return {
    candidates: geocodedCandidates.map((candidate) => ({
      ...candidate,
      timezone: timezoneResolver.resolve(
        candidate.latitude,
        candidate.longitude,
      ),
    })),
  };
};
