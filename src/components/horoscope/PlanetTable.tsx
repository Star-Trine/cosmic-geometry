import type { PlanetData } from '../../data/horoscope/types';

type Props = {
  planet: PlanetData;
};

export default function PlanetTable({ planet }: Props) {
  return (
    <section>
      <h2>PlanetData</h2>
      <p>Planet: {planet.name}</p>
      <p>Sign: {planet.sign}</p>
      <p>Degree: {planet.degreeInSign}°</p>
      <p>House: {planet.house}</p>
      <p>Retrograde: {planet.retrograde ? 'Yes' : 'No'}</p>
    </section>
  );
}