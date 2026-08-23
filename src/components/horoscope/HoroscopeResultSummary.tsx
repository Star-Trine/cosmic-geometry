import type { HoroscopeResponse } from '../../data/horoscope/types';

type Props = {
  response: HoroscopeResponse;
};

export default function HoroscopeResultSummary({ response }: Props) {
  const sun = response.horoscope.planets.find((planet) => planet.id === 'sun');
  const moon = response.horoscope.planets.find((planet) => planet.id === 'moon');
  const { elements } = response.analysis;
  const { direction } = response.visualProfile;

  return (
    <section className="horoscope-result-summary" aria-live="polite">
      <h2>Generated Data</h2>
      <dl>
        <div><dt>Profile mode</dt><dd>{response.visualProfile.mode}</dd></div>
        <div><dt>Sun sign</dt><dd>{sun?.sign ?? 'Unavailable'}</dd></div>
        <div><dt>Moon sign</dt><dd>{moon?.sign ?? 'Unavailable'}</dd></div>
        <div><dt>Planets</dt><dd>{response.horoscope.planets.length}</dd></div>
        <div><dt>Aspects</dt><dd>{response.horoscope.aspects.length}</dd></div>
        <div>
          <dt>Elements</dt>
          <dd>Fire {elements.fire} / Earth {elements.earth} / Air {elements.air} / Water {elements.water}</dd>
        </div>
        <div>
          <dt>Direction</dt>
          <dd>Outward {direction.outward} / Inward {direction.inward}</dd>
        </div>
      </dl>
    </section>
  );
}
