export type LocationSearchRequest = {
  city: string;
  country: string;
};

export type GeocodedLocationCandidate = {
  id: string;
  label: string;
  locality: string | null;
  region: string | null;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
};

export type LocationCandidate = GeocodedLocationCandidate & {
  timezone: string;
};

export type LocationSearchResponse = {
  candidates: LocationCandidate[];
};

export type LocationErrorCode =
  | "LOCATION_API_RATE_LIMIT"
  | "LOCATION_API_AUTH_ERROR"
  | "LOCATION_API_REQUEST_FAILED"
  | "LOCATION_API_INVALID_RESPONSE"
  | "LOCATION_TIMEZONE_RESOLUTION_FAILED";
