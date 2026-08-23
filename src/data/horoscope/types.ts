export type PlanetId =
  | 'sun'
  | 'moon'
  | 'mercury'
  | 'venus'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'
  | 'pluto';

export type ZodiacSignId =
  | 'aries'
  | 'taurus'
  | 'gemini'
  | 'cancer'
  | 'leo'
  | 'virgo'
  | 'libra'
  | 'scorpio'
  | 'sagittarius'
  | 'capricorn'
  | 'aquarius'
  | 'pisces';

export type HouseNumber =
  | 1 | 2 | 3 | 4 | 5 | 6
  | 7 | 8 | 9 | 10 | 11 | 12;

export type BirthData = {
  date: string;
  time: string | null;
  timeKnown: boolean;
  city: string;
  latitude: number;
  longitude: number;
  timezone: string;
  houseSystem: 'placidus';
  zodiacType: 'tropical';
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
  name: 'ASC' | 'MC' | 'DSC' | 'IC';
  longitude: number;
  sign: ZodiacSignId;
  degreeInSign: number;
};

export type AspectType =
  | 'conjunction'
  | 'sextile'
  | 'square'
  | 'trine'
  | 'opposition';

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

export type PlanetDistribution = Array<{
  sign: ZodiacSignId;
  count: number;
}>;

export type HouseDistribution = Array<{
  house: HouseNumber;
  count: number;
}>;

export type HoroscopeAnalysis = {
  polarity: {
    masculine: number;
    feminine: number;
  };
  modalities: {
    cardinal: number;
    fixed: number;
    mutable: number;
  };
  elements: {
    fire: number;
    earth: number;
    air: number;
    water: number;
  };
  planetDistribution: PlanetDistribution;
  houseDistribution: HouseDistribution | null;
};

export type PlanetVisualData = {
  planetId: PlanetId;
  sign: ZodiacSignId;
  house: HouseNumber | null;
  retrograde: boolean;
};

export type HouseVisualData = {
  house: HouseNumber;
};

export type AspectVisualData = {
  bodyA: PlanetId;
  bodyB: PlanetId;
  type: AspectType;
  strength: number;
};

export type VisualProfileData = {
  mode: 'full' | 'partial';
  direction: {
    outward: number;
    inward: number;
  };
  motion: {
    cardinal: number;
    fixed: number;
    mutable: number;
  };
  palette: {
    fire: number;
    earth: number;
    air: number;
    water: number;
  };
  planets: PlanetVisualData[];
  houses: HouseVisualData[] | null;
  aspects: AspectVisualData[];
};

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

export type HoroscopeErrorResponse = {
  error: {
    code: string;
    message: string;
  };
};
