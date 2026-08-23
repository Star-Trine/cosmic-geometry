import assert from "node:assert/strict";
import test from "node:test";

import type { HoroscopeRequest } from "../api/horoscopeApiTypes.js";
import { fetchFreeAstroNatal, FreeAstroClientError } from "./client.js";

const request = (timeKnown: boolean): HoroscopeRequest => ({
  date: "1995-09-12",
  time: timeKnown ? "14:30" : null,
  timeKnown,
  place: {
    name: "Tokyo, Japan",
    city: "Tokyo",
    country: "Japan",
    latitude: 35.6762,
    longitude: 139.6503,
    timezone: "Asia/Tokyo",
  },
});

test("sends hour and minute only when the birth time is known", async () => {
  const payloads: Array<Record<string, unknown>> = [];
  const fetchImpl = (async (_input, init) => {
    payloads.push(JSON.parse(String(init?.body)) as Record<string, unknown>);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }) as typeof fetch;

  await fetchFreeAstroNatal(request(true), { apiKey: "test-key", fetchImpl });
  await fetchFreeAstroNatal(request(false), { apiKey: "test-key", fetchImpl });

  assert.equal(payloads[0]?.hour, 14);
  assert.equal(payloads[0]?.minute, 30);
  assert.equal(payloads[1]?.time_known, false);
  assert.equal(Object.hasOwn(payloads[1] ?? {}, "hour"), false);
  assert.equal(Object.hasOwn(payloads[1] ?? {}, "minute"), false);
});

test("maps an aborted request to request_failed", async () => {
  const fetchImpl = ((_input, init) =>
    new Promise<Response>((_resolve, reject) => {
      const keepAlive = setTimeout(() => {
        reject(new Error("Abort signal was not received"));
      }, 100);
      init?.signal?.addEventListener("abort", () => {
        clearTimeout(keepAlive);
        reject(new DOMException("Timed out", "AbortError"));
      });
    })) as typeof fetch;

  await assert.rejects(
    () =>
      fetchFreeAstroNatal(request(true), {
        apiKey: "test-key",
        timeoutMs: 5,
        fetchImpl,
      }),
    (error: unknown) =>
      error instanceof FreeAstroClientError && error.kind === "request_failed",
  );
});

test("maps upstream rate limit, authentication, and invalid JSON", async () => {
  for (const [status, expectedKind] of [
    [429, "rate_limit"],
    [401, "authentication"],
  ] as const) {
    const fetchImpl = (async () => new Response("{}", { status })) as typeof fetch;
    await assert.rejects(
      () => fetchFreeAstroNatal(request(true), { apiKey: "test-key", fetchImpl }),
      (error: unknown) =>
        error instanceof FreeAstroClientError && error.kind === expectedKind,
    );
  }

  const invalidJsonFetch = (async () =>
    new Response("not json", { status: 200 })) as typeof fetch;
  await assert.rejects(
    () =>
      fetchFreeAstroNatal(request(true), {
        apiKey: "test-key",
        fetchImpl: invalidJsonFetch,
      }),
    (error: unknown) =>
      error instanceof FreeAstroClientError && error.kind === "invalid_json",
  );
});
