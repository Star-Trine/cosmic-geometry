import type { PlanetId } from '../../../../data/horoscope/types';
import JupiterGeometry from './planets/JupiterGeometry';
import MarsGeometry from './planets/MarsGeometry';
import MercuryGeometry from './planets/MercuryGeometry';
import MoonGeometry from './planets/MoonGeometry';
import NeptuneGeometry from './planets/NeptuneGeometry';
import PlutoGeometry from './planets/PlutoGeometry';
import SaturnGeometry from './planets/SaturnGeometry';
import SunGeometry from './planets/SunGeometry';
import UranusGeometry from './planets/UranusGeometry';
import VenusGeometry from './planets/VenusGeometry';
import type { PlanetGeometryRenderer } from './types';

export const PLANET_RENDERERS: Record<PlanetId, PlanetGeometryRenderer> = {
  sun: SunGeometry,
  moon: MoonGeometry,
  mercury: MercuryGeometry,
  venus: VenusGeometry,
  mars: MarsGeometry,
  jupiter: JupiterGeometry,
  saturn: SaturnGeometry,
  uranus: UranusGeometry,
  neptune: NeptuneGeometry,
  pluto: PlutoGeometry,
};
