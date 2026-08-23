import type { AspectData } from '../../data/horoscope/types';
import { formatRoundedAngle } from './informationFormatters';

type Props = {
  aspects: AspectData[];
};

export default function AspectTable({ aspects }: Props) {
  return (
    <section>
      <h2>Aspects</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Bodies</th>
            <th scope="col">Type</th>
            <th scope="col">Angle</th>
            <th scope="col">Orb</th>
          </tr>
        </thead>
        <tbody>
          {aspects.map((aspect) => (
            <tr key={`${aspect.bodyA}-${aspect.bodyB}`}>
              <th scope="row">{aspect.bodyA} — {aspect.bodyB}</th>
              <td>{aspect.type}</td>
              <td>{formatRoundedAngle(aspect.angle)}</td>
              <td>{formatRoundedAngle(aspect.orb)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
