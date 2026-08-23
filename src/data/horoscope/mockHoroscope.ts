import type { PlanetData, HouseData, AnglePoint, AspectData } from "./types";

export const mockSun: PlanetData = {
    id: "sun",
    name:"Sun",
    longitude: 135,
    sign: "leo",
    degreeInSign: 15,
    house: 10,
    retrograde: false,
};

export const mockHouse: HouseData = {
    house: 1,
    cuspLongitude: 210,
};

export const mockAsc: AnglePoint = {
    name:"ASC",
    longitude: 201,
    sign:"scorpio",
    degreeInSign: 0,
};

export const mockAspect: AspectData = {
  bodyA: "sun",
  bodyB: "jupiter",
  type: "trine",
  angle: 118.4,
  orb: 1.6,
};
