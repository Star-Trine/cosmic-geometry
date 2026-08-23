import type { ZodiacSignId } from "../horoscope/types.js";

export type FreeAstroPlanet = {
  id: string;
  name: string;
  sign_id: ZodiacSignId;
  pos: number;
  abs_pos: number;
  retrograde: boolean;
  house?: number;
};

export type FreeAstroHouse = {
  house: number;
  abs_pos: number;
};

export type FreeAstroAngleDetail = {
  sign_id: ZodiacSignId;
  pos: number;
  abs_pos: number;
};

export type FreeAstroNatalResponse = {
  subject: {
    datetime: string;
    location: {
      city: string;
      lat: number;
      lng: number;
      timezone: string;
    };
    settings: {
      house_system: string;
      zodiac_type: string;
      time_known: boolean;
    };
  };
  planets: FreeAstroPlanet[];
  houses?: FreeAstroHouse[];
  angles?: unknown;
  angles_details?: {
    asc: FreeAstroAngleDetail;
    mc: FreeAstroAngleDetail;
    dc: FreeAstroAngleDetail;
    ic: FreeAstroAngleDetail;
  };
  aspects?: unknown[];
  aspects_summary?: unknown;
  confidence?: unknown;
};
