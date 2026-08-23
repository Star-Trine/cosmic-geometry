import type { HouseData } from '../../data/horoscope/types';
import { formatRoundedAngle } from './informationFormatters';

type Props = {
  houses: HouseData[];
};

export default function HouseTable({ houses }: Props) {
  return (
    <section>
      <h2>Houses</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">House</th>
            <th scope="col">Cusp Longitude</th>
          </tr>
        </thead>
        <tbody>
          {houses.map((house) => (
            <tr key={house.house}>
              <th scope="row">House {house.house}</th>
              <td>{formatRoundedAngle(house.cuspLongitude)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
