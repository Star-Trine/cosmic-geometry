import type { PlanetData } from '../../data/horoscope/types';
import { formatDegreeInSign } from './informationFormatters';

type Props = {
  planets: PlanetData[];
};

export default function PlanetTable({ planets }: Props) {
  return (
    <section>
      <h2>Planets</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Planet</th>
            <th scope="col">Sign</th>
            <th scope="col">Degree</th>
            <th scope="col">House</th>
            <th scope="col">Motion</th>
          </tr>
        </thead>
        <tbody>
          {planets.map((planet) => (
            <tr key={planet.id}>
              <th scope="row">{planet.name}</th>
              <td>{planet.sign}</td>
              <td>{formatDegreeInSign(planet.degreeInSign)}</td>
              <td>{planet.house ?? 'Unknown'}</td>
              <td>{planet.retrograde ? 'Retrograde / R' : 'Direct'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
