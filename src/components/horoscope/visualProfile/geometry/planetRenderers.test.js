import { PLANET_RENDERERS } from './planetRenderers';

test('registers one renderer for every supported planet', () => {
  expect(Object.keys(PLANET_RENDERERS)).toEqual([
    'sun', 'moon', 'mercury', 'venus', 'mars',
    'jupiter', 'saturn', 'uranus', 'neptune', 'pluto',
  ]);
  Object.values(PLANET_RENDERERS).forEach((renderer) => {
    expect(typeof renderer).toBe('function');
  });
});
