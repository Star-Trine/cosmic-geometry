import type {
  HoroscopeRequest,
  HoroscopeResponse,
} from "../api/horoscopeApiTypes.js";
import { fetchFreeAstroNatal } from "../freeAstro/client.js";
import { normalizeFreeAstroNatalResponse } from "../freeAstro/normalizeNatalResponse.js";
import { validateFreeAstroNatalResponse } from "../freeAstro/validateNatalResponse.js";
import { calculateBasicAnalysis } from "../horoscope/calculateBasicAnalysis.js";
import { calculateVisualProfile } from "../horoscope/calculateVisualProfile.js";

export type HoroscopeServiceErrorKind =
  | "invalid_api_response"
  | "normalization"
  | "analysis"
  | "visual_profile";

export class HoroscopeServiceError extends Error {
  constructor(
    readonly kind: HoroscopeServiceErrorKind,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "HoroscopeServiceError";
  }
}

export type FetchNatal = (request: HoroscopeRequest) => Promise<unknown>;

export const createHoroscope = async (
  request: HoroscopeRequest,
  fetchNatal: FetchNatal = fetchFreeAstroNatal,
): Promise<HoroscopeResponse> => {
  const rawResponse = await fetchNatal(request);

  let validatedResponse: ReturnType<typeof validateFreeAstroNatalResponse>;
  try {
    validatedResponse = validateFreeAstroNatalResponse(rawResponse);
  } catch (error: unknown) {
    throw new HoroscopeServiceError(
      "invalid_api_response",
      "FreeAstroAPI response validation failed",
      { cause: error },
    );
  }

  let horoscope: HoroscopeResponse["horoscope"];
  try {
    horoscope = normalizeFreeAstroNatalResponse(validatedResponse);
  } catch (error: unknown) {
    throw new HoroscopeServiceError(
      "normalization",
      "Horoscope normalization failed",
      { cause: error },
    );
  }

  let analysis: HoroscopeResponse["analysis"];
  try {
    analysis = calculateBasicAnalysis(horoscope.planets);
  } catch (error: unknown) {
    throw new HoroscopeServiceError(
      "analysis",
      "Horoscope analysis failed",
      { cause: error },
    );
  }

  let visualProfile: HoroscopeResponse["visualProfile"];
  try {
    visualProfile = calculateVisualProfile(horoscope, analysis);
  } catch (error: unknown) {
    throw new HoroscopeServiceError(
      "visual_profile",
      "Visual Profile generation failed",
      { cause: error },
    );
  }

  return { horoscope, analysis, visualProfile };
};
