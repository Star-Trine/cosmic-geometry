import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import test from "node:test";

import type {
  HoroscopeErrorResponse,
  HoroscopeResponse,
} from "../api/horoscopeApiTypes.js";
import { FreeAstroClientError } from "../freeAstro/client.js";
import { GeoapifyGeocoderError } from "../location/geoapifyGeocoder.js";
import { createHoroscopeServer } from "./horoscopeServer.js";

const validRequest = {
  date: "1995-09-12",
  time: "14:30",
  timeKnown: true,
  place: {
    name: "Tokyo, Japan",
    city: "Tokyo",
    country: "Japan",
    latitude: 35.6762,
    longitude: 139.6503,
    timezone: "Asia/Tokyo",
  },
};

const successResponse = {
  horoscope: {},
  analysis: {},
  visualProfile: {},
} as HoroscopeResponse;

const silentLogger = { error: () => undefined };

const withServer = async (
  options: Parameters<typeof createHoroscopeServer>[0],
  run: (baseUrl: string) => Promise<void>,
): Promise<void> => {
  const server = createHoroscopeServer({ ...options, logger: silentLogger });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address() as AddressInfo;
  try {
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
};

const post = (
  baseUrl: string,
  body: string = JSON.stringify(validRequest),
): Promise<Response> =>
  fetch(`${baseUrl}/api/horoscope`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

const postLocation = (
  baseUrl: string,
  value: unknown,
): Promise<Response> =>
  fetch(`${baseUrl}/api/location`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value),
  });

const errorCode = async (response: Response): Promise<string> => {
  const body = (await response.json()) as HoroscopeErrorResponse;
  return body.error.code;
};

test("returns 200 for a successful horoscope request", async () => {
  await withServer(
    { createHoroscope: async () => successResponse },
    async (baseUrl) => {
      const response = await post(baseUrl);
      assert.equal(response.status, 200);
      assert.deepEqual(await response.json(), successResponse);
    },
  );
});

test("distinguishes invalid JSON, invalid input, and oversized bodies", async () => {
  await withServer(
    { createHoroscope: async () => successResponse, bodyLimitBytes: 64 },
    async (baseUrl) => {
      const invalidJson = await post(baseUrl, "{");
      assert.equal(invalidJson.status, 400);
      assert.equal(await errorCode(invalidJson), "INVALID_JSON");

      const invalidInput = await post(baseUrl, JSON.stringify({}));
      assert.equal(invalidInput.status, 400);
      assert.equal(await errorCode(invalidInput), "INVALID_INPUT");

      const oversized = await post(baseUrl, JSON.stringify(validRequest));
      assert.equal(oversized.status, 413);
      assert.equal(await errorCode(oversized), "REQUEST_BODY_TOO_LARGE");
    },
  );
});

test("returns 405 for unsupported methods", async () => {
  await withServer({}, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/horoscope`);
    assert.equal(response.status, 405);
    assert.equal(await errorCode(response), "METHOD_NOT_ALLOWED");
  });
});

test("answers configured CORS preflight without using a wildcard", async () => {
  await withServer({ allowedOrigin: "http://localhost:3000" }, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/horoscope`, {
      method: "OPTIONS",
      headers: { Origin: "http://localhost:3000" },
    });
    assert.equal(response.status, 204);
    assert.equal(
      response.headers.get("access-control-allow-origin"),
      "http://localhost:3000",
    );
    assert.equal(
      response.headers.get("access-control-allow-methods"),
      "POST, OPTIONS",
    );
    assert.notEqual(response.headers.get("access-control-allow-origin"), "*");
  });
});

test("maps rate limit and upstream failures", async () => {
  for (const [error, status, code] of [
    [
      new FreeAstroClientError("rate_limit", "rate limited", 429),
      429,
      "ASTRO_API_RATE_LIMIT",
    ],
    [
      new FreeAstroClientError("request_failed", "network failed"),
      502,
      "ASTRO_API_REQUEST_FAILED",
    ],
  ] as const) {
    await withServer(
      {
        createHoroscope: async () => {
          throw error;
        },
      },
      async (baseUrl) => {
        const response = await post(baseUrl);
        assert.equal(response.status, status);
        assert.equal(await errorCode(response), code);
      },
    );
  }
});

test("maps unexpected failures to 500", async () => {
  await withServer(
    {
      createHoroscope: async () => {
        throw new Error("unexpected");
      },
    },
    async (baseUrl) => {
      const response = await post(baseUrl);
      assert.equal(response.status, 500);
      assert.equal(await errorCode(response), "INTERNAL_SERVER_ERROR");
    },
  );
});

test("returns normalized location candidates from /api/location", async () => {
  await withServer(
    {
      searchLocations: async (request) => ({
        candidates: [
          {
            id: "tokyo",
            label: `${request.city}, ${request.country}`,
            locality: request.city,
            region: "Tokyo",
            country: request.country,
            countryCode: "jp",
            latitude: 35.6762,
            longitude: 139.6503,
            timezone: "Asia/Tokyo",
          },
        ],
      }),
    },
    async (baseUrl) => {
      const response = await postLocation(baseUrl, {
        city: " Tokyo ",
        country: " Japan ",
      });
      assert.equal(response.status, 200);
      const body = (await response.json()) as {
        candidates: Array<Record<string, unknown>>;
      };
      assert.equal(body.candidates[0]?.label, "Tokyo, Japan");
      assert.equal(typeof body.candidates[0]?.latitude, "number");
      assert.equal(body.candidates[0]?.timezone, "Asia/Tokyo");
      assert.equal("formatted" in (body.candidates[0] ?? {}), false);
    },
  );
});

test("rejects invalid location requests and supports zero candidates", async () => {
  await withServer(
    { searchLocations: async () => ({ candidates: [] }) },
    async (baseUrl) => {
      for (const request of [
        { city: "", country: "Japan" },
        { city: "Tokyo", country: "" },
        [],
      ]) {
        const response = await postLocation(baseUrl, request);
        assert.equal(response.status, 400);
        assert.equal(await errorCode(response), "INVALID_INPUT");
      }

      const response = await postLocation(baseUrl, {
        city: "Nowhere",
        country: "Nowhere",
      });
      assert.equal(response.status, 200);
      assert.deepEqual(await response.json(), { candidates: [] });
    },
  );
});

test("maps Geoapify failures at /api/location", async () => {
  await withServer(
    {
      searchLocations: async () => {
        throw new GeoapifyGeocoderError(
          "request_failed",
          "upstream unavailable",
          500,
        );
      },
    },
    async (baseUrl) => {
      const response = await postLocation(baseUrl, {
        city: "Tokyo",
        country: "Japan",
      });
      assert.equal(response.status, 502);
      assert.equal(await errorCode(response), "LOCATION_API_REQUEST_FAILED");
    },
  );
});
