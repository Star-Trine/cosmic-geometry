import type { VercelRequest, VercelResponse } from '@vercel/node';

import {
  HoroscopeRequestValidationError,
  validateHoroscopeRequest,
} from '../backend/src/api/validateHoroscopeRequest.js';
import { FreeAstroClientError } from '../backend/src/freeAstro/client.js';
import type {
  HoroscopeRequest,
  HoroscopeResponse,
} from '../backend/src/api/horoscopeApiTypes.js';
import {
  createHoroscope,
  HoroscopeServiceError,
} from '../backend/src/services/createHoroscope.js';
import {
  FunctionRequestError,
  logFunctionError,
  readJsonBody,
  writeError,
} from './_request.js';

type GenerateHoroscope = (
  request: HoroscopeRequest,
) => Promise<HoroscopeResponse>;

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
  if (error instanceof HoroscopeRequestValidationError) {
    return writeError(
      response,
      400,
      'INVALID_INPUT',
      'The birth information is invalid.',
    );
  }
  if (error instanceof FreeAstroClientError) {
    logFunctionError('FreeAstroAPI request failed.', error);
    if (error.kind === 'rate_limit') {
      return writeError(
        response,
        429,
        'ASTRO_API_RATE_LIMIT',
        'The horoscope service is temporarily busy. Please try again later.',
      );
    }
    if (error.kind === 'authentication') {
      return writeError(
        response,
        502,
        'ASTRO_API_AUTH_ERROR',
        'The horoscope service could not be authenticated.',
      );
    }
    if (error.kind === 'invalid_json') {
      return writeError(
        response,
        502,
        'ASTRO_API_INVALID_RESPONSE',
        'Horoscope data could not be generated.',
      );
    }
    return writeError(
      response,
      502,
      'ASTRO_API_REQUEST_FAILED',
      'The horoscope service could not be reached.',
    );
  }
  if (error instanceof HoroscopeServiceError) {
    logFunctionError('Horoscope generation failed.', error);
    const mapping = {
      invalid_api_response: [502, 'ASTRO_API_INVALID_RESPONSE', 'Horoscope data could not be generated.'],
      normalization: [500, 'NORMALIZATION_ERROR', 'Horoscope data could not be processed.'],
      analysis: [500, 'ANALYSIS_ERROR', 'Horoscope analysis could not be generated.'],
      visual_profile: [500, 'VISUAL_PROFILE_ERROR', 'The visual profile could not be generated.'],
    } as const;
    const [status, code, message] = mapping[error.kind];
    return writeError(response, status, code, message);
  }

  logFunctionError('Unexpected Horoscope Function failure.', error);
  return writeError(
    response,
    500,
    'INTERNAL_SERVER_ERROR',
    'An unexpected server error occurred.',
  );
};

export const createHoroscopeHandler = (
  generateHoroscope: GenerateHoroscope = createHoroscope,
) => async (
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
    const horoscopeRequest = validateHoroscopeRequest(body);
    return response.status(200).json(await generateHoroscope(horoscopeRequest));
  } catch (error: unknown) {
    return handleError(response, error);
  }
};

export default createHoroscopeHandler();
