import {
  PLANET_IDS,
  ZODIAC_SIGN_IDS,
  type PlanetId,
  type ZodiacSignId,
} from "../horoscope/types.js";
import type {
  FreeAstroAngleDetail,
  FreeAstroHouse,
  FreeAstroNatalResponse,
  FreeAstroPlanet,
} from "./types.js";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const requireRecord = (
  value: unknown,
  path: string,
): Record<string, unknown> => {
  if (!isRecord(value)) {
    throw new TypeError(`${path} must be an object`);
  }
  return value;
};

const requireArray = (value: unknown, path: string): unknown[] => {
  if (!Array.isArray(value)) {
    throw new TypeError(`${path} must be an array`);
  }
  return value;
};

const requireString = (value: unknown, path: string): string => {
  if (typeof value !== "string" || value.length === 0) {
    throw new TypeError(`${path} must be a non-empty string`);
  }
  return value;
};

const requireBoolean = (value: unknown, path: string): boolean => {
  if (typeof value !== "boolean") {
    throw new TypeError(`${path} must be a boolean`);
  }
  return value;
};

const requireNumber = (value: unknown, path: string): number => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new TypeError(`${path} must be a finite number`);
  }
  return value;
};

const requireNumberInRange = (
  value: unknown,
  minimum: number,
  maximumExclusive: number,
  path: string,
): number => {
  const number = requireNumber(value, path);
  if (number < minimum || number >= maximumExclusive) {
    throw new RangeError(
      `${path} must be between ${minimum} (inclusive) and ${maximumExclusive} (exclusive)`,
    );
  }
  return number;
};

const requireHouseNumber = (value: unknown, path: string): number => {
  const house = requireNumber(value, path);
  if (!Number.isInteger(house) || house < 1 || house > 12) {
    throw new RangeError(`${path} must be an integer from 1 to 12`);
  }
  return house;
};

const SIGN_IDS = new Set<string>(ZODIAC_SIGN_IDS);
const PLANET_ID_SET = new Set<string>(PLANET_IDS);

const requireSignId = (value: unknown, path: string): ZodiacSignId => {
  const signId = requireString(value, path);
  if (!SIGN_IDS.has(signId)) {
    throw new RangeError(`${path} contains an unsupported sign_id: ${signId}`);
  }
  return signId as ZodiacSignId;
};

const validatePlanet = (value: unknown, index: number): FreeAstroPlanet => {
  const path = `planets[${index}]`;
  const planet = requireRecord(value, path);
  const validatedPlanet: FreeAstroPlanet = {
    id: requireString(planet.id, `${path}.id`),
    name: requireString(planet.name, `${path}.name`),
    sign_id: requireSignId(planet.sign_id, `${path}.sign_id`),
    pos: requireNumberInRange(planet.pos, 0, 30, `${path}.pos`),
    abs_pos: requireNumberInRange(planet.abs_pos, 0, 360, `${path}.abs_pos`),
    retrograde: requireBoolean(planet.retrograde, `${path}.retrograde`),
  };

  if (Object.hasOwn(planet, "house")) {
    validatedPlanet.house = requireHouseNumber(planet.house, `${path}.house`);
  }

  return validatedPlanet;
};

const validateHouse = (value: unknown, index: number): FreeAstroHouse => {
  const path = `houses[${index}]`;
  const house = requireRecord(value, path);
  return {
    house: requireHouseNumber(house.house, `${path}.house`),
    abs_pos: requireNumberInRange(
      house.abs_pos,
      0,
      360,
      `${path}.abs_pos`,
    ),
  };
};

const validateAngle = (value: unknown, path: string): FreeAstroAngleDetail => {
  const angle = requireRecord(value, path);
  return {
    sign_id: requireSignId(angle.sign_id, `${path}.sign_id`),
    pos: requireNumberInRange(angle.pos, 0, 30, `${path}.pos`),
    abs_pos: requireNumberInRange(angle.abs_pos, 0, 360, `${path}.abs_pos`),
  };
};

const assertMajorPlanets = (planets: FreeAstroPlanet[]): void => {
  const counts = new Map<PlanetId, number>(
    PLANET_IDS.map((id) => [id, 0]),
  );

  for (const planet of planets) {
    if (PLANET_ID_SET.has(planet.id)) {
      const id = planet.id as PlanetId;
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }

  for (const [id, count] of counts) {
    if (count !== 1) {
      throw new TypeError(
        `planets must contain exactly one ${id}; received ${count}`,
      );
    }
  }
};

const assertKnownTimePlanetHouses = (
  planets: FreeAstroPlanet[],
  timeKnown: boolean,
): void => {
  if (!timeKnown) return;

  for (const planet of planets) {
    if (PLANET_ID_SET.has(planet.id) && planet.house === undefined) {
      throw new TypeError(
        `planets.${planet.id}.house must be present when time_known is true`,
      );
    }
  }
};

const assertTwelveUniqueHouses = (houses: FreeAstroHouse[]): void => {
  if (houses.length !== 12) {
    throw new TypeError(`houses must contain 12 entries; received ${houses.length}`);
  }
  const houseNumbers = new Set(houses.map((house) => house.house));
  if (houseNumbers.size !== 12) {
    throw new TypeError("houses must contain each house number exactly once");
  }
};

export const validateFreeAstroNatalResponse = (
  value: unknown,
): FreeAstroNatalResponse => {
  const response = requireRecord(value, "response");
  const subject = requireRecord(response.subject, "subject");
  const location = requireRecord(subject.location, "subject.location");
  const settings = requireRecord(subject.settings, "subject.settings");
  const timeKnown = requireBoolean(
    settings.time_known,
    "subject.settings.time_known",
  );
  const planets = requireArray(response.planets, "planets").map(validatePlanet);
  const houses =
    response.houses === undefined
      ? undefined
      : requireArray(response.houses, "houses").map(validateHouse);
  const angles =
    response.angles_details === undefined
      ? undefined
      : requireRecord(response.angles_details, "angles_details");

  assertMajorPlanets(planets);
  assertKnownTimePlanetHouses(planets, timeKnown);

  if (timeKnown && houses === undefined) {
    throw new TypeError("houses must be present when time_known is true");
  }
  if (timeKnown && angles === undefined) {
    throw new TypeError(
      "angles_details must be present when time_known is true",
    );
  }
  if (houses !== undefined) {
    assertTwelveUniqueHouses(houses);
  }

  const validatedAngles =
    angles === undefined
      ? undefined
      : {
          asc: validateAngle(angles.asc, "angles_details.asc"),
          mc: validateAngle(angles.mc, "angles_details.mc"),
          dc: validateAngle(angles.dc, "angles_details.dc"),
          ic: validateAngle(angles.ic, "angles_details.ic"),
        };

  const validatedResponse: FreeAstroNatalResponse = {
    subject: {
      datetime: requireString(subject.datetime, "subject.datetime"),
      location: {
        city: requireString(location.city, "subject.location.city"),
        lat: requireNumberInRange(
          location.lat,
          -90,
          90.0000000001,
          "subject.location.lat",
        ),
        lng: requireNumberInRange(
          location.lng,
          -180,
          180.0000000001,
          "subject.location.lng",
        ),
        timezone: requireString(
          location.timezone,
          "subject.location.timezone",
        ),
      },
      settings: {
        house_system: requireString(
          settings.house_system,
          "subject.settings.house_system",
        ),
        zodiac_type: requireString(
          settings.zodiac_type,
          "subject.settings.zodiac_type",
        ),
        time_known: timeKnown,
      },
    },
    planets,
  };

  if (houses !== undefined) {
    validatedResponse.houses = houses;
  }
  if (validatedAngles !== undefined) {
    validatedResponse.angles_details = validatedAngles;
  }

  return validatedResponse;
};
