import { render } from '@testing-library/react';
import NatalChart from './NatalChart';

const planetIds = [
  'sun',
  'moon',
  'mercury',
  'venus',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
  'pluto',
];

const planetsAt = (longitudes) => planetIds.map((id, index) => ({
  id,
  name: id,
  longitude: longitudes[index],
  sign: 'aries',
  degreeInSign: longitudes[index] % 30,
  house: null,
  retrograde: id === 'saturn',
}));

const housesAt = (longitudes) => longitudes.map((cuspLongitude, index) => ({
  house: index + 1,
  cuspLongitude,
}));

test('renders ten planets in Partial with Aries 0 degrees at the left', () => {
  const planets = planetsAt([0, 30, 60, 90, 120, 150, 180, 210, 240, 270]);
  const { container } = render(
    <NatalChart ascLongitude={null} angles={null} aspects={[]} houses={null} planets={planets} />,
  );

  const symbols = container.querySelectorAll('#planet-layer text');
  const sun = container.querySelector('[data-planet="sun"]');

  expect(symbols).toHaveLength(10);
  expect(Number(sun.getAttribute('x'))).toBeLessThan(250);
  expect(Number(sun.getAttribute('y'))).toBeCloseTo(250);
});

test('uses ASC as the left-side reference in Full', () => {
  const planets = planetsAt([90, 30, 60, 120, 150, 180, 210, 240, 270, 300]);
  const { container } = render(
    <NatalChart ascLongitude={90} angles={null} aspects={[]} houses={null} planets={planets} />,
  );
  const sun = container.querySelector('[data-planet="sun"]');

  expect(Number(sun.getAttribute('x'))).toBeLessThan(250);
  expect(Number(sun.getAttribute('y'))).toBeCloseTo(250);
});

test('keeps close longitudes and separates their radial lanes', () => {
  const planets = planetsAt([358, 2, 60, 90, 120, 150, 180, 210, 240, 270]);
  const { container } = render(
    <NatalChart ascLongitude={null} angles={null} aspects={[]} houses={null} planets={planets} />,
  );
  const sun = container.querySelector('[data-planet="sun"]');
  const moon = container.querySelector('[data-planet="moon"]');

  expect(sun.getAttribute('data-longitude')).toBe('358');
  expect(moon.getAttribute('data-longitude')).toBe('2');
  expect(sun.getAttribute('data-radius')).not.toBe(
    moon.getAttribute('data-radius'),
  );
  expect(sun.getAttribute('data-cluster')).toBe(
    moon.getAttribute('data-cluster'),
  );
});

test('renders twelve Full house cusps and upright midpoint labels', () => {
  const houses = housesAt([
    90, 116, 145, 178, 214, 250, 270, 296, 325, 358, 34, 70,
  ]);
  const { container } = render(
    <NatalChart ascLongitude={90} angles={null} aspects={[]} houses={houses} planets={[]} />,
  );

  const layer = container.querySelector('#house-layer');
  const cusps = container.querySelectorAll('.house-layer__cusps line');
  const labels = container.querySelectorAll('.house-layer__numbers text');
  const firstCusp = container.querySelector(
    '.house-layer__cusps [data-house="1"]',
  );

  expect(layer).not.toBeNull();
  expect(cusps).toHaveLength(12);
  expect(labels).toHaveLength(12);
  expect(Number(firstCusp.getAttribute('x2'))).toBeLessThan(250);
  expect(Number(firstCusp.getAttribute('y2'))).toBeCloseTo(250);
  labels.forEach((label) => expect(label.hasAttribute('transform')).toBe(false));
});

test('omits the entire House Layer in Partial', () => {
  const { container } = render(
    <NatalChart ascLongitude={null} angles={null} aspects={[]} houses={null} planets={[]} />,
  );

  expect(container.querySelector('#house-layer')).toBeNull();
});

test('renders four Full angle lines at their actual longitudes with upright labels', () => {
  const angles = [
    { name: 'ASC', longitude: 90, sign: 'cancer', degreeInSign: 0 },
    { name: 'MC', longitude: 184, sign: 'libra', degreeInSign: 4 },
    { name: 'DSC', longitude: 270, sign: 'capricorn', degreeInSign: 0 },
    { name: 'IC', longitude: 4, sign: 'aries', degreeInSign: 4 },
  ];
  const { container } = render(
    <NatalChart ascLongitude={90} angles={angles} aspects={[]} houses={null} planets={[]} />,
  );

  const lines = container.querySelectorAll('.angle-layer__lines line');
  const labels = container.querySelectorAll('.angle-layer__labels text');
  const ascLine = container.querySelector(
    '.angle-layer__lines [data-angle="ASC"]',
  );
  const mcLine = container.querySelector(
    '.angle-layer__lines [data-angle="MC"]',
  );
  const ascLabel = container.querySelector(
    '.angle-layer__labels [data-angle="ASC"]',
  );

  expect(container.querySelector('#angle-layer')).not.toBeNull();
  expect(lines).toHaveLength(4);
  expect(labels).toHaveLength(4);
  expect(Number(ascLine.getAttribute('x2'))).toBeLessThan(250);
  expect(Number(ascLine.getAttribute('y2'))).toBeCloseTo(250);
  expect(mcLine.getAttribute('data-longitude')).toBe('184');
  expect(Number(ascLabel.getAttribute('x'))).toBeLessThan(40);
  expect(Number(ascLabel.getAttribute('y'))).toBeCloseTo(250);
  labels.forEach((label) => expect(label.hasAttribute('transform')).toBe(false));
});

test('omits the entire Angle Layer in Partial', () => {
  const { container } = render(
    <NatalChart ascLongitude={null} angles={null} aspects={[]} houses={null} planets={[]} />,
  );

  expect(container.querySelector('#angle-layer')).toBeNull();
});

test('renders major aspects in the center and conjunctions as local lines', () => {
  const planets = planetsAt([0, 4, 60, 90, 120, 150, 180, 210, 240, 270]);
  const aspects = [
    { bodyA: 'sun', bodyB: 'moon', type: 'conjunction', angle: 4, orb: 4 },
    { bodyA: 'sun', bodyB: 'mercury', type: 'sextile', angle: 60, orb: 0 },
  ];
  const { container } = render(
    <NatalChart
      ascLongitude={null}
      angles={null}
      aspects={aspects}
      houses={null}
      planets={planets}
    />,
  );

  const major = container.querySelector('.aspect-layer__major line');
  const conjunction = container.querySelector(
    '.aspect-layer__conjunctions line',
  );
  const lineLength = (line) => Math.hypot(
    Number(line.getAttribute('x2')) - Number(line.getAttribute('x1')),
    Number(line.getAttribute('y2')) - Number(line.getAttribute('y1')),
  );

  expect(container.querySelector('#aspect-layer')).not.toBeNull();
  expect(major.getAttribute('data-aspect')).toBe('sextile');
  expect(conjunction.getAttribute('data-aspect')).toBe('conjunction');
  expect(lineLength(conjunction)).toBeLessThan(lineLength(major));
});

test('renders aspects in Partial without requiring houses or angles', () => {
  const planets = planetsAt([0, 60, 120, 90, 150, 180, 210, 240, 270, 300]);
  const aspects = [
    { bodyA: 'sun', bodyB: 'moon', type: 'sextile', angle: 60, orb: 0 },
  ];
  const { container } = render(
    <NatalChart
      ascLongitude={null}
      angles={null}
      aspects={aspects}
      houses={null}
      planets={planets}
    />,
  );

  expect(container.querySelectorAll('#aspect-layer line')).toHaveLength(1);
  expect(container.querySelector('#house-layer')).toBeNull();
  expect(container.querySelector('#angle-layer')).toBeNull();
});
