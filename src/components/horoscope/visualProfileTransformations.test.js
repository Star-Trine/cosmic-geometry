import { createPlanetVisualParameter } from './visualProfileParameters';
import { ELEMENT_COLOR_CONFIGS, createSignVisualTransformation } from './visualProfileTransformations';

const transform = (planetId, sign, house = 1) => createSignVisualTransformation(
  createPlanetVisualParameter({ planetId, sign, house, retrograde: false }),
);

test('changes transformation parameters across polarity and modality', () => {
  const leo = transform('sun', 'leo', 5);
  const virgo = transform('sun', 'virgo', 3);
  expect(leo.polarity.direction).toBe('outward');
  expect(virgo.polarity.direction).toBe('inward');
  expect(leo.modality.stability).toBeGreaterThan(virgo.modality.stability);
  expect(virgo.modality.branching).toBeGreaterThan(leo.modality.branching);
  expect(leo).not.toEqual(virgo);
});

test('creates different transformations for Mercury and Mars signs', () => {
  expect(transform('mercury', 'libra')).not.toEqual(transform('mercury', 'scorpio'));
  expect(transform('mars', 'scorpio')).not.toEqual(transform('mars', 'gemini'));
});

test.each(['fire', 'earth', 'air', 'water'])('%s provides multi-role colors', (element) => {
  const colors = ELEMENT_COLOR_CONFIGS[element];
  expect(new Set([colors.primary, colors.secondary, colors.accent, colors.glow, colors.core]).size).toBe(5);
});
