import type {
  LocationCandidate,
  LocationSearchResponse,
} from '../data/location/types';

export class LocationApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'LocationApiError';
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isNullableString = (value: unknown): value is string | null =>
  typeof value === 'string' || value === null;

const isLocationCandidate = (value: unknown): value is LocationCandidate =>
  isRecord(value) &&
  typeof value.id === 'string' &&
  typeof value.label === 'string' &&
  isNullableString(value.locality) &&
  isNullableString(value.region) &&
  typeof value.country === 'string' &&
  typeof value.countryCode === 'string' &&
  typeof value.latitude === 'number' &&
  Number.isFinite(value.latitude) &&
  value.latitude >= -90 &&
  value.latitude <= 90 &&
  typeof value.longitude === 'number' &&
  Number.isFinite(value.longitude) &&
  value.longitude >= -180 &&
  value.longitude <= 180 &&
  typeof value.timezone === 'string' &&
  value.timezone.length > 0;

const isLocationResponse = (value: unknown): value is LocationSearchResponse =>
  isRecord(value) &&
  Array.isArray(value.candidates) &&
  value.candidates.every(isLocationCandidate);

const isErrorResponse = (
  value: unknown,
): value is { error: { code: string; message: string } } =>
  isRecord(value) &&
  isRecord(value.error) &&
  typeof value.error.code === 'string' &&
  typeof value.error.message === 'string';

const parseJson = async (response: Response): Promise<unknown> => {
  try {
    return (await response.json()) as unknown;
  } catch {
    throw new LocationApiError(
      response.status,
      'INVALID_RESPONSE',
      'The location service returned an invalid response.',
    );
  }
};

export const searchLocations = async (
  city: string,
  country: string,
  fetchImpl: typeof fetch = fetch,
): Promise<LocationCandidate[]> => {
  let response: Response;
  try {
    response = await fetchImpl('/api/location', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city, country }),
    });
  } catch {
    throw new LocationApiError(
      0,
      'NETWORK_ERROR',
      'The location service could not be reached.',
    );
  }

  const body = await parseJson(response);
  if (!response.ok) {
    if (isErrorResponse(body)) {
      throw new LocationApiError(
        response.status,
        body.error.code,
        body.error.message,
      );
    }
    throw new LocationApiError(
      response.status,
      'REQUEST_FAILED',
      'Locations could not be searched.',
    );
  }
  if (!isLocationResponse(body)) {
    throw new LocationApiError(
      response.status,
      'INVALID_RESPONSE',
      'The location service returned an invalid response.',
    );
  }
  return body.candidates;
};
