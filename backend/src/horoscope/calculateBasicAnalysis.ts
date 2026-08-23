import type { HoroscopeAnalysis } from "./analysisTypes.js";
import { calculateHouseDistribution } from "./calculateHouseDistribution.js";
import { calculatePlanetDistribution } from "./calculatePlanetDistribution.js";
import { SIGN_CLASSIFICATIONS } from "./signClassifications.js";
import { PLANET_IDS, type PlanetData } from "./types.js";

const EXPECTED_PLANET_COUNT = PLANET_IDS.length;
const PLANET_ID_SET = new Set<string>(PLANET_IDS);

const assertMajorPlanets = (planets: PlanetData[]): void => {
  if (planets.length !== EXPECTED_PLANET_COUNT) {
    throw new TypeError(
      `Analysis requires ${EXPECTED_PLANET_COUNT} planets; received ${planets.length}`,
    );
  }

  const ids = new Set<string>();
  for (const planet of planets) {
    if (!PLANET_ID_SET.has(planet.id)) {
      throw new TypeError(`Analysis received an unsupported planet: ${planet.id}`);
    }
    if (ids.has(planet.id)) {
      throw new TypeError(`Analysis received a duplicate planet: ${planet.id}`);
    }
    ids.add(planet.id);
  }

  for (const id of PLANET_IDS) {
    if (!ids.has(id)) {
      throw new TypeError(`Analysis is missing required planet: ${id}`);
    }
  }
};

export const calculateBasicAnalysis = (
  planets: PlanetData[],
): HoroscopeAnalysis => {
  assertMajorPlanets(planets);

  const analysis: HoroscopeAnalysis = {
    polarity: { masculine: 0, feminine: 0 },
    modalities: { cardinal: 0, fixed: 0, mutable: 0 },
    elements: { fire: 0, earth: 0, air: 0, water: 0 },
    planetDistribution: calculatePlanetDistribution(planets),
    houseDistribution: calculateHouseDistribution(planets),
  };

  for (const planet of planets) {
    const classification = SIGN_CLASSIFICATIONS[planet.sign];
    if (!classification) {
      throw new TypeError(`Analysis received an unsupported sign: ${planet.sign}`);
    }

    analysis.polarity[classification.polarity] += 1;
    analysis.modalities[classification.modality] += 1;
    analysis.elements[classification.element] += 1;
  }

  const polarityTotal =
    analysis.polarity.masculine + analysis.polarity.feminine;
  const modalityTotal =
    analysis.modalities.cardinal +
    analysis.modalities.fixed +
    analysis.modalities.mutable;
  const elementTotal =
    analysis.elements.fire +
    analysis.elements.earth +
    analysis.elements.air +
    analysis.elements.water;

  if (
    polarityTotal !== EXPECTED_PLANET_COUNT ||
    modalityTotal !== EXPECTED_PLANET_COUNT ||
    elementTotal !== EXPECTED_PLANET_COUNT
  ) {
    throw new Error("Analysis totals do not match the ten major planets");
  }

  return analysis;
};
