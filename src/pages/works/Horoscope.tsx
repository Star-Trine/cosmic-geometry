import { useState } from 'react';
import './Horoscope.css';
import {
  mockSun,
  mockHouse,
  mockAsc,
  mockAspect,
} from '../../data/horoscope/mockHoroscope';

import NatalChart from '../../components/horoscope/NatalChart';
import PlanetTable from '../../components/horoscope/PlanetTable';
import HouseTable from '../../components/horoscope/HouseTable';
import AngleTable from '../../components/horoscope/AngleTable';
import AspectTable from '../../components/horoscope/AspectTable';
import VisualProfile from '../../components/horoscope/VisualProfile';

type ViewMode =
  | 'chart'
  | 'planets'
  | 'houses'
  | 'angles'
  | 'aspects'
  | 'visualProfile';

export default function Horoscope() {
  const [viewMode, setViewMode] = useState<ViewMode>('chart');

  return (
    <div className="horoscope">
      <h1>Horoscope（ホロスコープ）</h1>

      <p>
        出生情報からネイタルチャートを生成し、天体、ハウス、
        アスペクトを視覚的に観察する作品です。
      </p>

      <div className="horoscope-mode-switcher">
        <button onClick={() => setViewMode('chart')}>Chart</button>

        <button onClick={() => setViewMode('planets')}>
          Planets
        </button>

        <button onClick={() => setViewMode('houses')}>
          Houses
        </button>

        <button onClick={() => setViewMode('angles')}>
          Angles
        </button>

        <button onClick={() => setViewMode('aspects')}>
          Aspects
        </button>

        <button onClick={() => setViewMode('visualProfile')}>
          Visual Profile
        </button>
      </div>

      <div className="horoscope-view">
        {viewMode === 'chart' && <NatalChart />}

        {viewMode === 'planets' && (
          <PlanetTable planet={mockSun} />
        )}

        {viewMode === 'houses' && (
          <HouseTable house={mockHouse} />
        )}

        {viewMode === 'angles' && (
          <AngleTable angle={mockAsc} />
        )}

        {viewMode === 'aspects' && (
          <AspectTable aspect={mockAspect} />
        )}

        {viewMode === 'visualProfile' && <VisualProfile />}
      </div>
    </div>
  );
}