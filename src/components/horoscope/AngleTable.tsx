import type { AnglePoint } from '../../data/horoscope/types';

type Props = {
  angle: AnglePoint;
};

export default function AngleTable({ angle }: Props) {
  return (
    <section>
      <h2>AnglePoint</h2>
      <p>Point: {angle.name}</p>
      <p>Sign: {angle.sign}</p>
      <p>Degree: {angle.degreeInSign}°</p>
      <p>Longitude: {angle.longitude}°</p>
    </section>
  );
}