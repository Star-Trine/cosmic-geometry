import { getPlanetRelations } from './getPlanetRelations';

describe('getPlanetRelations', () => {
  test('normalizes the selected planet from bodyA to sourcePlanetId', () => {
    const relations = getPlanetRelations([
      {
        bodyA: 'sun',
        bodyB: 'mars',
        type: 'sextile',
        angle: 60.8,
        orb: 0.8,
      },
    ], 'sun');

    expect(relations).toEqual([
      {
        sourcePlanetId: 'sun',
        targetPlanetId: 'mars',
        type: 'sextile',
        angle: 60.8,
        orb: 0.8,
      },
    ]);
  });

  test('normalizes the selected planet from bodyB to sourcePlanetId', () => {
    const relations = getPlanetRelations([
      {
        bodyA: 'mars',
        bodyB: 'sun',
        type: 'sextile',
        angle: 60.8,
        orb: 0.8,
      },
    ], 'sun');

    expect(relations).toEqual([
      {
        sourcePlanetId: 'sun',
        targetPlanetId: 'mars',
        type: 'sextile',
        angle: 60.8,
        orb: 0.8,
      },
    ]);
  });

  test('returns every related aspect in input order and excludes unrelated aspects', () => {
    const aspects = [
      { bodyA: 'sun', bodyB: 'mars', type: 'sextile', angle: 60.8, orb: 0.8 },
      { bodyA: 'moon', bodyB: 'venus', type: 'trine', angle: 119.2, orb: 0.8 },
      { bodyA: 'sun', bodyB: 'saturn', type: 'square', angle: 91.25, orb: 1.25 },
      { bodyA: 'jupiter', bodyB: 'sun', type: 'trine', angle: 117.75, orb: 2.25 },
    ];

    expect(getPlanetRelations(aspects, 'sun')).toEqual([
      {
        sourcePlanetId: 'sun',
        targetPlanetId: 'mars',
        type: 'sextile',
        angle: 60.8,
        orb: 0.8,
      },
      {
        sourcePlanetId: 'sun',
        targetPlanetId: 'saturn',
        type: 'square',
        angle: 91.25,
        orb: 1.25,
      },
      {
        sourcePlanetId: 'sun',
        targetPlanetId: 'jupiter',
        type: 'trine',
        angle: 117.75,
        orb: 2.25,
      },
    ]);
  });

  test('preserves all supported aspect types and exact angle/orb values', () => {
    const aspects = [
      { bodyA: 'sun', bodyB: 'moon', type: 'conjunction', angle: 4.123456, orb: 4.123456 },
      { bodyA: 'mercury', bodyB: 'sun', type: 'sextile', angle: 59.987654, orb: 0.012346 },
      { bodyA: 'sun', bodyB: 'venus', type: 'square', angle: 94.999999, orb: 4.999999 },
      { bodyA: 'mars', bodyB: 'sun', type: 'trine', angle: 120.000001, orb: 0.000001 },
      { bodyA: 'sun', bodyB: 'jupiter', type: 'opposition', angle: 176.54321, orb: 3.45679 },
    ];

    const relations = getPlanetRelations(aspects, 'sun');

    expect(relations.map(({ type }) => type)).toEqual([
      'conjunction',
      'sextile',
      'square',
      'trine',
      'opposition',
    ]);
    expect(relations.map(({ angle, orb }) => ({ angle, orb }))).toEqual(
      aspects.map(({ angle, orb }) => ({ angle, orb })),
    );
  });

  test('returns an empty array when the selected planet has no aspects', () => {
    expect(getPlanetRelations([
      {
        bodyA: 'moon',
        bodyB: 'mars',
        type: 'square',
        angle: 90,
        orb: 0,
      },
    ], 'sun')).toEqual([]);
  });

  test('does not mutate the input array or its aspect objects', () => {
    const aspects = [
      { bodyA: 'mars', bodyB: 'sun', type: 'sextile', angle: 60.8, orb: 0.8 },
      { bodyA: 'sun', bodyB: 'saturn', type: 'square', angle: 91.25, orb: 1.25 },
    ];
    const originalAspects = aspects.map((aspect) => ({ ...aspect }));

    getPlanetRelations(aspects, 'sun');

    expect(aspects).toEqual(originalAspects);
  });
});
