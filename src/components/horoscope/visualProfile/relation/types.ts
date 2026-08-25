import type {
  AspectType,
  PlanetId,
} from '../../../../data/horoscope/types';

export type PlanetRelation = {
  sourcePlanetId: PlanetId;
  targetPlanetId: PlanetId;
  type: AspectType;
  angle: number;
  orb: number;
};
