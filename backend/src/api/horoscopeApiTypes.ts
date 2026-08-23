import type { HoroscopeAnalysis } from "../horoscope/analysisTypes.js";
import type { HoroscopeData } from "../horoscope/types.js";
import type { VisualProfileData } from "../horoscope/visualProfileTypes.js";

export type HoroscopeRequest = {
  date: string;
  time: string | null;
  timeKnown: boolean;
  place: {
    name: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    timezone: string;
  };
};

export type HoroscopeResponse = {
  horoscope: HoroscopeData;
  analysis: HoroscopeAnalysis;
  visualProfile: VisualProfileData;
};

export type HoroscopeErrorCode =
  | "INVALID_INPUT"
  | "INVALID_JSON"
  | "REQUEST_BODY_TOO_LARGE"
  | "METHOD_NOT_ALLOWED"
  | "NOT_FOUND"
  | "ASTRO_API_RATE_LIMIT"
  | "ASTRO_API_AUTH_ERROR"
  | "ASTRO_API_REQUEST_FAILED"
  | "ASTRO_API_INVALID_RESPONSE"
  | "NORMALIZATION_ERROR"
  | "ANALYSIS_ERROR"
  | "VISUAL_PROFILE_ERROR"
  | "INTERNAL_SERVER_ERROR";

export type HoroscopeErrorResponse = {
  error: {
    code: HoroscopeErrorCode;
    message: string;
  };
};
