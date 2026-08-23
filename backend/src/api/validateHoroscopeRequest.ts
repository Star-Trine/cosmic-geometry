import type { HoroscopeRequest } from "./horoscopeApiTypes.js";

export class HoroscopeRequestValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HoroscopeRequestValidationError";
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const requireRecord = (
  value: unknown,
  field: string,
): Record<string, unknown> => {
  if (!isRecord(value)) {
    throw new HoroscopeRequestValidationError(`${field} must be an object`);
  }
  return value;
};

const requireString = (value: unknown, field: string): string => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new HoroscopeRequestValidationError(
      `${field} must be a non-empty string`,
    );
  }
  return value.trim();
};

const requireFiniteNumber = (value: unknown, field: string): number => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new HoroscopeRequestValidationError(`${field} must be a number`);
  }
  return value;
};

const validateDate = (value: unknown): string => {
  const date = requireString(value, "date");
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) {
    throw new HoroscopeRequestValidationError("date must use YYYY-MM-DD");
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    throw new HoroscopeRequestValidationError("date must be a real date");
  }
  return date;
};

const validateTime = (
  value: unknown,
  timeKnown: boolean,
): string | null => {
  if (!timeKnown) {
    if (value !== null) {
      throw new HoroscopeRequestValidationError(
        "time must be null when timeKnown is false",
      );
    }
    return null;
  }

  if (typeof value !== "string" || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value)) {
    throw new HoroscopeRequestValidationError(
      "time must use valid 24-hour HH:MM when timeKnown is true",
    );
  }
  return value;
};

export const validateHoroscopeRequest = (value: unknown): HoroscopeRequest => {
  const request = requireRecord(value, "request");
  const place = requireRecord(request.place, "place");
  if (typeof request.timeKnown !== "boolean") {
    throw new HoroscopeRequestValidationError("timeKnown must be a boolean");
  }

  const latitude = requireFiniteNumber(place.latitude, "place.latitude");
  const longitude = requireFiniteNumber(place.longitude, "place.longitude");
  if (latitude < -90 || latitude > 90) {
    throw new HoroscopeRequestValidationError(
      "place.latitude must be between -90 and 90",
    );
  }
  if (longitude < -180 || longitude > 180) {
    throw new HoroscopeRequestValidationError(
      "place.longitude must be between -180 and 180",
    );
  }

  return {
    date: validateDate(request.date),
    time: validateTime(request.time, request.timeKnown),
    timeKnown: request.timeKnown,
    place: {
      name: requireString(place.name, "place.name"),
      city: requireString(place.city, "place.city"),
      country: requireString(place.country, "place.country"),
      latitude,
      longitude,
      timezone: requireString(place.timezone, "place.timezone"),
    },
  };
};
