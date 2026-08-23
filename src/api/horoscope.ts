import type {
  HoroscopeErrorResponse,
  HoroscopeRequest,
  HoroscopeResponse,
} from '../data/horoscope/types';

export class HoroscopeApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'HoroscopeApiError';
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isErrorResponse = (value: unknown): value is HoroscopeErrorResponse => {
  if (!isRecord(value) || !isRecord(value.error)) return false;
  return (
    typeof value.error.code === 'string' &&
    typeof value.error.message === 'string'
  );
};

const isSuccessResponse = (value: unknown): value is HoroscopeResponse =>
  isRecord(value) &&
  isRecord(value.horoscope) &&
  isRecord(value.analysis) &&
  isRecord(value.visualProfile);

const parseJson = async (response: Response): Promise<unknown> => {
  try {
    return (await response.json()) as unknown;
  } catch {
    throw new HoroscopeApiError(
      response.status,
      'INVALID_RESPONSE',
      'The horoscope service returned an invalid response.',
    );
  }
};

export const requestHoroscope = async (
  request: HoroscopeRequest,
  fetchImpl: typeof fetch = fetch,
): Promise<HoroscopeResponse> => {
  let response: Response;
  try {
    response = await fetchImpl('/api/horoscope', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
  } catch {
    throw new HoroscopeApiError(
      0,
      'NETWORK_ERROR',
      'The horoscope service could not be reached.',
    );
  }

  const body = await parseJson(response);
  if (!response.ok) {
    if (isErrorResponse(body)) {
      throw new HoroscopeApiError(
        response.status,
        body.error.code,
        body.error.message,
      );
    }
    throw new HoroscopeApiError(
      response.status,
      'REQUEST_FAILED',
      'Horoscope data could not be generated.',
    );
  }

  if (!isSuccessResponse(body)) {
    throw new HoroscopeApiError(
      response.status,
      'INVALID_RESPONSE',
      'The horoscope service returned an invalid response.',
    );
  }
  return body;
};
