import type { AspectData } from '../../data/horoscope/types';

type Props = {
  aspect: AspectData;
};

export default function AspectTable({ aspect }: Props) {
  return (
    <section>
      <h2>AspectData</h2>
      <p>
        {aspect.bodyA} - {aspect.bodyB}
      </p>
      <p>Type: {aspect.type}</p>
      <p>Angle: {aspect.angle}°</p>
      <p>Orb: {aspect.orb}°</p>
    </section>
  );
}