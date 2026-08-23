import type {
  GeocodedLocationCandidate,
  LocationSearchRequest,
} from "./types.js";

export interface Geocoder {
  search(request: LocationSearchRequest): Promise<GeocodedLocationCandidate[]>;
}
