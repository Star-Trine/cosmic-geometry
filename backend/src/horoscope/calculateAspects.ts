import type {
  AspectData,
  AspectType,
  PlanetData,
} from "./types.js";

const MAX_ORB = 5;

const ASPECTS: ReadonlyArray<{
  type: AspectType;
  angle: number;
}> = [
  { type: "conjunction", angle: 0 },
  { type: "sextile", angle: 60 },
  { type: "square", angle: 90 },
  { type: "trine", angle: 120 },
  { type: "opposition", angle: 180 },
];

const shortestAngle = (longitudeA: number, longitudeB: number): number => {
  const difference = Math.abs(longitudeA - longitudeB);
  return Math.min(difference, 360 - difference);
};

export const calculateAspects = (planets: PlanetData[]): AspectData[] => {
  const aspects: AspectData[] = [];

  for (let firstIndex = 0; firstIndex < planets.length; firstIndex += 1) {
    const bodyA = planets[firstIndex];
    if (!bodyA) continue;

    for (
      let secondIndex = firstIndex + 1;
      secondIndex < planets.length;
      secondIndex += 1
    ) {
      const bodyB = planets[secondIndex];
      if (!bodyB) continue;

      const angle = shortestAngle(bodyA.longitude, bodyB.longitude);
      const match = ASPECTS.find(
        (aspect) => Math.abs(angle - aspect.angle) <= MAX_ORB,
      );

      if (match) {
        aspects.push({
          bodyA: bodyA.id,
          bodyB: bodyB.id,
          type: match.type,
          angle,
          orb: Math.abs(angle - match.angle),
        });
      }
    }
  }

  return aspects;
};
