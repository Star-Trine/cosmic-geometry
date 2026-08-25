import type {
  AspectData,
  PlanetId,
} from '../../../../data/horoscope/types';
import type { PlanetRelation } from './types';

export const getPlanetRelations = (
  aspects: AspectData[],
  selectedPlanetId: PlanetId,
): PlanetRelation[] =>
  aspects.flatMap((aspect) => {
    if (aspect.bodyA === selectedPlanetId) {
      return [{
        sourcePlanetId: selectedPlanetId,
        targetPlanetId: aspect.bodyB,
        type: aspect.type,
        angle: aspect.angle,
        orb: aspect.orb,
      }];
    }

    if (aspect.bodyB === selectedPlanetId) {
      return [{
        sourcePlanetId: selectedPlanetId,
        targetPlanetId: aspect.bodyA,
        type: aspect.type,
        angle: aspect.angle,
        orb: aspect.orb,
      }];
    }

    return [];
  });
