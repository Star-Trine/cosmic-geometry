import type { HouseData } from '../../data/horoscope/types';
import { formatLongitudeAsSignDegree } from './informationFormatters';

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
            <th scope="col">Sign</th>
            <th scope="col">Degree</th>
          </tr>
        </thead>
        <tbody>
          {houses.map((house) => {
            const { sign, degree } = formatLongitudeAsSignDegree(house.cuspLongitude);
            return (
              <tr key={house.house}>
                <th scope="row">House {house.house}</th>
                <td>{sign}</td>
                <td>{degree}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
