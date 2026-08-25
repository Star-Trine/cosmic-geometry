import type { Element, Modality, Polarity } from '../../data/horoscope/signClassifications';
import type { PlanetVisualParameter } from './visualProfileParameters';

export type ElementColorConfig = {
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
  core: string;
  opacity: number;
  saturation: number;
  brightness: number;
};

export type SignVisualTransformation = {
  polarity: {
    direction: 'outward' | 'inward';
    spread: number;
    convergence: number;
    openness: number;
  };
  modality: {
    symmetry: number;
    repetition: number;
    branching: number;
    variation: number;
    stability: number;
  };
  element: {
    texture: 'radiant' | 'crystalline' | 'network' | 'fluid';
    density: number;
    curvature: number;
    glow: number;
    lineWeight: number;
    connectivity: number;
    sharpness: number;
    colors: ElementColorConfig;
  };
};

const POLARITY_TRANSFORMS: Record<Polarity, SignVisualTransformation['polarity']> = {
  masculine: { direction: 'outward', spread: 1.16, convergence: 0.16, openness: 0.9 },
  feminine: { direction: 'inward', spread: 0.82, convergence: 0.82, openness: 0.38 },
};

const MODALITY_TRANSFORMS: Record<Modality, SignVisualTransformation['modality']> = {
  cardinal: { symmetry: 0.58, repetition: 0.55, branching: 0.28, variation: 0.38, stability: 0.42 },
  fixed: { symmetry: 1, repetition: 0.92, branching: 0.12, variation: 0.08, stability: 1 },
  mutable: { symmetry: 0.4, repetition: 0.68, branching: 1, variation: 1, stability: 0.3 },
};

export const ELEMENT_COLOR_CONFIGS: Record<Element, ElementColorConfig> = {
  fire: { primary: '#ffd47a', secondary: '#ff8d72', accent: '#ef75ae', glow: '#ffc45e', core: '#fff7d6', opacity: 0.9, saturation: 0.88, brightness: 1 },
  earth: { primary: '#80c7b1', secondary: '#b8c9bd', accent: '#d8c589', glow: '#58aa9f', core: '#edf5df', opacity: 0.78, saturation: 0.55, brightness: 0.78 },
  air: { primary: '#a6e8f5', secondary: '#d7f7ff', accent: '#c5b8ef', glow: '#8edbef', core: '#f7fdff', opacity: 0.72, saturation: 0.48, brightness: 0.94 },
  water: { primary: '#4ebcc8', secondary: '#647fd5', accent: '#9b72d7', glow: '#397fbd', core: '#d9f4ff', opacity: 0.76, saturation: 0.72, brightness: 0.68 },
};

const ELEMENT_TRANSFORMS: Record<Element, Omit<SignVisualTransformation['element'], 'colors'>> = {
  fire: { texture: 'radiant', density: 0.55, curvature: 0.12, glow: 1, lineWeight: 0.85, connectivity: 0.28, sharpness: 1 },
  earth: { texture: 'crystalline', density: 1, curvature: 0.08, glow: 0.52, lineWeight: 0.78, connectivity: 0.72, sharpness: 0.7 },
  air: { texture: 'network', density: 0.42, curvature: 0.25, glow: 0.62, lineWeight: 0.42, connectivity: 1, sharpness: 0.34 },
  water: { texture: 'fluid', density: 0.65, curvature: 1, glow: 0.7, lineWeight: 0.62, connectivity: 0.78, sharpness: 0.08 },
};

export const createSignVisualTransformation = (
  parameter: PlanetVisualParameter,
): SignVisualTransformation => ({
  polarity: { ...POLARITY_TRANSFORMS[parameter.polarity] },
  modality: { ...MODALITY_TRANSFORMS[parameter.modality] },
  element: {
    ...ELEMENT_TRANSFORMS[parameter.element],
    colors: { ...ELEMENT_COLOR_CONFIGS[parameter.element] },
  },
});
