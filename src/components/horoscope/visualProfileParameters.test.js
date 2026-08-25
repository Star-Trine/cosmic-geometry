import { SIGN_CLASSIFICATIONS } from '../../data/horoscope/signClassifications';
import { PLANET_VISUAL_METADATA } from './visualProfileConfig';
import {
  createPlanetVisualParameter,
  createPlanetVisualParameters,
} from './visualProfileParameters';

test('defines classifications for all twelve zodiac signs', () => {
  expect(Object.keys(SIGN_CLASSIFICATIONS)).toEqual([
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
  ]);
  expect(SIGN_CLASSIFICATIONS.virgo).toEqual({
    polarity: 'feminine', modality: 'mutable', element: 'earth',
  });
});

test('derives a visual parameter without changing the source planet', () => {
  const source = { planetId: 'moon', sign: 'cancer', house: null, retrograde: true };
  expect(createPlanetVisualParameter(source)).toEqual({
    ...source,
    polarity: 'feminine', modality: 'cardinal', element: 'water',
  });
  expect(source).toEqual({ planetId: 'moon', sign: 'cancer', house: null, retrograde: true });
});

test('converts a VisualProfileData planets array', () => {
  const parameters = createPlanetVisualParameters([
    { planetId: 'sun', sign: 'sagittarius', house: 9, retrograde: false },
    { planetId: 'mars', sign: 'pisces', house: null, retrograde: true },
  ]);
  expect(parameters[0]).toMatchObject({ polarity: 'masculine', modality: 'mutable', element: 'fire' });
  expect(parameters[1]).toMatchObject({ polarity: 'feminine', modality: 'mutable', element: 'water', house: null });
});

test('provides ten available actor metadata entries', () => {
  expect(PLANET_VISUAL_METADATA).toHaveLength(10);
  expect(PLANET_VISUAL_METADATA.filter(({ available }) => available).map(({ id }) => id))
    .toEqual(['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto']);
  expect(PLANET_VISUAL_METADATA.filter(({ available }) => !available)).toHaveLength(0);
});
