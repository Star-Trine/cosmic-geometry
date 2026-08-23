import assert from 'node:assert/strict';
import test from 'node:test';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { createHoroscopeHandler } from '../api/horoscope.js';
import { createLocationHandler } from '../api/location.js';
import type { HoroscopeResponse } from '../backend/src/api/horoscopeApiTypes.js';

type CapturedResponse = {
  statusCode: number;
  body: unknown;
  headers: Map<string, string>;
};

const request = (
  body: unknown,
  method = 'POST',
): VercelRequest => ({
  method,
  body,
  headers: { 'content-type': 'application/json' },
} as unknown as VercelRequest);

const response = (): [VercelResponse, CapturedResponse] => {
  const captured: CapturedResponse = {
    statusCode: 200,
    body: undefined,
    headers: new Map(),
  };
  const mock = {
    status(statusCode: number) {
      captured.statusCode = statusCode;
      return mock;
    },
    json(body: unknown) {
      captured.body = body;
      return mock;
    },
    setHeader(name: string, value: string) {
      captured.headers.set(name, value);
      return mock;
    },
  };
  return [mock as unknown as VercelResponse, captured];
};

const validHoroscopeRequest = {
  date: '1995-09-12',
  time: '14:30',
  timeKnown: true,
  place: {
    name: 'Tokyo, Japan',
    city: 'Tokyo',
    country: 'Japan',
    latitude: 35.6762,
    longitude: 139.6503,
    timezone: 'Asia/Tokyo',
  },
};

test('Horoscope Function validates and delegates to the existing service', async () => {
  const expected = {
    horoscope: {},
    analysis: {},
    visualProfile: {},
  } as HoroscopeResponse;
  let received: unknown;
  const handler = createHoroscopeHandler(async (value) => {
    received = value;
    return expected;
  });
  const [mockResponse, captured] = response();

  await handler(request(validHoroscopeRequest), mockResponse);

  assert.equal(captured.statusCode, 200);
  assert.deepEqual(captured.body, expected);
  assert.deepEqual(received, validHoroscopeRequest);
});

test('Horoscope Function rejects invalid input and unsupported methods', async () => {
  const handler = createHoroscopeHandler(async () => {
    throw new Error('must not run');
  });

  const [invalidResponse, invalid] = response();
  await handler(request({}), invalidResponse);
  assert.equal(invalid.statusCode, 400);
  assert.deepEqual(invalid.body, {
    error: {
      code: 'INVALID_INPUT',
      message: 'The birth information is invalid.',
    },
  });

  const [methodResponse, method] = response();
  await handler(request({}, 'GET'), methodResponse);
  assert.equal(method.statusCode, 405);
  assert.equal(method.headers.get('Allow'), 'POST');
});

test('Location Function validates and delegates to existing location logic', async () => {
  let received: unknown;
  const expected = {
    candidates: [
      {
        id: 'tokyo',
        label: 'Tokyo, Japan',
        locality: 'Tokyo',
        region: 'Tokyo',
        country: 'Japan',
        countryCode: 'jp',
        latitude: 35.6768601,
        longitude: 139.7638947,
        timezone: 'Asia/Tokyo',
      },
    ],
  };
  const handler = createLocationHandler(async (value) => {
    received = value;
    return expected;
  });
  const [mockResponse, captured] = response();

  await handler(
    request({ city: '  Tokyo ', country: ' Japan  ' }),
    mockResponse,
  );

  assert.equal(captured.statusCode, 200);
  assert.deepEqual(captured.body, expected);
  assert.deepEqual(received, { city: 'Tokyo', country: 'Japan' });
});

test('Location Function distinguishes malformed JSON and invalid input', async () => {
  const handler = createLocationHandler(async () => ({ candidates: [] }));

  const [jsonResponse, malformed] = response();
  await handler(request('{'), jsonResponse);
  assert.equal(malformed.statusCode, 400);
  assert.deepEqual(malformed.body, {
    error: {
      code: 'INVALID_JSON',
      message: 'A valid JSON body is required.',
    },
  });

  const [inputResponse, invalid] = response();
  await handler(request({ city: '', country: 'Japan' }), inputResponse);
  assert.equal(invalid.statusCode, 400);
  assert.deepEqual(invalid.body, {
    error: {
      code: 'INVALID_INPUT',
      message: 'The location search is invalid.',
    },
  });
});
