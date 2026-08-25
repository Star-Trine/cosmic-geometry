import { render } from '@testing-library/react';
import HouseEnvironmentLayer from './HouseEnvironmentLayer';
import {
  getHouseEnvironmentConfig,
  HOUSE_ENVIRONMENT_CONFIGS,
  NEUTRAL_HOUSE_ENVIRONMENT,
} from '../../visualProfileConfig';

const renderEnvironment = (environment, instanceId = 'test') => render(
  <svg>
    <HouseEnvironmentLayer environment={environment} instanceId={instanceId} />
  </svg>,
);

test.each([
  [1, 'First house environment', '.visual-profile-environment__front-field'],
  [2, 'Second house environment', '.visual-profile-environment__held-field'],
  [5, 'Fifth house environment', '.visual-profile-environment__expressive-field'],
  [12, 'Twelfth house environment', '.visual-profile-environment__depth'],
])('renders the configured environment for house %i', (house, label, selector) => {
  const { container } = renderEnvironment(HOUSE_ENVIRONMENT_CONFIGS[house]);
  expect(container.querySelector(`[aria-label="${label}"]`)).toBeInTheDocument();
  expect(container.querySelector(selector)).toBeInTheDocument();
});

test('renders the neutral environment', () => {
  const { container } = renderEnvironment(NEUTRAL_HOUSE_ENVIRONMENT);
  expect(container.querySelector('[aria-label="Neutral environment"]')).toBeInTheDocument();
  expect(container.querySelector('.visual-profile-environment__neutral-field')).toBeInTheDocument();
});

test('falls back to neutral when house is null', () => {
  const house = null;
  expect(getHouseEnvironmentConfig(house)).toBe(NEUTRAL_HOUSE_ENVIRONMENT);
});

test('defines normalized common parameters for all twelve houses', () => {
  expect(Object.keys(HOUSE_ENVIRONMENT_CONFIGS)).toHaveLength(12);
  Object.values(HOUSE_ENVIRONMENT_CONFIGS).forEach((environment) => {
    ['depth', 'openness', 'visibility', 'boundary', 'density', 'symmetry', 'connectivity', 'brightness']
      .forEach((key) => expect(environment[key]).toBeGreaterThanOrEqual(0));
    ['depth', 'openness', 'visibility', 'boundary', 'density', 'symmetry', 'connectivity', 'brightness']
      .forEach((key) => expect(environment[key]).toBeLessThanOrEqual(1));
    expect(['center', 'upper', 'lower', 'inner', 'outer']).toContain(environment.position);
  });
});

test.each(Array.from({ length: 12 }, (_, index) => index + 1))(
  'renders a non-neutral environment for house %i',
  (house) => {
    const environment = getHouseEnvironmentConfig(house);
    const { container } = renderEnvironment(environment, `house-${house}`);
    expect(environment.variant).not.toBe('neutral');
    expect(container.querySelector(`[data-house-environment="${environment.variant}"]`)).toBeInTheDocument();
    expect(container.querySelector(`[aria-label="${environment.label}"]`)).toBeInTheDocument();
  },
);

test.each([
  [3, 11], [4, 8], [4, 12], [8, 12], [1, 10], [5, 9], [2, 6],
])('differentiates house %i from house %i', (houseA, houseB) => {
  const environmentA = getHouseEnvironmentConfig(houseA);
  const environmentB = getHouseEnvironmentConfig(houseB);
  expect(environmentA.variant).not.toBe(environmentB.variant);
  expect(environmentA).not.toEqual(environmentB);
});

test('creates unique defs ids when the same instance id is mounted twice', () => {
  const { container } = render(
    <svg>
      <HouseEnvironmentLayer environment={HOUSE_ENVIRONMENT_CONFIGS[12]} instanceId="duplicate" />
      <HouseEnvironmentLayer environment={HOUSE_ENVIRONMENT_CONFIGS[12]} instanceId="duplicate" />
    </svg>,
  );
  const ids = Array.from(container.querySelectorAll('[id]'), (node) => node.id);
  expect(new Set(ids).size).toBe(ids.length);
});
