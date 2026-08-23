import type { ZodiacSignId } from "./types.js";

export type Polarity = "masculine" | "feminine";
export type Modality = "cardinal" | "fixed" | "mutable";
export type Element = "fire" | "earth" | "air" | "water";

export type SignClassification = {
  polarity: Polarity;
  modality: Modality;
  element: Element;
};

export const SIGN_CLASSIFICATIONS = {
  aries: {
    polarity: "masculine",
    modality: "cardinal",
    element: "fire",
  },
  taurus: {
    polarity: "feminine",
    modality: "fixed",
    element: "earth",
  },
  gemini: {
    polarity: "masculine",
    modality: "mutable",
    element: "air",
  },
  cancer: {
    polarity: "feminine",
    modality: "cardinal",
    element: "water",
  },
  leo: {
    polarity: "masculine",
    modality: "fixed",
    element: "fire",
  },
  virgo: {
    polarity: "feminine",
    modality: "mutable",
    element: "earth",
  },
  libra: {
    polarity: "masculine",
    modality: "cardinal",
    element: "air",
  },
  scorpio: {
    polarity: "feminine",
    modality: "fixed",
    element: "water",
  },
  sagittarius: {
    polarity: "masculine",
    modality: "mutable",
    element: "fire",
  },
  capricorn: {
    polarity: "feminine",
    modality: "cardinal",
    element: "earth",
  },
  aquarius: {
    polarity: "masculine",
    modality: "fixed",
    element: "air",
  },
  pisces: {
    polarity: "feminine",
    modality: "mutable",
    element: "water",
  },
} as const satisfies Record<ZodiacSignId, SignClassification>;
