import type { HoroscopeRequest } from "./api/horoscopeApiTypes.js";
import {
  fetchFreeAstroNatal,
  type FreeAstroResponseMetadata,
} from "./freeAstro/client.js";

const fixture: HoroscopeRequest = {
  date: "1995-09-12",
  time: null,
  timeKnown: false,
  place: {
    name: "Minimal API Test - Tokyo - Unknown Time",
    city: "Tokyo",
    country: "Japan",
    latitude: 35.6762,
    longitude: 139.6503,
    timezone: "Asia/Tokyo",
  },
};

const printMetadata = (metadata: FreeAstroResponseMetadata): void => {
  console.log(`HTTP status: ${metadata.status} ${metadata.statusText}`);
  console.log(`Content-Type: ${metadata.contentType ?? "(not provided)"}`);
  console.log("Rate-limit headers:", metadata.rateLimit);
};

try {
  const responseJson = await fetchFreeAstroNatal(fixture, {
    onResponse: printMetadata,
  });
  console.log("Raw JSON response:");
  console.log(JSON.stringify(responseJson, null, 2));
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`FreeAstroAPI request failed: ${message}`);
  process.exitCode = 1;
}
