import type { VercelRequest, VercelResponse } from '@vercel/node';

const DEFAULT_BODY_LIMIT_BYTES = 16 * 1024;

export class FunctionRequestError extends Error {
  constructor(
    readonly status: number,
    readonly code: 'INVALID_JSON' | 'REQUEST_BODY_TOO_LARGE',
    message: string,
  ) {
    super(message);
    this.name = 'FunctionRequestError';
  }
}

const firstHeader = (value: string | string[] | undefined): string =>
  Array.isArray(value) ? value[0] ?? '' : value ?? '';

export const readJsonBody = (
  request: VercelRequest,
  limit = DEFAULT_BODY_LIMIT_BYTES,
): unknown => {
  const contentType = firstHeader(request.headers['content-type']);
  if (!contentType.toLowerCase().startsWith('application/json')) {
    throw new FunctionRequestError(
      400,
      'INVALID_JSON',
      'Content-Type must be application/json',
    );
  }

  const contentLength = Number(firstHeader(request.headers['content-length']));
  if (Number.isFinite(contentLength) && contentLength > limit) {
    throw new FunctionRequestError(
      413,
      'REQUEST_BODY_TOO_LARGE',
      'Request body limit exceeded',
    );
  }

  let body: unknown = request.body;
  if (typeof body === 'string') {
    if (Buffer.byteLength(body, 'utf8') > limit) {
      throw new FunctionRequestError(
        413,
        'REQUEST_BODY_TOO_LARGE',
        'Request body limit exceeded',
      );
    }
    try {
      body = JSON.parse(body) as unknown;
    } catch {
      throw new FunctionRequestError(
        400,
        'INVALID_JSON',
        'Request body is not valid JSON',
      );
    }
  }

  if (body === undefined || body === null) {
    throw new FunctionRequestError(
      400,
      'INVALID_JSON',
      'A JSON body is required',
    );
  }

  let serialized: string;
  try {
    serialized = JSON.stringify(body);
  } catch {
    throw new FunctionRequestError(
      400,
      'INVALID_JSON',
      'Request body is not valid JSON',
    );
  }
  if (Buffer.byteLength(serialized, 'utf8') > limit) {
    throw new FunctionRequestError(
      413,
      'REQUEST_BODY_TOO_LARGE',
      'Request body limit exceeded',
    );
  }
  return body;
};

export const writeError = (
  response: VercelResponse,
  status: number,
  code: string,
  message: string,
): VercelResponse => response.status(status).json({ error: { code, message } });

export const logFunctionError = (message: string, error: unknown): void => {
  const detail = error instanceof Error
    ? `${error.name}: ${error.message}`
    : 'Unknown error';
  console.error(`${message} ${detail}`);
};
