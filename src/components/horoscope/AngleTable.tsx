import type { AnglePoint } from '../../data/horoscope/types';
import { formatDegreeInSign } from './informationFormatters';

type Props = {
  angles: AnglePoint[];
};

export default function AngleTable({ angles }: Props) {
  return (
    <section>
      <h2>Angles</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Angle</th>
            <th scope="col">Sign</th>
            <th scope="col">Degree</th>
          </tr>
        </thead>
        <tbody>
          {angles.map((angle) => (
            <tr key={angle.name}>
              <th scope="row">{angle.name}</th>
              <td>{angle.sign}</td>
              <td>{formatDegreeInSign(angle.degreeInSign)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
