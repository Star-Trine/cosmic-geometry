export type LocationCandidate = {
  id: string;
  label: string;
  locality: string | null;
  region: string | null;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  timezone: string;
};

export type LocationSearchResponse = {
  candidates: LocationCandidate[];
};
