import { useState } from 'react';
import './Horoscope.css';

import { HoroscopeApiError, requestHoroscope } from '../../api/horoscope';
import type { HoroscopeRequest, HoroscopeResponse } from '../../data/horoscope/types';
import NatalChart from '../../components/horoscope/NatalChart';
import PlanetTable from '../../components/horoscope/PlanetTable';
import HouseTable from '../../components/horoscope/HouseTable';
import AngleTable from '../../components/horoscope/AngleTable';
import AspectTable from '../../components/horoscope/AspectTable';
import VisualProfile from '../../components/horoscope/VisualProfile';
import BirthInput from '../../components/horoscope/BirthInput';
import HoroscopeResultSummary from '../../components/horoscope/HoroscopeResultSummary';
import AnalysisTable from '../../components/horoscope/AnalysisTable';

type ViewMode = 'planets' | 'houses' | 'angles' | 'aspects' | 'analysis' | 'visualProfile';

const MODES: Array<{ id: ViewMode; label: string }> = [
  { id: 'planets', label: 'Planets' },
  { id: 'houses', label: 'Houses' },
  { id: 'angles', label: 'Angles' },
  { id: 'aspects', label: 'Aspects' },
  { id: 'analysis', label: 'Analysis' },
  { id: 'visualProfile', label: 'Visual Profile' },
];

const initialRequest: HoroscopeRequest = {
  date: '1995-09-12',
  time: '14:30',
  timeKnown: true,
  place: {
    name: 'Tokyo',
    city: 'Tokyo',
    country: 'Japan',
    latitude: 35.6762,
    longitude: 139.6503,
    timezone: 'Asia/Tokyo',
  },
};

export default function Horoscope() {
  const [viewMode, setViewMode] = useState<ViewMode>('planets');
  const [request, setRequest] = useState<HoroscopeRequest>(initialRequest);
  const [response, setResponse] = useState<HoroscopeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditingBirthData, setIsEditingBirthData] = useState(true);

  const generateHoroscope = async () => {
    setLoading(true);
    setError(null);
    try {
      setResponse(await requestHoroscope(request));
      setIsEditingBirthData(false);
    } catch (caught) {
      setResponse(null);
      setError(caught instanceof HoroscopeApiError
        ? `${caught.code}: ${caught.message}`
        : 'Horoscope data could not be generated.');
    } finally {
      setLoading(false);
    }
  };

  const renderBirthData = () => {
    if (response && !isEditingBirthData) {
      const birth = response.horoscope.birth;
      return (
        <section className="horoscope-birth-summary">
          <div className="horoscope-panel-heading">
            <p>Birth Data</p>
            <h2>Current Chart</h2>
          </div>
          <dl>
            <div><dt>Date</dt><dd>{birth.date}</dd></div>
            <div><dt>Time</dt><dd>{birth.timeKnown ? birth.time : 'Unknown'}</dd></div>
            <div><dt>Location</dt><dd>{birth.city}</dd></div>
            <div><dt>Timezone</dt><dd>{birth.timezone}</dd></div>
            <div><dt>Profile</dt><dd>{response.visualProfile.mode}</dd></div>
          </dl>
          <button type="button" onClick={() => setIsEditingBirthData(true)}>
            Edit / Recalculate
          </button>
        </section>
      );
    }

    return (
      <BirthInput
        value={request}
        disabled={loading}
        onChange={setRequest}
        onSubmit={generateHoroscope}
      />
    );
  };

  const renderInformation = () => {
    if (!response) {
      return <p className="horoscope-empty">Generate a horoscope to view {viewMode} data.</p>;
    }

    if (viewMode === 'planets') {
      return <PlanetTable planets={response.horoscope.planets} />;
    }
    if (viewMode === 'houses') {
      return response.horoscope.houses === null
        ? <p className="horoscope-empty">House data is unavailable when birth time is unknown.</p>
        : <HouseTable houses={response.horoscope.houses} />;
    }
    if (viewMode === 'angles') {
      return response.horoscope.angles === null
        ? <p className="horoscope-empty">Angle data is unavailable when birth time is unknown.</p>
        : <AngleTable angles={response.horoscope.angles} />;
    }
    if (viewMode === 'aspects') {
      return <AspectTable aspects={response.horoscope.aspects} />;
    }
    return <AnalysisTable analysis={response.analysis} />;
  };

  const isVisualProfile = viewMode === 'visualProfile';
  const ascLongitude = response?.horoscope.birth.timeKnown === true
    ? response.horoscope.angles?.find((angle) => angle.name === 'ASC')?.longitude ?? null
    : null;

  return (
    <div className="horoscope-work">
      <header className="horoscope-header">
        <div>
          <p className="horoscope-eyebrow">Cosmic Geometry / Natal Structure</p>
          <h1>Horoscope <span>ホロスコープ</span></h1>
        </div>
        <p className="horoscope-introduction">
          出生図の構造を、天体・ハウス・角度・関係性から観察する。
        </p>
      </header>

      <nav className="horoscope-mode-selector" aria-label="Horoscope modes">
        {MODES.map((mode) => (
          <button
            key={mode.id}
            type="button"
            className={viewMode === mode.id ? 'is-active' : ''}
            aria-pressed={viewMode === mode.id}
            onClick={() => setViewMode(mode.id)}
          >
            {mode.label}
          </button>
        ))}
      </nav>

      {loading && <p className="horoscope-status" aria-live="polite">Generating horoscope…</p>}
      {error && <p className="horoscope-status horoscope-status--error" role="alert">{error}</p>}

      {isVisualProfile ? (
        <div className="horoscope-profile-workspace">
          <aside className="horoscope-panel horoscope-profile-info">
            <div className="horoscope-panel-heading">
              <p>Profile Info / Controls</p>
              <h2>Derived Structure</h2>
            </div>
            {response ? <HoroscopeResultSummary response={response} /> : renderBirthData()}
            {response && (
              <button type="button" onClick={() => setIsEditingBirthData(true)}>
                Edit Birth Data
              </button>
            )}
            {response && isEditingBirthData && renderBirthData()}
          </aside>
          <main className="horoscope-profile-canvas" aria-label="Visual Profile workspace">
            <VisualProfile />
          </main>
        </div>
      ) : (
        <div className="horoscope-workspace">
          <aside className="horoscope-panel horoscope-birth-panel">
            {renderBirthData()}
          </aside>

          <main className="horoscope-chart-stage">
            <NatalChart
              ascLongitude={ascLongitude}
              angles={response?.horoscope.angles ?? null}
              aspects={response?.horoscope.aspects ?? []}
              houses={response?.horoscope.houses ?? null}
              planets={response?.horoscope.planets ?? []}
            />
          </main>

          <aside className="horoscope-panel horoscope-information-panel">
            <div className="horoscope-panel-heading">
              <p>Information</p>
              <h2>{MODES.find((mode) => mode.id === viewMode)?.label}</h2>
            </div>
            <div className="horoscope-information-content">
              {renderInformation()}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
