import * as http from "node:http";

import type {
  HoroscopeErrorCode,
  HoroscopeRequest,
  HoroscopeResponse,
} from "../api/horoscopeApiTypes.js";
import {
  HoroscopeRequestValidationError,
  validateHoroscopeRequest,
} from "../api/validateHoroscopeRequest.js";
import { FreeAstroClientError } from "../freeAstro/client.js";
import {
  createHoroscope,
  HoroscopeServiceError,
} from "../services/createHoroscope.js";
import { GeoapifyGeocoder, GeoapifyGeocoderError } from "../location/geoapifyGeocoder.js";
import {
  GeoTzTimezoneResolver,
  TimezoneResolutionError,
} from "../location/geoTzTimezoneResolver.js";
import {
  LocationRequestValidationError,
  searchLocations,
  validateLocationSearchRequest,
} from "../location/locationService.js";
import type {
  LocationErrorCode,
  LocationSearchRequest,
  LocationSearchResponse,
} from "../location/types.js";

const DEFAULT_BODY_LIMIT_BYTES = 16 * 1024;

type CreateHoroscope = (
  request: HoroscopeRequest,
) => Promise<HoroscopeResponse>;

type SearchLocations = (
  request: LocationSearchRequest,
) => Promise<LocationSearchResponse>;

type HttpErrorResponse = {
  error: {
    code: HoroscopeErrorCode | LocationErrorCode;
    message: string;
  };
};

type Logger = {
  error: (message: string, error?: unknown) => void;
};

export type HoroscopeServerOptions = {
  createHoroscope?: CreateHoroscope;
  searchLocations?: SearchLocations;
  allowedOrigin?: string | null;
  bodyLimitBytes?: number;
  logger?: Logger;
};

class InvalidJsonError extends Error {}
class RequestBodyTooLargeError extends Error {}

const writeJson = (
  response: http.ServerResponse,
  status: number,
  body: HoroscopeResponse | LocationSearchResponse | HttpErrorResponse,
): void => {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(body));
};

const writeError = (
  response: http.ServerResponse,
  status: number,
  code: HoroscopeErrorCode | LocationErrorCode,
  message: string,
): void => writeJson(response, status, { error: { code, message } });

const readJsonBody = async (
  request: http.IncomingMessage,
  limit: number,
): Promise<unknown> => {
  const contentType = request.headers["content-type"] ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    throw new InvalidJsonError("Content-Type must be application/json");
  }

  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > limit) {
      throw new RequestBodyTooLargeError("Request body limit exceeded");
    }
    chunks.push(buffer);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
  } catch (error: unknown) {
    throw new InvalidJsonError("Request body is not valid JSON", {
      cause: error,
    });
  }
};

const applyCors = (
  request: http.IncomingMessage,
  response: http.ServerResponse,
  allowedOrigin: string | null,
): void => {
  const origin = request.headers.origin;
  if (!allowedOrigin || origin !== allowedOrigin) return;

  response.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  response.setHeader("Vary", "Origin");
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
};

const logError = (logger: Logger, message: string, error: unknown): void => {
  const details: string[] = [];
  let current: unknown = error;
  for (let depth = 0; depth < 4 && current instanceof Error; depth += 1) {
    details.push(`${current.name}: ${current.message}`);
    current = current.cause;
  }
  logger.error(`${message} ${details.join(" <- ") || "Unknown error"}`);
};

const handleKnownError = (
  response: http.ServerResponse,
  error: unknown,
  logger: Logger,
): boolean => {
  if (error instanceof RequestBodyTooLargeError) {
    writeError(
      response,
      413,
      "REQUEST_BODY_TOO_LARGE",
      "The request body is too large.",
    );
    return true;
  }
  if (error instanceof InvalidJsonError) {
    writeError(response, 400, "INVALID_JSON", "A valid JSON body is required.");
    return true;
  }
  if (error instanceof HoroscopeRequestValidationError) {
    writeError(response, 400, "INVALID_INPUT", "The birth information is invalid.");
    return true;
  }
  if (error instanceof LocationRequestValidationError) {
    writeError(response, 400, "INVALID_INPUT", "The location search is invalid.");
    return true;
  }
  if (error instanceof GeoapifyGeocoderError) {
    logError(logger, "Geoapify request failed.", error);
    if (error.kind === "rate_limit") {
      writeError(
        response,
        429,
        "LOCATION_API_RATE_LIMIT",
        "The location service is temporarily busy. Please try again later.",
      );
    } else if (error.kind === "authentication") {
      writeError(
        response,
        502,
        "LOCATION_API_AUTH_ERROR",
        "The location service could not be authenticated.",
      );
    } else if (error.kind === "invalid_response") {
      writeError(
        response,
        502,
        "LOCATION_API_INVALID_RESPONSE",
        "Location results could not be processed.",
      );
    } else {
      writeError(
        response,
        502,
        "LOCATION_API_REQUEST_FAILED",
        "The location service could not be reached.",
      );
    }
    return true;
  }
  if (error instanceof TimezoneResolutionError) {
    logError(logger, "Timezone resolution failed.", error);
    writeError(
      response,
      502,
      "LOCATION_TIMEZONE_RESOLUTION_FAILED",
      "The timezone for a location candidate could not be resolved.",
    );
    return true;
  }
  if (error instanceof FreeAstroClientError) {
    logError(logger, "FreeAstroAPI request failed.", error);
    if (error.kind === "rate_limit") {
      writeError(
        response,
        429,
        "ASTRO_API_RATE_LIMIT",
        "The horoscope service is temporarily busy. Please try again later.",
      );
    } else if (error.kind === "authentication") {
      writeError(
        response,
        502,
        "ASTRO_API_AUTH_ERROR",
        "The horoscope service could not be authenticated.",
      );
    } else if (error.kind === "invalid_json") {
      writeError(
        response,
        502,
        "ASTRO_API_INVALID_RESPONSE",
        "Horoscope data could not be generated.",
      );
    } else {
      writeError(
        response,
        502,
        "ASTRO_API_REQUEST_FAILED",
        "The horoscope service could not be reached.",
      );
    }
    return true;
  }
  if (error instanceof HoroscopeServiceError) {
    logError(logger, "Horoscope generation failed.", error);
    const mapping: Record<
      HoroscopeServiceError["kind"],
      { status: number; code: HoroscopeErrorCode; message: string }
    > = {
      invalid_api_response: {
        status: 502,
        code: "ASTRO_API_INVALID_RESPONSE",
        message: "Horoscope data could not be generated.",
      },
      normalization: {
        status: 500,
        code: "NORMALIZATION_ERROR",
        message: "Horoscope data could not be processed.",
      },
      analysis: {
        status: 500,
        code: "ANALYSIS_ERROR",
        message: "Horoscope analysis could not be generated.",
      },
      visual_profile: {
        status: 500,
        code: "VISUAL_PROFILE_ERROR",
        message: "The visual profile could not be generated.",
      },
    };
    const mapped = mapping[error.kind];
    writeError(response, mapped.status, mapped.code, mapped.message);
    return true;
  }
  return false;
};

export const createHoroscopeServer = (
  options: HoroscopeServerOptions = {},
): http.Server => {
  const generateHoroscope = options.createHoroscope ?? createHoroscope;
  const geoapifyGeocoder = new GeoapifyGeocoder();
  const timezoneResolver = new GeoTzTimezoneResolver();
  const findLocations =
    options.searchLocations ??
    ((request: LocationSearchRequest) =>
      searchLocations(request, geoapifyGeocoder, timezoneResolver));
  const allowedOrigin =
    options.allowedOrigin === undefined
      ? process.env.FRONTEND_ORIGIN?.trim() || null
      : options.allowedOrigin;
  const bodyLimit = options.bodyLimitBytes ?? DEFAULT_BODY_LIMIT_BYTES;
  const logger = options.logger ?? console;

  return http.createServer(async (request, response) => {
    applyCors(request, response, allowedOrigin);
    const path = new URL(request.url ?? "/", "http://localhost").pathname;

    if (path !== "/api/horoscope" && path !== "/api/location") {
      writeError(response, 404, "NOT_FOUND", "The requested endpoint was not found.");
      return;
    }
    if (request.method === "OPTIONS") {
      response.statusCode = 204;
      response.end();
      return;
    }
    if (request.method !== "POST") {
      response.setHeader("Allow", "POST, OPTIONS");
      writeError(
        response,
        405,
        "METHOD_NOT_ALLOWED",
        "Only POST requests are supported.",
      );
      return;
    }

    try {
      const body = await readJsonBody(request, bodyLimit);
      if (path === "/api/location") {
        const locationRequest = validateLocationSearchRequest(body);
        const result = await findLocations(locationRequest);
        writeJson(response, 200, result);
      } else {
        const horoscopeRequest = validateHoroscopeRequest(body);
        const result = await generateHoroscope(horoscopeRequest);
        writeJson(response, 200, result);
      }
    } catch (error: unknown) {
      if (handleKnownError(response, error, logger)) return;
      logError(logger, `Unexpected ${path} endpoint failure.`, error);
      writeError(
        response,
        500,
        "INTERNAL_SERVER_ERROR",
        "An unexpected server error occurred.",
      );
    }
  });
};
