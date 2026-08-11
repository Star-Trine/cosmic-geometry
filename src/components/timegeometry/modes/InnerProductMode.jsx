import { useLayoutEffect, useMemo, useRef, useState } from 'react';
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

const INITIAL_U = { u1: 1.4, u2: 1.1, u3: 0.8 };
const INITIAL_V = { v1: 0.8, v2: 1.5, v3: -0.4 };
const ZERO_THRESHOLD = 1e-10;

const VECTOR_COLORS = {
  u: COLORS.t1,
  v: COLORS.t3,
  projection: COLORS.result,
};

function ProjectionGuide({ start, end }) {
  const lineRef = useRef(null);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints([start, end]);
  }, [start, end]);

  useLayoutEffect(() => {
    lineRef.current?.computeLineDistances();
  }, [geometry]);

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineDashedMaterial
        color={VECTOR_COLORS.projection}
        dashSize={0.14}
        gapSize={0.09}
        opacity={0.72}
        transparent
      />
    </line>
  );
}

function InnerProductScene({ uVector, vVector, projection, showProjection }) {
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

      {showProjection && (
        <>
          <VectorArrow
            vector={projection}
            color={VECTOR_COLORS.projection}
            label="projᵤ(v)"
            labelColor={VECTOR_COLORS.projection}
            opacity={0.9}
          />
          <ProjectionGuide start={vVector} end={projection} />
        </>
      )}

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

export default function InnerProductMode({ navigation }) {
  const [u, setU] = useState(INITIAL_U);
  const [v, setV] = useState(INITIAL_V);
  const [isUOpen, setIsUOpen] = useState(true);
  const [isVOpen, setIsVOpen] = useState(true);
  const [showProjection, setShowProjection] = useState(true);

  const {
    uVector,
    vVector,
    dotProduct,
    cosineSimilarity,
    angle,
    projection,
  } = useMemo(() => {
    const nextUVector = new THREE.Vector3(u.u1, u.u2, u.u3);
    const nextVVector = new THREE.Vector3(v.v1, v.v2, v.v3);
    const nextDotProduct = nextUVector.dot(nextVVector);
    const uLength = nextUVector.length();
    const vLength = nextVVector.length();
    const hasDefinedAngle =
      uLength > ZERO_THRESHOLD && vLength > ZERO_THRESHOLD;
    const nextCosineSimilarity = hasDefinedAngle
      ? THREE.MathUtils.clamp(
          nextDotProduct / (uLength * vLength),
          -1,
          1
        )
      : null;
    const nextAngle =
      nextCosineSimilarity === null
        ? null
        : THREE.MathUtils.radToDeg(Math.acos(nextCosineSimilarity));
    const nextProjection =
      uLength > ZERO_THRESHOLD
        ? nextUVector
            .clone()
            .multiplyScalar(nextDotProduct / nextUVector.lengthSq())
        : new THREE.Vector3(0, 0, 0);

    return {
      uVector: nextUVector,
      vVector: nextVVector,
      dotProduct: nextDotProduct,
      cosineSimilarity: nextCosineSimilarity,
      angle: nextAngle,
      projection: nextProjection,
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
    setShowProjection(true);
  };

  return (
    <main className="time-vector-work">
      <header className="time-vector-work__header">
        <div>
          <p className="time-vector-work__eyebrow">
            Time Geometry / Inner Product Mode
          </p>
          <h1>
            Inner Product
            <span>時間ベクトルの内積</span>
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
            2つの時間状態ベクトルを動かし、方向的な重なりを観察します。
          </p>

          <div className="time-vector-vector-groups">
            <VectorControlGroup
              id="inner-product-vector-u"
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
              id="inner-product-vector-v"
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
              checked={showProjection}
              onChange={(event) => setShowProjection(event.target.checked)}
            />
            <span className="time-vector-toggle__switch" aria-hidden="true" />
            <span>投影ベクトルと投影補助線を表示</span>
          </label>

          <button
            type="button"
            className="time-vector-reset"
            onClick={reset}
          >
            Reset
          </button>
        </aside>

        <section className="time-vector-canvas" aria-label="内積の3D表示">
          <Canvas
            camera={{ position: [5.8, 4.5, 6.8], fov: 46 }}
            dpr={[1, 1.7]}
          >
            <InnerProductScene
              uVector={uVector}
              vVector={vVector}
              projection={projection}
              showProjection={showProjection}
            />
          </Canvas>
        </section>

        <aside className="time-vector-panel time-vector-results">
          <p className="time-vector-panel__label">Result Panel</p>
          <h2>内積と方向の一致</h2>

          <div className="time-vector-result-grid inner-product-results">
            <article className="time-vector-result-card time-vector-result-card--formula">
              <p className="time-vector-result-card__label">Dot Product(内積)</p>
              <div className="time-vector-formula">
                <BlockMath
                  math={`u \\cdot v = u_1v_1 + u_2v_2 + u_3v_3 = ${dotProduct.toFixed(
                    2
                  )}`}
                />
              </div>
            </article>

            <article className="time-vector-result-card">
              <p className="time-vector-result-card__label">Angle(角度)</p>
              <strong>{angle === null ? '—' : `${angle.toFixed(1)}°`}</strong>
            </article>

            <article className="time-vector-result-card">
              <p className="time-vector-result-card__label">
                Cosine Similarity(コサイン類似度)
              </p>
              <strong>
                {cosineSimilarity === null
                  ? '—'
                  : cosineSimilarity.toFixed(3)}
              </strong>
            </article>
          </div>

          <section className="time-vector-phenomenon-note">
            <p className="time-vector-panel__label">Interpretation</p>
            <h3 className="time-vector-phenomenon-note__title">
              Déjà Vu（既視感）
              <span>Inner Product（内積）</span>
            </h3>
            <p>
              異なる時間状態のあいだに方向的な重なりがあるとき、
              別の時間に属する感覚が、現在の経験へ
              影のように現れることがあります。
            </p>
            <p>
              本作品では、その重なりを
              複数の時間状態の内積として捉えています。
            </p>
          </section>
        </aside>
      </section>
    </main>
  );
}
