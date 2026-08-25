import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import VisualProfile, { VisualProfileInfo } from './VisualProfile';
import { createPlanetVisualParameter } from './visualProfileParameters';

const prototypePlanets = [
  { planetId: 'sun', sign: 'leo', house: 5, retrograde: false },
  { planetId: 'moon', sign: 'cancer', house: 12, retrograde: false },
  { planetId: 'mercury', sign: 'libra', house: 1, retrograde: false },
  { planetId: 'venus', sign: 'taurus', house: 2, retrograde: false },
  { planetId: 'mars', sign: 'scorpio', house: 2, retrograde: false },
  { planetId: 'jupiter', sign: 'sagittarius', house: 5, retrograde: false },
  { planetId: 'saturn', sign: 'capricorn', house: 12, retrograde: false },
  { planetId: 'uranus', sign: 'aquarius', house: 1, retrograde: false },
  { planetId: 'neptune', sign: 'pisces', house: 2, retrograde: false },
  { planetId: 'pluto', sign: 'scorpio', house: 5, retrograde: false },
];

const prototypeAspects = [
  { bodyA: 'sun', bodyB: 'mars', type: 'sextile', angle: 60.8, orb: 0.8 },
  { bodyA: 'saturn', bodyB: 'sun', type: 'square', angle: 91.25, orb: 1.25 },
  { bodyA: 'moon', bodyB: 'venus', type: 'trine', angle: 119.2, orb: 0.8 },
];

function PrototypeHarness({ planets = prototypePlanets, aspects = prototypeAspects }) {
  const [selected, setSelected] = useState('sun');
  const [viewMode, setViewMode] = useState('individual');
  const [relationSelection, setRelationSelection] = useState(null);

  return (
    <>
      <VisualProfile
        planets={planets}
        aspects={aspects}
        selectedPrototype={selected}
        onSelectPrototype={setSelected}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        onRelationSelectionChange={setRelationSelection}
      />
      <VisualProfileInfo selectedPrototype={selected} viewMode={viewMode} planets={planets} relation={relationSelection?.relation ?? null} />
    </>
  );
}

test('switches the visualization and profile information between prototypes', () => {
  const { container } = render(<PrototypeHarness />);

  expect(screen.getAllByRole('button', { name: /Sun|Moon|Mercury|Venus|Mars|Jupiter|Saturn|Uranus|Neptune|Pluto/ }))
    .toHaveLength(10);
  ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']
    .forEach((name) => expect(screen.getByRole('button', { name })).toBeEnabled());

  expect(screen.getByRole('heading', { name: 'Sun in Leo / 5th House' })).toBeInTheDocument();
  expect(screen.getByText('Leo')).toBeInTheDocument();
  expect(screen.getByText('Masculine')).toBeInTheDocument();
  expect(screen.getByText('Fixed')).toBeInTheDocument();
  expect(screen.getByText('Fire')).toBeInTheDocument();
  expect(screen.getByText('5th House')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Sun core and outward radiation"]')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Fifth house environment"]')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Mercury' }));

  expect(screen.getByRole('heading', { name: 'Mercury in Libra / 1st House' })).toBeInTheDocument();
  expect(screen.getByText('Masculine')).toBeInTheDocument();
  expect(screen.getByText('Cardinal')).toBeInTheDocument();
  expect(screen.getByText('Air')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Mercury network and signal"]')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="First house environment"]')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Mars' }));

  expect(screen.getByRole('heading', { name: 'Mars in Scorpio / 2nd House' })).toBeInTheDocument();
  expect(screen.getByText('Scorpio')).toBeInTheDocument();
  expect(screen.getByText('Fixed')).toBeInTheDocument();
  expect(screen.getByText('Water')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Mars vector and impulse"]')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Scorpio transformation"]')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Second house environment"]')).toBeInTheDocument();
});

test('renders Saturn, Uranus, Neptune and Pluto as distinct actors', () => {
  const { container } = render(<PrototypeHarness />);
  const actors = [
    ['Saturn', 'Saturn in Capricorn / 12th House', 'Saturn boundary framework and constraint'],
    ['Uranus', 'Uranus in Aquarius / 1st House', 'Uranus disruption branching and jump'],
    ['Neptune', 'Neptune in Pisces / 2nd House', 'Neptune diffusion dissolution and field'],
    ['Pluto', 'Pluto in Scorpio / 5th House', 'Pluto compression transformation and reconstruction'],
  ];
  actors.forEach(([button, heading, label]) => {
    fireEvent.click(screen.getByRole('button', { name: button }));
    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
    expect(container.querySelector(`[aria-label="${label}"]`)).toBeInTheDocument();
  });
});

test('renders the four outer actors with alternate signs and partial houses', () => {
  const planets = [
    ...prototypePlanets.filter(({ planetId }) => !['saturn', 'uranus', 'neptune', 'pluto'].includes(planetId)),
    { planetId: 'saturn', sign: 'gemini', house: null, retrograde: false },
    { planetId: 'uranus', sign: 'taurus', house: null, retrograde: false },
    { planetId: 'neptune', sign: 'aries', house: null, retrograde: false },
    { planetId: 'pluto', sign: 'libra', house: null, retrograde: false },
  ];
  const { container } = render(<PrototypeHarness planets={planets} />);
  const expected = [
    ['Saturn', 'network'], ['Uranus', 'crystalline'], ['Neptune', 'radiant'], ['Pluto', 'network'],
  ];
  expected.forEach(([planet, texture]) => {
    fireEvent.click(screen.getByRole('button', { name: planet }));
    expect(container.querySelector(`svg[data-texture="${texture}"]`)).toBeInTheDocument();
    expect(container.querySelector('[aria-label="Neutral environment"]')).toBeInTheDocument();
  });
});

test('renders Moon, Venus and Jupiter actors from real visual parameters', () => {
  const { container } = render(<PrototypeHarness />);

  fireEvent.click(screen.getByRole('button', { name: 'Moon' }));
  expect(screen.getByRole('heading', { name: 'Moon in Cancer / 12th House' })).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Moon wave reflection and cycle"]')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Water fluid texture"]')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Venus' }));
  expect(screen.getByRole('heading', { name: 'Venus in Taurus / 2nd House' })).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Venus attraction symmetry and balance"]')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Earth crystalline texture"]')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Jupiter' }));
  expect(screen.getByRole('heading', { name: 'Jupiter in Sagittarius / 5th House' })).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Jupiter expansion growth and amplification"]')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Fire radiant texture"]')).toBeInTheDocument();
});

test('renders new actors with alternate signs and partial houses', () => {
  const planets = [
    { planetId: 'sun', sign: 'leo', house: 5, retrograde: false },
    { planetId: 'moon', sign: 'aries', house: null, retrograde: false },
    { planetId: 'mercury', sign: 'libra', house: 1, retrograde: false },
    { planetId: 'venus', sign: 'gemini', house: null, retrograde: false },
    { planetId: 'mars', sign: 'scorpio', house: 2, retrograde: false },
    { planetId: 'jupiter', sign: 'pisces', house: null, retrograde: false },
  ];
  const { container } = render(<PrototypeHarness planets={planets} />);

  fireEvent.click(screen.getByRole('button', { name: 'Moon' }));
  expect(container.querySelector('svg[data-direction="outward"][data-texture="radiant"]')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Neutral environment"]')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Venus' }));
  expect(container.querySelector('svg[data-texture="network"]')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Jupiter' }));
  expect(container.querySelector('svg[data-direction="inward"][data-texture="fluid"]')).toBeInTheDocument();
});

test('uses live planet sign and house data while preserving the planet geometry', () => {
  const livePlanets = [
    { planetId: 'sun', sign: 'virgo', house: 3, retrograde: false },
    { planetId: 'mercury', sign: 'capricorn', house: 3, retrograde: true },
    { planetId: 'mars', sign: 'aries', house: null, retrograde: false },
  ];
  const { container } = render(<PrototypeHarness planets={livePlanets} />);

  expect(screen.getByRole('heading', { name: 'Sun in Virgo / 3rd House' })).toBeInTheDocument();
  expect(screen.getByText('Virgo')).toBeInTheDocument();
  expect(screen.getByText('Feminine')).toBeInTheDocument();
  expect(screen.getByText('Mutable')).toBeInTheDocument();
  expect(screen.getByText('Earth')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Sun core and outward radiation"]')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Third house environment"]')).toBeInTheDocument();
  expect(container.querySelector('[data-environment-pattern="local-network"]')).toBeInTheDocument();
  expect(screen.queryByText('3rd House environment is not designed yet; a neutral field is shown.')).not.toBeInTheDocument();
  expect(container.querySelector('[aria-label="Earth crystalline texture"]')).toBeInTheDocument();
  expect(container.querySelector('svg[data-direction="inward"][data-texture="crystalline"]')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Mercury' }));
  expect(screen.getByRole('heading', { name: 'Mercury in Capricorn / 3rd House' })).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Earth crystalline texture"]')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Mars' }));
  expect(screen.getByRole('heading', { name: 'Mars in Aries / Unknown' })).toBeInTheDocument();
  expect(screen.getByText('Birth time is unknown; a neutral house environment is shown.')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Neutral environment"]')).toBeInTheDocument();
});

test('shows a safe fallback when the selected planet is absent', () => {
  render(<PrototypeHarness planets={prototypePlanets.filter(({ planetId }) => planetId !== 'sun')} />);
  expect(screen.getByText('Selected planet data is unavailable. Generate a horoscope to continue.')).toBeInTheDocument();
  expect(screen.getByText('Generate a horoscope to view this planet profile.')).toBeInTheDocument();
});

test('renders an unknown house safely from a visual parameter', () => {
  render(
    <VisualProfileInfo
      selectedPrototype="sun"
      viewMode="individual"
      parameter={createPlanetVisualParameter({
        planetId: 'sun', sign: 'leo', house: null, retrograde: false,
      })}
    />,
  );

  expect(screen.getByText('Unknown')).toBeInTheDocument();
});

test('uses actual aspect data for relation info and preserves the sextile animation', () => {
  const { container } = render(<PrototypeHarness />);

  fireEvent.click(screen.getByRole('button', { name: 'Relation' }));

  expect(screen.getByRole('heading', { name: 'Sun → Sextile → Mars' })).toBeInTheDocument();
  expect(screen.getByText('Relation 1 / 2')).toBeInTheDocument();
  expect(screen.getByRole('region', { name: 'Relation profile information' })).toHaveTextContent('Sextile');
  expect(screen.getByRole('region', { name: 'Relation profile information' })).toHaveTextContent('Leo / 5th House');
  expect(screen.getByRole('region', { name: 'Relation profile information' })).toHaveTextContent('60.80°');
  expect(screen.getByRole('region', { name: 'Relation profile information' })).toHaveTextContent('0.80°');
  expect(container.querySelector('[aria-label="Sextile relation operator"]')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Sun core and outward radiation"]')).toBeInTheDocument();
  expect(screen.getByText('Sun / Ready')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Play' }));
  expect(screen.getByText('Transition in progress')).toBeInTheDocument();

  fireEvent.animationEnd(container.querySelector('[aria-label="Sun to Mars sextile relation"]'));
  expect(screen.getByText('Mars / Arrival complete')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Replay' })).toBeInTheDocument();
});

test('renders and plays a conjunction as centered overlap and fusion with actual planets', () => {
  const conjunctionAspects = [
    { bodyA: 'moon', bodyB: 'sun', type: 'conjunction', angle: 2.345, orb: 2.345 },
  ];
  const { container } = render(<PrototypeHarness aspects={conjunctionAspects} />);
  fireEvent.click(screen.getByRole('button', { name: 'Relation' }));

  expect(screen.getByRole('heading', { name: 'Sun → Conjunction → Moon' })).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Conjunction fusion operator"]')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Sextile relation operator"]')).not.toBeInTheDocument();
  expect(container.querySelector('[aria-label="Sun core and outward radiation"]')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Moon wave reflection and cycle"]')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Fire radiant texture"]')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Water fluid texture"]')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Fifth house environment"]')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Twelfth house environment"]')).toBeInTheDocument();
  expect(screen.getByRole('list', { name: 'Conjunction transition phases' })).toHaveTextContent('CenterOverlapFusionSeparation');

  fireEvent.click(screen.getByRole('button', { name: 'Play' }));
  expect(screen.getByText('Transition in progress')).toBeInTheDocument();
  fireEvent.animationEnd(container.querySelector('[aria-label="Sun to Moon conjunction relation"]'));
  expect(screen.getByText('Moon / Arrival complete')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Replay' })).toBeInTheDocument();
});

test('uses neutral source and target environments for a partial conjunction', () => {
  const conjunctionAspects = [
    { bodyA: 'sun', bodyB: 'moon', type: 'conjunction', angle: 0.75, orb: 0.75 },
  ];
  const partialPlanets = prototypePlanets.map((planet) => ({ ...planet, house: null }));
  const { container } = render(<PrototypeHarness planets={partialPlanets} aspects={conjunctionAspects} />);
  fireEvent.click(screen.getByRole('button', { name: 'Relation' }));

  expect(container.querySelectorAll('[aria-label="Neutral environment"]')).toHaveLength(2);
  expect(container.querySelector('[aria-label="Conjunction fusion operator"]')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Play' })).toBeEnabled();
});

test('resets a playing conjunction when navigating to the square transition', () => {
  const aspects = [
    { bodyA: 'sun', bodyB: 'moon', type: 'conjunction', angle: 1.2, orb: 1.2 },
    { bodyA: 'sun', bodyB: 'saturn', type: 'square', angle: 91.25, orb: 1.25 },
  ];
  const { container } = render(<PrototypeHarness aspects={aspects} />);
  fireEvent.click(screen.getByRole('button', { name: 'Relation' }));
  fireEvent.click(screen.getByRole('button', { name: 'Play' }));
  expect(screen.getByText('Transition in progress')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Next' }));

  expect(container.querySelector('[aria-label="Conjunction fusion operator"]')).not.toBeInTheDocument();
  expect(container.querySelector('[aria-label="Square cross-force operator"]')).toBeInTheDocument();
  expect(screen.queryByText('Transition in progress')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Play' })).toBeEnabled();
});

test('renders and plays a trine as a 120 degree resonance flow with actual planets', () => {
  const trineAspects = [
    { bodyA: 'venus', bodyB: 'sun', type: 'trine', angle: 120.75, orb: 0.75 },
  ];
  const { container } = render(<PrototypeHarness aspects={trineAspects} />);
  fireEvent.click(screen.getByRole('button', { name: 'Relation' }));

  expect(screen.getByRole('heading', { name: 'Sun → Trine → Venus' })).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Trine resonance flow operator"]')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="120 degree resonance flow"]')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Sextile relation operator"]')).not.toBeInTheDocument();
  expect(container.querySelector('[aria-label="Conjunction fusion operator"]')).not.toBeInTheDocument();
  expect(container.querySelector('[aria-label="Sun core and outward radiation"]')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Venus attraction symmetry and balance"]')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Fire radiant texture"]')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Earth crystalline texture"]')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Fifth house environment"]')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Second house environment"]')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Play' }));
  expect(screen.getByText('Transition in progress')).toBeInTheDocument();
  fireEvent.animationEnd(container.querySelector('[aria-label="Sun to Venus trine relation"]'));
  expect(screen.getByText('Venus / Arrival complete')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Replay' })).toBeInTheDocument();
});

test('uses neutral environments for a partial trine', () => {
  const trineAspects = [
    { bodyA: 'sun', bodyB: 'venus', type: 'trine', angle: 119.4, orb: 0.6 },
  ];
  const partialPlanets = prototypePlanets.map((planet) => ({ ...planet, house: null }));
  const { container } = render(<PrototypeHarness planets={partialPlanets} aspects={trineAspects} />);
  fireEvent.click(screen.getByRole('button', { name: 'Relation' }));

  expect(container.querySelectorAll('[aria-label="Neutral environment"]')).toHaveLength(2);
  expect(container.querySelector('[aria-label="Trine resonance flow operator"]')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Play' })).toBeEnabled();
});

test('renders square and opposition as distinct animated operators with actual planets', () => {
  const aspects = [
    { bodyA: 'sun', bodyB: 'saturn', type: 'square', angle: 91.25, orb: 1.25 },
    { bodyA: 'sun', bodyB: 'pluto', type: 'opposition', angle: 178.5, orb: 1.5 },
  ];
  const { container } = render(<PrototypeHarness aspects={aspects} />);
  fireEvent.click(screen.getByRole('button', { name: 'Relation' }));

  expect(screen.getByRole('heading', { name: 'Sun → Square → Saturn' })).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Square cross-force operator"]')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="90 degree cross force"]')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Sun core and outward radiation"]')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Saturn boundary framework and constraint"]')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Fire radiant texture"]')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Earth crystalline texture"]')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Fifth house environment"]')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Twelfth house environment"]')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Play' }));
  fireEvent.animationEnd(container.querySelector('[aria-label="Sun to Saturn square relation"]'));
  expect(screen.getByText('Saturn / Arrival complete')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Replay' })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Next' }));
  expect(screen.getByRole('heading', { name: 'Sun → Opposition → Pluto' })).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Opposition axis polarity operator"]')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="180 degree polarity axis"]')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Square cross-force operator"]')).not.toBeInTheDocument();
  expect(container.querySelector('[aria-label="Trine resonance flow operator"]')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Play' })).toBeEnabled();
  fireEvent.click(screen.getByRole('button', { name: 'Play' }));
  fireEvent.animationEnd(container.querySelector('[aria-label="Sun to Pluto opposition relation"]'));
  expect(screen.getByText('Pluto / Arrival complete')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Replay' })).toBeInTheDocument();
});

test('uses neutral environments for partial square and opposition transitions', () => {
  const aspects = [
    { bodyA: 'sun', bodyB: 'saturn', type: 'square', angle: 89.4, orb: 0.6 },
    { bodyA: 'sun', bodyB: 'pluto', type: 'opposition', angle: 181.2, orb: 1.2 },
  ];
  const partialPlanets = prototypePlanets.map((planet) => ({ ...planet, house: null }));
  const { container } = render(<PrototypeHarness planets={partialPlanets} aspects={aspects} />);
  fireEvent.click(screen.getByRole('button', { name: 'Relation' }));

  expect(container.querySelectorAll('[aria-label="Neutral environment"]')).toHaveLength(2);
  expect(container.querySelector('[aria-label="Square cross-force operator"]')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Next' }));
  expect(container.querySelectorAll('[aria-label="Neutral environment"]')).toHaveLength(2);
  expect(container.querySelector('[aria-label="Opposition axis polarity operator"]')).toBeInTheDocument();
});

test('navigates relations without looping and resets animation state', () => {
  const { container } = render(<PrototypeHarness />);
  fireEvent.click(screen.getByRole('button', { name: 'Relation' }));

  const previous = screen.getByRole('button', { name: 'Previous' });
  const next = screen.getByRole('button', { name: 'Next' });
  expect(previous).toBeDisabled();
  expect(next).toBeEnabled();

  fireEvent.click(screen.getByRole('button', { name: 'Play' }));
  expect(screen.getByText('Transition in progress')).toBeInTheDocument();
  fireEvent.click(next);

  expect(screen.getByRole('heading', { name: 'Sun → Square → Saturn' })).toBeInTheDocument();
  expect(screen.getByText('Relation 2 / 2')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Previous' })).toBeEnabled();
  expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Play' })).toBeEnabled();
  expect(container.querySelector('[aria-label="Square cross-force operator"]')).toBeInTheDocument();
  expect(container.querySelector('[aria-label="Sextile relation operator"]')).not.toBeInTheDocument();
  expect(screen.getByRole('region', { name: 'Relation profile information' })).toHaveTextContent('Saturn');
  expect(screen.getByRole('region', { name: 'Relation profile information' })).toHaveTextContent('Square');
});

test('resets relation index when the selected planet changes', () => {
  render(<PrototypeHarness />);
  fireEvent.click(screen.getByRole('button', { name: 'Relation' }));
  fireEvent.click(screen.getByRole('button', { name: 'Next' }));
  expect(screen.getByText('Relation 2 / 2')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Individual' }));
  fireEvent.click(screen.getByRole('button', { name: 'Moon' }));
  fireEvent.click(screen.getByRole('button', { name: 'Relation' }));

  expect(screen.getByText('Relation 1 / 1')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  expect(screen.getByRole('heading', { name: 'Moon → Trine → Venus' })).toBeInTheDocument();
});

test('normalizes a selected bodyB planet to the relation source', () => {
  render(<PrototypeHarness />);
  fireEvent.click(screen.getByRole('button', { name: 'Individual' }));
  fireEvent.click(screen.getByRole('button', { name: 'Saturn' }));
  fireEvent.click(screen.getByRole('button', { name: 'Relation' }));

  expect(screen.getByRole('heading', { name: 'Saturn → Square → Sun' })).toBeInTheDocument();
  expect(screen.getByRole('region', { name: 'Relation profile information' })).toHaveTextContent('FromSaturn');
  expect(screen.getByRole('region', { name: 'Relation profile information' })).toHaveTextContent('ToSun');
});

test('shows relation fallbacks for no aspects and ungenerated data', () => {
  const { rerender } = render(<PrototypeHarness aspects={[]} />);
  fireEvent.click(screen.getByRole('button', { name: 'Relation' }));
  expect(screen.getByText('No major aspects for this planet.')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Previous' })).not.toBeInTheDocument();

  rerender(<PrototypeHarness planets={null} aspects={null} />);
  expect(screen.getByText('Generate a horoscope to view planet relations.')).toBeInTheDocument();
});

test('uses neutral environments for partial relation planets', () => {
  const partialPlanets = prototypePlanets.map((planet) => ({ ...planet, house: null }));
  const { container } = render(<PrototypeHarness planets={partialPlanets} />);
  fireEvent.click(screen.getByRole('button', { name: 'Relation' }));

  expect(container.querySelectorAll('[aria-label="Neutral environment"]')).toHaveLength(2);
  expect(screen.getByRole('region', { name: 'Relation profile information' })).toHaveTextContent('Leo / Unknown');
  expect(screen.getByRole('region', { name: 'Relation profile information' })).toHaveTextContent('Scorpio / Unknown');
});
