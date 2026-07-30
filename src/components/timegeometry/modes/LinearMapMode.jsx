import { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { BlockMath } from 'react-katex';
import * as THREE from 'three';
import BackgroundTimeDirections from '../BackgroundTimeDirections';
import BasisAxes from '../BasisAxes';
import TimeParticles from '../TimeParticles';
import VectorArrow from '../VectorArrow';
import { COLORS } from '../constants';

const INITIAL_SCALE = { s1: 1.4, s2: 0.8, s3: 1.2 };
const INITIAL_ROTATION_ANGLE = 35;
const INITIAL_SHEAR_FACTOR = 0.7;
const INITIAL_VECTOR = { v1: 1.2, v2: 1.0, v3: 0.7 };
const ZERO_THRESHOLD = 1e-10;

const TRANSFORMATION_TYPES = [
  { id: 'scale', label: 'Scale', japanese: '拡大・縮小' },
  { id: 'rotation', label: 'Rotation', japanese: '回転' },
  { id: 'shear', label: 'Shear', japanese: 'せん断' },
  { id: 'reflection', label: 'Reflection', japanese: '反転' },
  { id: 'projection', label: 'Projection', japanese: '射影' },
];

const TRANSFORMED_BASIS = [
  { label: 'Ae₁', color: '#63f4d8' },
  { label: 'Ae₂', color: '#ffcf70' },
  { label: 'Ae₃', color: '#ff7ee2' },
];

function createMatrix(type, scale, rotationAngle, shearFactor) {
  if (type === 'rotation') {
    const radians = THREE.MathUtils.degToRad(rotationAngle);
    const cosine = Math.cos(radians);
    const sine = Math.sin(radians);

    return [
      [cosine, -sine, 0],
      [sine, cosine, 0],
      [0, 0, 1],
    ];
  }

  if (type === 'shear') {
    return [
      [1, shearFactor, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];
  }

  if (type === 'reflection') {
    return [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, -1],
    ];
  }

  if (type === 'projection') {
    return [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ];
  }

  return [
    [scale.s1, 0, 0],
    [0, scale.s2, 0],
    [0, 0, scale.s3],
  ];
}

function transformVector(matrix, vector) {
  return new THREE.Vector3(
    matrix[0][0] * vector.x +
      matrix[0][1] * vector.y +
      matrix[0][2] * vector.z,
    matrix[1][0] * vector.x +
      matrix[1][1] * vector.y +
      matrix[1][2] * vector.z,
    matrix[2][0] * vector.x +
      matrix[2][1] * vector.y +
      matrix[2][2] * vector.z
  );
}

function calculateDeterminant(matrix) {
  const [a, b, c] = matrix;

  return (
    a[0] * (b[1] * c[2] - b[2] * c[1]) -
    a[1] * (b[0] * c[2] - b[2] * c[0]) +
    a[2] * (b[0] * c[1] - b[1] * c[0])
  );
}

function formatValue(value, digits = 2) {
  if (!Number.isFinite(value)) {
    return '—';
  }

  return (Math.abs(value) < 0.005 ? 0 : value).toFixed(digits);
}

function RangeSlider({
  id,
  label,
  value,
  min,
  max,
  step,
  color,
  unit = '',
  onChange,
}) {
  return (
    <label
      className="time-vector-slider"
      htmlFor={id}
      style={{ '--slider-color': color }}
    >
      <span className="time-vector-slider__header">
        <span>{label}</span>
        <output htmlFor={id}>
          {Number.isInteger(step) ? value.toFixed(0) : value.toFixed(1)}
          {unit}
        </output>
      </span>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function InputVectorGroup({
  vector,
  isOpen,
  onToggle,
  onChange,
}) {
  return (
    <section className="time-vector-vector-group">
      <button
        type="button"
        className="time-vector-vector-group__toggle"
        aria-expanded={isOpen}
        aria-controls="linear-map-input-vector"
        onClick={onToggle}
      >
        <span>Input Vector（入力ベクトル）</span>
        <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
      </button>

      {isOpen && (
        <div
          id="linear-map-input-vector"
          className="time-vector-vector-group__body"
        >
          <div className="time-vector-sliders">
            {['v1', 'v2', 'v3'].map((key, index) => (
              <RangeSlider
                key={key}
                id={`linear-map-${key}`}
                label={`v${index + 1}`}
                value={vector[key]}
                min={-2}
                max={2}
                step={0.1}
                color={COLORS.t1}
                onChange={(value) => onChange(key, value)}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function TransformedGrid({ matrix }) {
  const geometry = useMemo(() => {
    const positions = [];
    const extent = 2;

    for (let first = -extent; first <= extent; first += 1) {
      for (let second = -extent; second <= extent; second += 1) {
        const segments = [
          [
            new THREE.Vector3(-extent, first, second),
            new THREE.Vector3(extent, first, second),
          ],
          [
            new THREE.Vector3(first, -extent, second),
            new THREE.Vector3(first, extent, second),
          ],
          [
            new THREE.Vector3(first, second, -extent),
            new THREE.Vector3(first, second, extent),
          ],
        ];

        segments.forEach(([start, end]) => {
          positions.push(
            ...transformVector(matrix, start).toArray(),
            ...transformVector(matrix, end).toArray()
          );
        });
      }
    }

    const gridGeometry = new THREE.BufferGeometry();
    gridGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    );

    return gridGeometry;
  }, [matrix]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial
        color="#9f8cff"
        opacity={0.28}
        transparent
        depthWrite={false}
      />
    </lineSegments>
  );
}

function LinearMapScene({
  matrix,
  inputVector,
  transformedVector,
  transformedBasis,
  showOriginalGrid,
  showTransformedGrid,
}) {
  return (
    <>
      <color attach="background" args={['#030510']} />
      <fog attach="fog" args={['#030510', 8, 18]} />

      <ambientLight intensity={0.55} />
      <pointLight
        position={[3, 4, 5]}
        intensity={12}
        color="#8277ff"
        distance={14}
      />
      <pointLight
        position={[-4, -2, 3]}
        intensity={8}
        color="#4ed8ff"
        distance={12}
      />

      <TimeParticles />
      <BackgroundTimeDirections />

      {showOriginalGrid && (
        <>
          <BasisAxes />
          <gridHelper
            args={[12, 24, '#4c4a75', '#25263d']}
            position={[0, -0.03, 0]}
          />
        </>
      )}

      {showTransformedGrid && <TransformedGrid matrix={matrix} />}

      {transformedBasis.map((basisVector, index) => (
        <VectorArrow
          key={TRANSFORMED_BASIS[index].label}
          vector={basisVector}
          color={TRANSFORMED_BASIS[index].color}
          label={TRANSFORMED_BASIS[index].label}
          labelColor={TRANSFORMED_BASIS[index].color}
          opacity={0.9}
          headLength={0.25}
          headWidth={0.13}
        />
      ))}

      <VectorArrow
        vector={inputVector}
        color="#8795b5"
        label="v"
        labelColor="#b9c4df"
        opacity={0.78}
      />
      <VectorArrow
        vector={transformedVector}
        color={COLORS.result}
        label="Av"
        labelColor={COLORS.result}
        headLength={0.34}
        headWidth={0.19}
      />

      <OrbitControls
        enableDamping
        dampingFactor={0.06}
        minDistance={4.5}
        maxDistance={12}
        target={[0.65, 0.65, 0.65]}
      />
    </>
  );
}

export default function LinearMapMode({ navigation }) {
  const [transformationType, setTransformationType] = useState('scale');
  const [scale, setScale] = useState(INITIAL_SCALE);
  const [rotationAngle, setRotationAngle] = useState(
    INITIAL_ROTATION_ANGLE
  );
  const [shearFactor, setShearFactor] = useState(INITIAL_SHEAR_FACTOR);
  const [input, setInput] = useState(INITIAL_VECTOR);
  const [isInputOpen, setIsInputOpen] = useState(true);
  const [showOriginalGrid, setShowOriginalGrid] = useState(true);
  const [showTransformedGrid, setShowTransformedGrid] = useState(true);

  const matrix = useMemo(
    () =>
      createMatrix(
        transformationType,
        scale,
        rotationAngle,
        shearFactor
      ),
    [transformationType, scale, rotationAngle, shearFactor]
  );

  const {
    inputVector,
    transformedVector,
    transformedBasis,
    determinant,
  } = useMemo(() => {
    const nextInputVector = new THREE.Vector3(
      input.v1,
      input.v2,
      input.v3
    );
    const standardBasis = [
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 1),
    ];

    return {
      inputVector: nextInputVector,
      transformedVector: transformVector(matrix, nextInputVector),
      transformedBasis: standardBasis.map((basisVector) =>
        transformVector(matrix, basisVector)
      ),
      determinant: calculateDeterminant(matrix),
    };
  }, [input, matrix]);

  const updateScale = (key, value) => {
    setScale((current) => ({ ...current, [key]: value }));
  };

  const updateInput = (key, value) => {
    setInput((current) => ({ ...current, [key]: value }));
  };

  const reset = () => {
    setTransformationType('scale');
    setScale(INITIAL_SCALE);
    setRotationAngle(INITIAL_ROTATION_ANGLE);
    setShearFactor(INITIAL_SHEAR_FACTOR);
    setInput(INITIAL_VECTOR);
    setIsInputOpen(true);
    setShowOriginalGrid(true);
    setShowTransformedGrid(true);
  };

  const determinantMeaning =
    Math.abs(determinant) < ZERO_THRESHOLD
      ? '次元が失われる'
      : determinant < 0
        ? '向きが反転'
        : '向きを保つ';

  return (
    <main className="time-vector-work">
      <header className="time-vector-work__header">
        <div>
          <p className="time-vector-work__eyebrow">
            Time Geometry / Linear Map Mode
          </p>
          <h1>
            Linear Transformation
            <span>時間ベクトルの線形写像</span>
          </h1>
        </div>
        <a
          href="/concepts/time-vector-space"
          className="time-vector-work__concept-link"
        >
          Conceptを見る
        </a>
      </header>

      {navigation}

      <section className="time-vector-interface">
        <aside className="time-vector-panel time-vector-controls">
          <p className="time-vector-panel__label">Control Panel</p>
          <h2>空間の変換を選ぶ</h2>

          <section className="linear-map-control-section">
            <h3>Transformation Type（変換の種類）</h3>
            <div className="linear-map-type-selector">
              {TRANSFORMATION_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  className={
                    transformationType === type.id ? 'is-active' : ''
                  }
                  aria-pressed={transformationType === type.id}
                  onClick={() => setTransformationType(type.id)}
                >
                  {type.label}
                  <span>{type.japanese}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="linear-map-control-section">
            <h3>Transformation Parameters（変換係数）</h3>
            {transformationType === 'scale' && (
              <div className="time-vector-sliders">
                {['s1', 's2', 's3'].map((key, index) => (
                  <RangeSlider
                    key={key}
                    id={`linear-map-${key}`}
                    label={`s${index + 1}`}
                    value={scale[key]}
                    min={0}
                    max={2}
                    step={0.1}
                    color={TRANSFORMED_BASIS[index].color}
                    onChange={(value) => updateScale(key, value)}
                  />
                ))}
              </div>
            )}
            {transformationType === 'rotation' && (
              <div className="time-vector-sliders">
                <RangeSlider
                  id="linear-map-rotation-angle"
                  label="Rotation Angle（回転角）"
                  value={rotationAngle}
                  min={-180}
                  max={180}
                  step={1}
                  color={COLORS.t2}
                  unit="°"
                  onChange={setRotationAngle}
                />
              </div>
            )}
            {transformationType === 'shear' && (
              <div className="time-vector-sliders">
                <RangeSlider
                  id="linear-map-shear-factor"
                  label="Shear Factor（せん断係数）k"
                  value={shearFactor}
                  min={-2}
                  max={2}
                  step={0.1}
                  color={COLORS.t2}
                  onChange={setShearFactor}
                />
              </div>
            )}
            {transformationType === 'reflection' && (
              <p className="linear-map-fixed-note">
                t1t2平面について反転する固定変換です。
              </p>
            )}
            {transformationType === 'projection' && (
              <p className="linear-map-fixed-note">
                t1t2平面へ射影する固定変換です。
              </p>
            )}
          </section>

          <InputVectorGroup
            vector={input}
            isOpen={isInputOpen}
            onToggle={() => setIsInputOpen((current) => !current)}
            onChange={updateInput}
          />

          <section className="linear-map-control-section">
            <h3>Display Options（表示設定）</h3>
            <label className="time-vector-toggle linear-map-toggle">
              <input
                type="checkbox"
                checked={showOriginalGrid}
                onChange={(event) =>
                  setShowOriginalGrid(event.target.checked)
                }
              />
              <span
                className="time-vector-toggle__switch"
                aria-hidden="true"
              />
              <span>Original Grid（変換前の格子）</span>
            </label>
            <label className="time-vector-toggle linear-map-toggle">
              <input
                type="checkbox"
                checked={showTransformedGrid}
                onChange={(event) =>
                  setShowTransformedGrid(event.target.checked)
                }
              />
              <span
                className="time-vector-toggle__switch"
                aria-hidden="true"
              />
              <span>Transformed Grid（変換後の格子）</span>
            </label>
          </section>

          <button
            type="button"
            className="time-vector-reset"
            onClick={reset}
          >
            Reset
          </button>
        </aside>

        <section className="time-vector-canvas" aria-label="線形写像の3D表示">
          <Canvas
            camera={{ position: [5.8, 4.5, 6.8], fov: 46 }}
            dpr={[1, 1.7]}
          >
            <LinearMapScene
              matrix={matrix}
              inputVector={inputVector}
              transformedVector={transformedVector}
              transformedBasis={transformedBasis}
              showOriginalGrid={showOriginalGrid}
              showTransformedGrid={showTransformedGrid}
            />
          </Canvas>
        </section>

        <aside className="time-vector-panel time-vector-results">
          <p className="time-vector-panel__label">Result Panel</p>
          <h2>空間と時間状態の変換</h2>

          <div className="time-vector-result-grid linear-map-results">
            <article className="time-vector-result-card time-vector-result-card--formula">
              <p className="time-vector-result-card__label">
                Transformation Matrix（変換行列）
              </p>
              <div className="time-vector-formula">
                <BlockMath
                  math={`A=\\begin{pmatrix}${matrix
                    .map((row) => row.map((value) => formatValue(value)).join('&'))
                    .join('\\\\')}\\end{pmatrix}`}
                />
              </div>
            </article>

            <article className="time-vector-result-card">
              <p className="time-vector-result-card__label">
                Input Vector（入力ベクトル）
              </p>
              <strong>
                v = ({formatValue(inputVector.x)}, {formatValue(inputVector.y)},{' '}
                {formatValue(inputVector.z)})
              </strong>
            </article>

            <article className="time-vector-result-card">
              <p className="time-vector-result-card__label">
                Transformed Vector（変換後のベクトル）
              </p>
              <strong>
                Av = ({formatValue(transformedVector.x)},{' '}
                {formatValue(transformedVector.y)},{' '}
                {formatValue(transformedVector.z)})
              </strong>
            </article>

            <article className="time-vector-result-card">
              <p className="time-vector-result-card__label">
                Determinant（行列式）
              </p>
              <strong>det(A) = {formatValue(determinant)}</strong>
              <p className="linear-map-determinant-note">
                {determinantMeaning}
              </p>
            </article>
          </div>

          <section className="time-vector-phenomenon-note">
            <p className="time-vector-panel__label">Interpretation</p>
            <h3 className="time-vector-phenomenon-note__title">
              Memory（記憶）
              <span>Linear Transformation（線形写像）</span>
            </h3>
            <p>
              過去の記憶は、
              過去から未来へ続く一つの時間軸だけではなく、
              複数の異なる時間軸から生まれ、
              現在の時間状態に影響を与えているのかもしれません。
            </p>
            <p>
              本作品では、
              ひとつの時間状態が「記憶」という変換構造を通り、
              別の時間状態へ写される過程を、
              線形写像として表現しています。
            </p>
          </section>
        </aside>
      </section>
    </main>
  );
}
