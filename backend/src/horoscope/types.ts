export const PLANET_IDS = [
  "sun",
  "moon",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
] as const;

export type PlanetId = (typeof PLANET_IDS)[number];

export const ZODIAC_SIGN_IDS = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
] as const;

export type ZodiacSignId = (typeof ZODIAC_SIGN_IDS)[number];

export type HouseSystem = "placidus";
export type ZodiacType = "tropical";

export type BirthData = {
  date: string;
  time: string | null;
  timeKnown: boolean;
  city: string;
  latitude: number;
  longitude: number;
  timezone: string;
  houseSystem: HouseSystem;
  zodiacType: ZodiacType;
};

export type PlanetData = {
  id: PlanetId;
  name: string;
  longitude: number;
  sign: ZodiacSignId;
  degreeInSign: number;
  house: number | null;
  retrograde: boolean;
};

export type HouseData = {
  house: number;
  cuspLongitude: number;
};

export type AnglePoint = {
  name: "ASC" | "MC" | "DSC" | "IC";
  longitude: number;
  sign: ZodiacSignId;
  degreeInSign: number;
};

export type AspectType =
  | "conjunction"
  | "sextile"
  | "square"
  | "trine"
  | "opposition";

export type AspectData = {
  bodyA: PlanetId;
  bodyB: PlanetId;
  type: AspectType;
  angle: number;
  orb: number;
};

export type HoroscopeData = {
  birth: BirthData;
  planets: PlanetData[];
  houses: HouseData[] | null;
  angles: AnglePoint[] | null;
  aspects: AspectData[];
};
