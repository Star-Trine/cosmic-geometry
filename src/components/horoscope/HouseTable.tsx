import type { HouseData } from '../../data/horoscope/types';

type Props = {
  house: HouseData;
};

export default function HouseTable({ house }: Props) {
  return (
    <section>
      <h2>HouseData</h2>
      <p>House: {house.house}</p>
      <p>Cusp Longitude: {house.cuspLongitude}°</p>
    </section>
  );
}