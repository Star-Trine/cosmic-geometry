import { find } from "geo-tz/dist/find-all";

import type { TimezoneResolver } from "./timezoneResolver.js";

export type TimezoneResolutionErrorKind =
  | "invalid_coordinates"
  | "not_found"
  | "ambiguous"
  | "internal";

export class TimezoneResolutionError extends Error {
  constructor(
    readonly kind: TimezoneResolutionErrorKind,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "TimezoneResolutionError";
  }
}

type FindTimezones = (latitude: number, longitude: number) => string[];

const isValidCoordinate = (
  value: number,
  min: number,
  max: number,
): boolean => Number.isFinite(value) && value >= min && value <= max;

export class GeoTzTimezoneResolver implements TimezoneResolver {
  constructor(private readonly findTimezones: FindTimezones = find) {}

  resolve(latitude: number, longitude: number): string {
    if (!isValidCoordinate(latitude, -90, 90)) {
      throw new TimezoneResolutionError(
        "invalid_coordinates",
        "Latitude must be a finite number between -90 and 90",
      );
    }
    if (!isValidCoordinate(longitude, -180, 180)) {
      throw new TimezoneResolutionError(
        "invalid_coordinates",
        "Longitude must be a finite number between -180 and 180",
      );
    }

    let timezones: string[];
    try {
      timezones = this.findTimezones(latitude, longitude);
    } catch (error: unknown) {
      throw new TimezoneResolutionError(
        "internal",
        "Timezone lookup failed",
        { cause: error },
      );
    }

    const uniqueTimezones = [
      ...new Set(timezones.filter((timezone) => timezone.trim() !== "")),
    ];
    if (uniqueTimezones.length === 0) {
      throw new TimezoneResolutionError(
        "not_found",
        "No timezone was found for the coordinates",
      );
    }
    if (uniqueTimezones.length > 1) {
      throw new TimezoneResolutionError(
        "ambiguous",
        "Multiple timezones were found for the coordinates",
      );
    }
    return uniqueTimezones[0] as string;
  }
}
