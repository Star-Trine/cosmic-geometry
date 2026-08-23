import type { VercelRequest, VercelResponse } from '@vercel/node';

import { GeoapifyGeocoder, GeoapifyGeocoderError } from '../backend/src/location/geoapifyGeocoder.js';
import {
  GeoTzTimezoneResolver,
  TimezoneResolutionError,
} from '../backend/src/location/geoTzTimezoneResolver.js';
import {
  LocationRequestValidationError,
  searchLocations,
  validateLocationSearchRequest,
} from '../backend/src/location/locationService.js';
import type {
  LocationSearchRequest,
  LocationSearchResponse,
} from '../backend/src/location/types.js';
import {
  FunctionRequestError,
  logFunctionError,
  readJsonBody,
  writeError,
} from './_request.js';

type FindLocations = (
  request: LocationSearchRequest,
) => Promise<LocationSearchResponse>;

const handleError = (
  response: VercelResponse,
  error: unknown,
): VercelResponse => {
  if (error instanceof FunctionRequestError) {
    return writeError(
      response,
      error.status,
      error.code,
      error.code === 'REQUEST_BODY_TOO_LARGE'
        ? 'The request body is too large.'
        : 'A valid JSON body is required.',
    );
  }
  if (error instanceof LocationRequestValidationError) {
    return writeError(
      response,
      400,
      'INVALID_INPUT',
      'The location search is invalid.',
    );
  }
  if (error instanceof GeoapifyGeocoderError) {
    logFunctionError('Geoapify request failed.', error);
    if (error.kind === 'rate_limit') {
      return writeError(
        response,
        429,
        'LOCATION_API_RATE_LIMIT',
        'The location service is temporarily busy. Please try again later.',
      );
    }
    if (error.kind === 'authentication') {
      return writeError(
        response,
        502,
        'LOCATION_API_AUTH_ERROR',
        'The location service could not be authenticated.',
      );
    }
    if (error.kind === 'invalid_response') {
      return writeError(
        response,
        502,
        'LOCATION_API_INVALID_RESPONSE',
        'Location results could not be processed.',
      );
    }
    return writeError(
      response,
      502,
      'LOCATION_API_REQUEST_FAILED',
      'The location service could not be reached.',
    );
  }
  if (error instanceof TimezoneResolutionError) {
    logFunctionError('Timezone resolution failed.', error);
    return writeError(
      response,
      502,
      'LOCATION_TIMEZONE_RESOLUTION_FAILED',
      'The timezone for a location candidate could not be resolved.',
    );
  }

  logFunctionError('Unexpected Location Function failure.', error);
  return writeError(
    response,
    500,
    'INTERNAL_SERVER_ERROR',
    'An unexpected server error occurred.',
  );
};

export const createLocationHandler = (
  findLocations?: FindLocations,
) => {
  const search = findLocations ?? (() => {
    const geocoder = new GeoapifyGeocoder();
    const timezoneResolver = new GeoTzTimezoneResolver();
    return (request: LocationSearchRequest) =>
      searchLocations(request, geocoder, timezoneResolver);
  })();

  return async (
    request: VercelRequest,
    response: VercelResponse,
  ): Promise<VercelResponse> => {
    response.setHeader('Allow', 'POST');
    if (request.method !== 'POST') {
      return writeError(
        response,
        405,
        'METHOD_NOT_ALLOWED',
        'Only POST requests are supported.',
      );
    }

    try {
      const body = readJsonBody(request);
      const locationRequest = validateLocationSearchRequest(body);
      return response.status(200).json(await search(locationRequest));
    } catch (error: unknown) {
      return handleError(response, error);
    }
  };
};

export default createLocationHandler();
