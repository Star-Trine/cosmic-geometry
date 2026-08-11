import { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { BlockMath } from 'react-katex';
import * as THREE from 'three';
import BackgroundTimeDirections from '../BackgroundTimeDirections';
import BasisAxes from '../BasisAxes';
import CoefficientSlider from '../CoefficientSlider';
import TimeParticles from '../TimeParticles';
import VectorArrow from '../VectorArrow';
import { COLORS } from '../constants';

const INITIAL_U = { u1: 1.4, u2: 0.8, u3: 0.4 };
const INITIAL_V = { v1: 0.3, v2: 1.3, v3: 0.9 };
const ZERO_THRESHOLD = 1e-10;

const VECTOR_COLORS = {
  u: COLORS.t1,
  v: COLORS.t3,
  crossProduct: COLORS.result,
};

function Parallelogram({ uVector, vVector }) {
  const geometry = useMemo(() => {
    const origin = new THREE.Vector3(0, 0, 0);
    const sum = uVector.clone().add(vVector);
    const positions = new Float32Array([
      ...origin.toArray(),
      ...uVector.toArray(),
      ...sum.toArray(),
      ...origin.toArray(),
      ...sum.toArray(),
      ...vVector.toArray(),
    ]);
    const parallelogramGeometry = new THREE.BufferGeometry();

    parallelogramGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
    parallelogramGeometry.computeVertexNormals();

    return parallelogramGeometry;
  }, [uVector, vVector]);

  return (
    <mesh geometry={geometry} renderOrder={-1}>
      <meshStandardMaterial
        color="#8f7cff"
        emissive="#5744b8"
        emissiveIntensity={0.35}
        opacity={0.2}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function CrossProductScene({
  uVector,
  vVector,
  crossProduct,
  showParallelogram,
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
      <BasisAxes />

      {showParallelogram && (
        <Parallelogram uVector={uVector} vVector={vVector} />
      )}

      <VectorArrow
        vector={uVector}
        color={VECTOR_COLORS.u}
        label="u"
        labelColor={VECTOR_COLORS.u}
      />
      <VectorArrow
        vector={vVector}
        color={VECTOR_COLORS.v}
        label="v"
        labelColor={VECTOR_COLORS.v}
      />
      <VectorArrow
        vector={crossProduct}
        color={VECTOR_COLORS.crossProduct}
        label="u × v"
        labelColor={VECTOR_COLORS.crossProduct}
        headLength={0.34}
        headWidth={0.19}
      />

      <gridHelper
        args={[12, 24, '#4c4a75', '#25263d']}
        position={[0, -0.03, 0]}
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

function VectorControlGroup({
  id,
  title,
  symbol,
  vector,
  keys,
  color,
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
        aria-controls={id}
        onClick={onToggle}
      >
        <span>{title}</span>
        <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
      </button>

      {isOpen && (
        <div id={id} className="time-vector-vector-group__body">
          <div className="time-vector-sliders">
            {keys.map((key, index) => (
              <CoefficientSlider
                key={key}
                id={`${id}-${key}`}
                label={`${symbol}_${index + 1}`}
                value={vector[key]}
                color={color}
                onChange={(value) => onChange(key, value)}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function formatValue(value) {
  return (Math.abs(value) < 0.005 ? 0 : value).toFixed(2);
}

export default function CrossProductMode({ navigation }) {
  const [u, setU] = useState(INITIAL_U);
  const [v, setV] = useState(INITIAL_V);
  const [isUOpen, setIsUOpen] = useState(true);
  const [isVOpen, setIsVOpen] = useState(true);
  const [showParallelogram, setShowParallelogram] = useState(true);

  const {
    uVector,
    vVector,
    crossProduct,
    crossMagnitude,
    angle,
  } = useMemo(() => {
    const nextUVector = new THREE.Vector3(u.u1, u.u2, u.u3);
    const nextVVector = new THREE.Vector3(v.v1, v.v2, v.v3);
    const crossX = u.u2 * v.v3 - u.u3 * v.v2;
    const crossY = u.u3 * v.v1 - u.u1 * v.v3;
    const crossZ = u.u1 * v.v2 - u.u2 * v.v1;
    const nextCrossProduct = new THREE.Vector3(crossX, crossY, crossZ);
    const nextCrossMagnitude = Math.sqrt(
      crossX ** 2 + crossY ** 2 + crossZ ** 2
    );
    const uLength = nextUVector.length();
    const vLength = nextVVector.length();
    const hasDefinedAngle =
      uLength > ZERO_THRESHOLD && vLength > ZERO_THRESHOLD;
    const cosine = hasDefinedAngle
      ? THREE.MathUtils.clamp(
          nextUVector.dot(nextVVector) / (uLength * vLength),
          -1,
          1
        )
      : null;
    const nextAngle =
      cosine === null
        ? null
        : THREE.MathUtils.radToDeg(Math.acos(cosine));

    return {
      uVector: nextUVector,
      vVector: nextVVector,
      crossProduct: nextCrossProduct,
      crossMagnitude: nextCrossMagnitude,
      angle: nextAngle,
    };
  }, [u, v]);

  const updateU = (key, value) => {
    setU((current) => ({ ...current, [key]: value }));
  };

  const updateV = (key, value) => {
    setV((current) => ({ ...current, [key]: value }));
  };

  const reset = () => {
    setU(INITIAL_U);
    setV(INITIAL_V);
    setIsUOpen(true);
    setIsVOpen(true);
    setShowParallelogram(true);
  };

  return (
    <main className="time-vector-work">
      <header className="time-vector-work__header">
        <div>
          <p className="time-vector-work__eyebrow">
            Time Geometry / Cross Product Mode
          </p>
          <h1>
            Cross Product
            <span>時間ベクトルの外積</span>
          </h1>
        </div>
        <div className="time-vector-work__header-actions">
          <a
            href="/concepts/time-vector-space"
            className="time-vector-work__concept-link"
          >
            Conceptを見る
          </a>
          <a
            href="/tech-notes/time-vector-space"
            className="time-vector-work__tech-note-link"
          >
            TechNoteを見る
          </a>
        </div>
      </header>

      {navigation}

      <section className="time-vector-interface">
        <aside className="time-vector-panel time-vector-controls">
          <p className="time-vector-panel__label">Control Panel</p>
          <h2>時間状態を操作する</h2>
          <p className="time-vector-panel__description">
            2つの時間状態ベクトルを動かし、そこから生まれる法線方向を観察します。
          </p>

          <div className="time-vector-vector-groups">
            <VectorControlGroup
              id="cross-product-vector-u"
              title="Vector u"
              symbol="u"
              vector={u}
              keys={['u1', 'u2', 'u3']}
              color={VECTOR_COLORS.u}
              isOpen={isUOpen}
              onToggle={() => setIsUOpen((current) => !current)}
              onChange={updateU}
            />
            <VectorControlGroup
              id="cross-product-vector-v"
              title="Vector v"
              symbol="v"
              vector={v}
              keys={['v1', 'v2', 'v3']}
              color={VECTOR_COLORS.v}
              isOpen={isVOpen}
              onToggle={() => setIsVOpen((current) => !current)}
              onChange={updateV}
            />
          </div>

          <label className="time-vector-toggle">
            <input
              type="checkbox"
              checked={showParallelogram}
              onChange={(event) =>
                setShowParallelogram(event.target.checked)
              }
            />
            <span className="time-vector-toggle__switch" aria-hidden="true" />
            <span>平行四辺形を表示</span>
          </label>

          <button
            type="button"
            className="time-vector-reset"
            onClick={reset}
          >
            Reset
          </button>
        </aside>

        <section className="time-vector-canvas" aria-label="外積の3D表示">
          <Canvas
            camera={{ position: [5.8, 4.5, 6.8], fov: 46 }}
            dpr={[1, 1.7]}
          >
            <CrossProductScene
              uVector={uVector}
              vVector={vVector}
              crossProduct={crossProduct}
              showParallelogram={showParallelogram}
            />
          </Canvas>
        </section>

        <aside className="time-vector-panel time-vector-results">
          <p className="time-vector-panel__label">Result Panel</p>
          <h2>外積と新しい方向</h2>

          <div className="time-vector-result-grid cross-product-results">
            <article className="time-vector-result-card time-vector-result-card--formula">
              <p className="time-vector-result-card__label">
                Cross Product（外積）
              </p>
              <div className="time-vector-formula">
                <BlockMath
                  math={
                    'u \\times v = (u_2v_3-u_3v_2,\\;u_3v_1-u_1v_3,\\;u_1v_2-u_2v_1)'
                  }
                />
                <BlockMath
                  math={`\\mathrm{Result}=(${formatValue(
                    crossProduct.x
                  )},\\;${formatValue(crossProduct.y)},\\;${formatValue(
                    crossProduct.z
                  )})`}
                />
              </div>
            </article>

            <article className="time-vector-result-card">
              <p className="time-vector-result-card__label">
                Magnitude（大きさ）
              </p>
              <strong>{formatValue(crossMagnitude)}</strong>
            </article>

            <article className="time-vector-result-card">
              <p className="time-vector-result-card__label">
                Parallelogram Area（平行四辺形の面積）
              </p>
              <strong>{formatValue(crossMagnitude)}</strong>
            </article>

            <article className="time-vector-result-card">
              <p className="time-vector-result-card__label">Angle（角度）</p>
              <strong>{angle === null ? '—' : `${angle.toFixed(1)}°`}</strong>
            </article>
          </div>

          <section className="time-vector-phenomenon-note">
            <p className="time-vector-panel__label">Interpretation</p>
            <h3 className="time-vector-phenomenon-note__title">
              Emergence（創発）
              <span>Cross Product（外積）</span>
            </h3>
            <p>
              ふたつの時間状態の関係から、
              そのどちらにも属さない
              新しい可能性の方向が立ち上がる状態です。
            </p>
            <p>
              本作品では、この新しい方向の出現を、
              二つの時間ベクトルの外積として表現しています。
            </p>
          </section>
        </aside>
      </section>
    </main>
  );
}
