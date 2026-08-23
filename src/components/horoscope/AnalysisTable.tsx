import type { HoroscopeAnalysis } from '../../data/horoscope/types';

type Props = {
  analysis: HoroscopeAnalysis;
};

export default function AnalysisTable({ analysis }: Props) {
  return (
    <section>
      <h2>Analysis</h2>

      <h3>Polarity</h3>
      <table>
        <tbody>
          <tr><th scope="row">Masculine</th><td>{analysis.polarity.masculine}</td></tr>
          <tr><th scope="row">Feminine</th><td>{analysis.polarity.feminine}</td></tr>
        </tbody>
      </table>

      <h3>Modalities</h3>
      <table>
        <tbody>
          <tr><th scope="row">Cardinal</th><td>{analysis.modalities.cardinal}</td></tr>
          <tr><th scope="row">Fixed</th><td>{analysis.modalities.fixed}</td></tr>
          <tr><th scope="row">Mutable</th><td>{analysis.modalities.mutable}</td></tr>
        </tbody>
      </table>

      <h3>Elements</h3>
      <table>
        <tbody>
          <tr><th scope="row">Fire</th><td>{analysis.elements.fire}</td></tr>
          <tr><th scope="row">Earth</th><td>{analysis.elements.earth}</td></tr>
          <tr><th scope="row">Air</th><td>{analysis.elements.air}</td></tr>
          <tr><th scope="row">Water</th><td>{analysis.elements.water}</td></tr>
        </tbody>
      </table>

      <h3>Planet Distribution</h3>
      <table>
        <thead><tr><th scope="col">Sign</th><th scope="col">Count</th></tr></thead>
        <tbody>
          {analysis.planetDistribution.map((item) => (
            <tr key={item.sign}><th scope="row">{item.sign}</th><td>{item.count}</td></tr>
          ))}
        </tbody>
      </table>

      <h3>House Distribution</h3>
      {analysis.houseDistribution === null ? (
        <p>House distribution is unavailable when birth time is unknown.</p>
      ) : (
        <table>
          <thead><tr><th scope="col">House</th><th scope="col">Count</th></tr></thead>
          <tbody>
            {analysis.houseDistribution.map((item) => (
              <tr key={item.house}><th scope="row">House {item.house}</th><td>{item.count}</td></tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
