import { calculateAspects } from "../horoscope/calculateAspects.js";
import {
  PLANET_IDS,
  type AnglePoint,
  type BirthData,
  type HoroscopeData,
  type HouseData,
  type HouseSystem,
  type PlanetData,
  type PlanetId,
  type ZodiacType,
} from "../horoscope/types.js";
import type { FreeAstroNatalResponse } from "./types.js";
import { validateFreeAstroNatalResponse } from "./validateNatalResponse.js";

const PLANET_ID_SET = new Set<string>(PLANET_IDS);

const normalizeHouseSystem = (value: string): HouseSystem => {
  if (value.toLowerCase() !== "placidus") {
    throw new RangeError(`Unsupported house system: ${value}`);
  }
  return "placidus";
};

const normalizeZodiacType = (value: string): ZodiacType => {
  if (value.toLowerCase() !== "tropical") {
    throw new RangeError(`Unsupported zodiac type: ${value}`);
  }
  return "tropical";
};

const normalizeBirth = (response: FreeAstroNatalResponse): BirthData => {
  const datetimeMatch =
    /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})$/.exec(
      response.subject.datetime,
    );
  if (!datetimeMatch) {
    throw new TypeError("subject.datetime must be an ISO 8601 datetime");
  }

  const date = datetimeMatch[1];
  const apiTime = datetimeMatch[2];
  if (!date || !apiTime) {
    throw new TypeError("subject.datetime is missing its date or time");
  }

  const timeKnown = response.subject.settings.time_known;
  return {
    date,
    time: timeKnown ? apiTime : null,
    timeKnown,
    city: response.subject.location.city,
    latitude: response.subject.location.lat,
    longitude: response.subject.location.lng,
    timezone: response.subject.location.timezone,
    houseSystem: normalizeHouseSystem(response.subject.settings.house_system),
    zodiacType: normalizeZodiacType(response.subject.settings.zodiac_type),
  };
};

const normalizePlanets = (response: FreeAstroNatalResponse): PlanetData[] => {
  const planetsById = new Map(response.planets.map((planet) => [planet.id, planet]));

  return PLANET_IDS.map((id) => {
    const planet = planetsById.get(id);
    if (!planet || !PLANET_ID_SET.has(planet.id)) {
      throw new TypeError(`Missing required planet: ${id}`);
    }

    return {
      id: planet.id as PlanetId,
      name: planet.name,
      longitude: planet.abs_pos,
      sign: planet.sign_id,
      degreeInSign: planet.pos,
      house: planet.house ?? null,
      retrograde: planet.retrograde,
    };
  });
};

const normalizeHouses = (response: FreeAstroNatalResponse): HouseData[] | null => {
  if (!response.subject.settings.time_known) return null;
  if (!response.houses) {
    throw new TypeError("Validated known-time response is missing houses");
  }

  return [...response.houses]
    .sort((a, b) => a.house - b.house)
    .map((house) => ({
      house: house.house,
      cuspLongitude: house.abs_pos,
    }));
};

const normalizeAngles = (response: FreeAstroNatalResponse): AnglePoint[] | null => {
  if (!response.subject.settings.time_known) return null;
  if (!response.angles_details) {
    throw new TypeError("Validated known-time response is missing angles_details");
  }

  const { asc, mc, dc, ic } = response.angles_details;
  return [
    {
      name: "ASC",
      longitude: asc.abs_pos,
      sign: asc.sign_id,
      degreeInSign: asc.pos,
    },
    {
      name: "MC",
      longitude: mc.abs_pos,
      sign: mc.sign_id,
      degreeInSign: mc.pos,
    },
    {
      name: "DSC",
      longitude: dc.abs_pos,
      sign: dc.sign_id,
      degreeInSign: dc.pos,
    },
    {
      name: "IC",
      longitude: ic.abs_pos,
      sign: ic.sign_id,
      degreeInSign: ic.pos,
    },
  ];
};

export const normalizeFreeAstroNatalResponse = (
  value: unknown,
): HoroscopeData => {
  const response = validateFreeAstroNatalResponse(value);
  const planets = normalizePlanets(response);

  return {
    birth: normalizeBirth(response),
    planets,
    houses: normalizeHouses(response),
    angles: normalizeAngles(response),
    aspects: calculateAspects(planets),
  };
};
