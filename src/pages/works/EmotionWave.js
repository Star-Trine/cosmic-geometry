import { useMemo, useState } from 'react';
import './EmotionWave.css';

const emotions = [
  {
    id: 'joy',
    name: '喜び',
    english: 'Joy',
    color: '#f6d84a',
    frequency: 1,
    phase: 0,
  },
  {
    id: 'trust',
    name: '信頼',
    english: 'Trust',
    color: '#64c878',
    frequency: 1.25,
    phase: Math.PI / 6,
  },
  {
    id: 'fear',
    name: '恐れ',
    english: 'Fear',
    color: '#43b7a7',
    frequency: 1.5,
    phase: Math.PI / 4,
  },
  {
    id: 'surprise',
    name: '驚き',
    english: 'Surprise',
    color: '#69c9ef',
    frequency: 1.75,
    phase: Math.PI / 3,
  },
  {
    id: 'sadness',
    name: '悲しみ',
    english: 'Sadness',
    color: '#587bd8',
    frequency: 2,
    phase: Math.PI / 2,
  },
  {
    id: 'disgust',
    name: '嫌悪',
    english: 'Disgust',
    color: '#a96ad8',
    frequency: 2.25,
    phase: Math.PI * 0.65,
  },
  {
    id: 'anger',
    name: '怒り',
    english: 'Anger',
    color: '#e85b5b',
    frequency: 2.5,
    phase: Math.PI * 0.8,
  },
  {
    id: 'anticipation',
    name: '期待',
    english: 'Anticipation',
    color: '#ef9a3d',
    frequency: 2.75,
    phase: Math.PI,
  },
];

const SVG_WIDTH = 1000;
const SVG_HEIGHT = 420;
const CENTER_Y = SVG_HEIGHT / 2;
const SAMPLE_COUNT = 240;

export default function EmotionWave() {
  const [strengths, setStrengths] = useState(() =>
    Object.fromEntries(emotions.map((emotion) => [emotion.id, 0]))
  );

  const activeEmotions = useMemo(
    () =>
      emotions
        .filter((emotion) => strengths[emotion.id] > 0)
        .sort(
          (a, b) =>
            strengths[b.id] - strengths[a.id]
        ),
    [strengths]
  );

  const dominantEmotion = activeEmotions[0] ?? null;

  const totalStrength = useMemo(
    () =>
      emotions.reduce(
        (sum, emotion) => sum + strengths[emotion.id],
        0
      ),
    [strengths]
  );

  const combinedWavePoints = useMemo(() => {
    const normalization = Math.max(totalStrength, 100);

    return Array.from({ length: SAMPLE_COUNT }, (_, index) => {
      const progress = index / (SAMPLE_COUNT - 1);
      const x = progress * SVG_WIDTH;

      const waveValue = emotions.reduce((sum, emotion) => {
        const strength = strengths[emotion.id] / 100;

        return (
          sum +
          strength *
            Math.sin(
              progress *
                Math.PI *
                2 *
                emotion.frequency +
                emotion.phase
            )
        );
      }, 0);

      const amplitude =
        (waveValue / (normalization / 100)) * 120;

      const y = CENTER_Y - amplitude;

      return `${x},${y}`;
    }).join(' ');
  }, [strengths, totalStrength]);

  const handleStrengthChange = (emotionId, value) => {
    setStrengths((current) => ({
      ...current,
      [emotionId]: Number(value),
    }));
  };

  const resetEmotions = () => {
    setStrengths(
      Object.fromEntries(
        emotions.map((emotion) => [emotion.id, 0])
      )
    );
  };

  return (
    <main className="emotion-wave-work">
  <header className="emotion-wave-header">
    <div className="emotion-wave-header-content">
      <p className="emotion-wave-eyebrow">
        COSMIC GEOMETRY / INTERACTIVE WORK
      </p>

      <h1>Emotion Wave</h1>

      <p>
        感情の強度を操作し、重なり合う波の変化を観察する。
      </p>
    </div>

    <div className="emotion-wave-header-actions">
      <a
        href="/concepts/emotion-wave"
        className="emotion-wave-concept-link"
      >
        Conceptを見る
      </a>

      <a
        href="/tech-notes/emotion-wave"
        className="emotion-wave-tech-note-link"
      >
        TechNoteを見る
      </a>

      <button
        type="button"
        className="emotion-reset-button"
        onClick={resetEmotions}
      >
        Reset
      </button>
    </div>
  </header>

      <div className="emotion-wave-layout">
        <aside className="emotion-control-panel">
          <div className="panel-heading">
            <p>PRIMARY EMOTIONS</p>
            <h2>一次感情</h2>
          </div>

          <div className="emotion-controls">
            {emotions.map((emotion) => (
              <label
                key={emotion.id}
                className="emotion-control"
              >
                <span className="emotion-control-heading">
                  <span
                    className="emotion-color"
                    style={{
                      backgroundColor: emotion.color,
                    }}
                  />

                  <span>
                    <strong>{emotion.name}</strong>
                    <small>{emotion.english}</small>
                  </span>

                  <output>
                    {strengths[emotion.id]}
                  </output>
                </span>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={strengths[emotion.id]}
                  onChange={(event) =>
                    handleStrengthChange(
                      emotion.id,
                      event.target.value
                    )
                  }
                  style={{
                    accentColor: emotion.color,
                  }}
                />
              </label>
            ))}
          </div>
        </aside>

        <section className="emotion-visual-panel">
          <div className="visual-heading">
            <div>
              <p>COMBINED WAVE</p>
              <h2>感情の合成波</h2>
            </div>

            <span>
              Total Strength：{totalStrength}
            </span>
          </div>

          <div className="wave-stage">
            <svg
              viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
              role="img"
              aria-label="選択した感情から生成された合成波"
            >
              <defs>
                <linearGradient
                  id="emotion-wave-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  {emotions.map((emotion, index) => (
                    <stop
                      key={emotion.id}
                      offset={`${
                        (index / (emotions.length - 1)) *
                        100
                      }%`}
                      stopColor={emotion.color}
                    />
                  ))}

                  <filter id="emotion-wave-glow">
                    <feGaussianBlur
                      stdDeviation="6"
                      result="blur"
                    />

                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </linearGradient>
              </defs>

              <line
                x1="0"
                y1={CENTER_Y}
                x2={SVG_WIDTH}
                y2={CENTER_Y}
                className="wave-axis"
              />

              <polyline
                points={combinedWavePoints}
                className="combined-wave"
                filter="url(#emotion-wave-glow)"
              />
            </svg>

            {activeEmotions.length === 0 && (
              <p className="wave-empty-message">
                左側のスライダーから感情を選択してください。
              </p>
            )}
          </div>

          <div className="emotion-status-grid">
            <article className="emotion-status-card">
              <p>DOMINANT EMOTION</p>
              <h3>
                {dominantEmotion
                  ? `${dominantEmotion.name} / ${dominantEmotion.english}`
                  : '未選択'}
              </h3>

              <span>
                {dominantEmotion
                  ? `強度 ${strengths[dominantEmotion.id]}`
                  : '感情を選択してください'}
              </span>
            </article>

            <article className="emotion-status-card">
              <p>ACTIVE EMOTIONS</p>
              <h3>{activeEmotions.length}</h3>

              <span>
                {activeEmotions.length > 0
                  ? activeEmotions
                      .map((emotion) => emotion.name)
                      .join('・')
                  : '現在アクティブな感情はありません'}
              </span>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
