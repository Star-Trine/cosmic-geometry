import { useState } from 'react';

import BasisMode from '../../components/timegeometry/modes/BasisMode';
import CrossProductMode from '../../components/timegeometry/modes/CrossProductMode';
import InnerProductMode from '../../components/timegeometry/modes/InnerProductMode';
import LinearMapMode from '../../components/timegeometry/modes/LinearMapMode';
import 'katex/dist/katex.min.css';
import './TimeVectorSpace.css';

export default function TimeVectorSpace() {
  const [activeMode, setActiveMode] =
    useState('basis');

  const navigation = (
    <nav
      className="time-vector-modes"
      aria-label="Time Vector Space modes"
    >
      <button
        type="button"
        className={
          activeMode === 'basis'
            ? 'is-active'
            : ''
        }
        aria-pressed={activeMode === 'basis'}
        onClick={() => setActiveMode('basis')}
      >
        Basis
        <span>基底</span>
      </button>

      <button
        type="button"
        className={
          activeMode === 'innerProduct'
            ? 'is-active'
            : ''
        }
        aria-pressed={
          activeMode === 'innerProduct'
        }
        onClick={() =>
          setActiveMode('innerProduct')
        }
      >
        Inner Product
        <span>内積</span>
      </button>

      <button
        type="button"
        className={
          activeMode === 'crossProduct'
            ? 'is-active'
            : ''
        }
        aria-pressed={
          activeMode === 'crossProduct'
        }
        onClick={() =>
          setActiveMode('crossProduct')
        }
      >
        Cross Product
        <span>外積</span>
      </button>

      <button
        type="button"
        className={
          activeMode === 'linearMap'
            ? 'is-active'
            : ''
        }
        aria-pressed={activeMode === 'linearMap'}
        onClick={() => setActiveMode('linearMap')}
      >
        Linear Map
        <span>線形写像</span>
      </button>
    </nav>
  );

  if (activeMode === 'innerProduct') {
    return (
      <InnerProductMode
        navigation={navigation}
      />
    );
  }

  if (activeMode === 'crossProduct') {
    return (
      <CrossProductMode
        navigation={navigation}
      />
    );
  }

  if (activeMode === 'linearMap') {
    return (
      <LinearMapMode
        navigation={navigation}
      />
    );
  }

  return <BasisMode navigation={navigation} />;
}
