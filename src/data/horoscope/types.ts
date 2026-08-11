export type PlanetData = {
  name: string;
  longitude: number;
  sign: string;
  degreeInSign: number;
  house: number;
  retrograde: boolean;
};

export type HouseData = {
  house: number;
  cuspLongitude: number;
};

export type AnglePoint = {
  name: "ASC" | "MC" | "DSC" | "IC";
  longitude: number;
  sign: string;
  degreeInSign: number;
};

export type AspectData = {
  bodyA: string;
  bodyB: string;
  type: "conjunction" | "sextile" | "square" | "trine" | "opposition";
  angle: number;
  orb: number;
};