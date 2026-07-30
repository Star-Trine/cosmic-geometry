import { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { BlockMath, InlineMath } from 'react-katex';
import * as THREE from 'three';

import BackgroundTimeDirections from '../BackgroundTimeDirections';
import BasisAxes from '../BasisAxes';
import CoefficientSlider from '../CoefficientSlider';
import TimeParticles from '../TimeParticles';
import VectorArrow from '../VectorArrow';
import { COLORS } from '../constants';

const INITIAL_COEFFICIENTS = {
  a1: 1.4,
  a2: 1.1,
  a3: 0.8,
};

function ComponentGuide({
  start,
  end,
  color,
}) {
  const points = useMemo(
    () => [start, end],
    [start, end]
  );

  const geometry = useMemo(
    () =>
      new THREE.BufferGeometry().setFromPoints(
        points
      ),
    [points]
  );

  return (
    <line geometry={geometry}>
      <lineDashedMaterial
        color={color}
        transparent
        opacity={0.34}
        dashSize={0.12}
        gapSize={0.09}
      />
    </line>
  );
}

/**
 * 線形結合の成分を補助線で表示する。
 */
function LinearCombinationGuides({
  a1,
  a2,
  a3,
}) {
  const p0 = useMemo(
    () => new THREE.Vector3(0, 0, 0),
    []
  );

  const p1 = useMemo(
    () => new THREE.Vector3(a1, 0, 0),
    [a1]
  );

  const p2 = useMemo(
    () => new THREE.Vector3(a1, a2, 0),
    [a1, a2]
  );

  const p3 = useMemo(
    () => new THREE.Vector3(a1, a2, a3),
    [a1, a2, a3]
  );

  return (
    <group>
      <ComponentGuide
        start={p0}
        end={p1}
        color={COLORS.t1}
      />

      <ComponentGuide
        start={p1}
        end={p2}
        color={COLORS.t2}
      />

      <ComponentGuide
        start={p2}
        end={p3}
        color={COLORS.t3}
      />
    </group>
  );
}

function BasisScene({
  coefficients,
  showGuides,
}) {
  const stateVector = useMemo(
    () =>
      new THREE.Vector3(
        coefficients.a1,
        coefficients.a2,
        coefficients.a3
      ),
    [coefficients]
  );

  return (
    <>
      <color attach="background" args={['#030510']} />

      <fog
        attach="fog"
        args={['#030510', 8, 18]}
      />

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

      {showGuides && (
        <LinearCombinationGuides
          a1={coefficients.a1}
          a2={coefficients.a2}
          a3={coefficients.a3}
        />
      )}

      <VectorArrow
        vector={stateVector}
        color={COLORS.state}
        label="u"
        labelColor={COLORS.result}
        headLength={0.34}
        headWidth={0.19}
      />

      <mesh position={stateVector.toArray()}>
        <sphereGeometry args={[0.14, 30, 30]} />
        <meshStandardMaterial
          color="#fff4cf"
          emissive="#ffd986"
          emissiveIntensity={2.1}
          roughness={0.22}
          metalness={0.1}
        />
      </mesh>

      <gridHelper
        args={[
          12,
          24,
          '#4c4a75',
          '#25263d',
        ]}
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

export default function BasisMode({ navigation }) {
  const [coefficients, setCoefficients] =
    useState(INITIAL_COEFFICIENTS);

  const [showGuides, setShowGuides] =
    useState(true);

  const vectorLength = useMemo(() => {
    const { a1, a2, a3 } = coefficients;

    return Math.sqrt(
      a1 ** 2 + a2 ** 2 + a3 ** 2
    );
  }, [coefficients]);

  const updateCoefficient = (key, value) => {
    setCoefficients((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const resetBasis = () => {
    setCoefficients(INITIAL_COEFFICIENTS);
    setShowGuides(true);
  };

  return (
    <main className="time-vector-work">
      <header className="time-vector-work__header">
        <div>
          <p className="time-vector-work__eyebrow">
            Time Geometry / Basis Mode
          </p>

          <h1>
            Time Vector Space
            <span>時間ベクトル空間</span>
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
          <div className="time-vector-panel__heading">
            <p>Control Panel</p>
            <h2>状態ベクトルを構成する</h2>
          </div>

          <div className="time-vector-explanation">
            <p>
              三つの時間軸の係数を変更し、
              一つの時間状態ベクトル
              <InlineMath math="\mathbf{u}" />
              を作ります。
            </p>
          </div>

          <div className="time-vector-sliders">
            <CoefficientSlider
              id="coefficient-a1"
              label="a_1"
              value={coefficients.a1}
              color={COLORS.t1}
              onChange={(value) =>
                updateCoefficient('a1', value)
              }
            />

            <CoefficientSlider
              id="coefficient-a2"
              label="a_2"
              value={coefficients.a2}
              color={COLORS.t2}
              onChange={(value) =>
                updateCoefficient('a2', value)
              }
            />

            <CoefficientSlider
              id="coefficient-a3"
              label="a_3"
              value={coefficients.a3}
              color={COLORS.t3}
              onChange={(value) =>
                updateCoefficient('a3', value)
              }
            />
          </div>

          <label className="time-vector-toggle">
            <input
              type="checkbox"
              checked={showGuides}
              onChange={(event) =>
                setShowGuides(
                  event.target.checked
                )
              }
            />

            <span className="time-vector-toggle__switch" />

            <span>
              成分の補助線を表示
            </span>
          </label>

          <button
            type="button"
            className="time-vector-reset"
            onClick={resetBasis}
          >
            Reset（初期状態に戻す）
          </button>
        </aside>

        <div className="time-vector-canvas">
          <Canvas
            camera={{
              position: [5.8, 4.5, 6.8],
              fov: 46,
            }}
            dpr={[1, 1.7]}
          >
            <BasisScene
              coefficients={coefficients}
              showGuides={showGuides}
            />
          </Canvas>

          <div className="time-vector-canvas__note">
            異なるパラレルワールドの時間軸
            t₁〜t₃
          </div>

          <div className="time-vector-canvas__observer">
            Observer View
            <span>時間軸の外側から観測する視点</span>
          </div>
        </div>

        <aside className="time-vector-panel time-vector-results">
          <div className="time-vector-panel__heading">
            <p>Result Panel</p>
            <h2>現在の時間状態</h2>
          </div>

          <div className="time-vector-result-card time-vector-result-card--formula">
            <p className="time-vector-result-card__label">
              Linear Combination
              <span>線形結合</span>
            </p>

            <div className="time-vector-formula">
              <BlockMath
                math={String.raw`
                  \mathbf{u}
                  =
                  ${coefficients.a1.toFixed(1)}
                  \mathbf{t}_1
                  +
                  ${coefficients.a2.toFixed(1)}
                  \mathbf{t}_2
                  +
                  ${coefficients.a3.toFixed(1)}
                  \mathbf{t}_3
                `}
              />
            </div>
          </div>

          <div className="time-vector-result-grid">
            <div className="time-vector-result-card">
              <p className="time-vector-result-card__label">
                Coordinates
                <span>座標</span>
              </p>

              <strong>
                (
                {coefficients.a1.toFixed(1)},
                {' '}
                {coefficients.a2.toFixed(1)},
                {' '}
                {coefficients.a3.toFixed(1)}
                )
              </strong>
            </div>

            <div className="time-vector-result-card">
              <p className="time-vector-result-card__label">
                Magnitude
                <span>大きさ</span>
              </p>

              <strong>
                {vectorLength.toFixed(2)}
              </strong>
            </div>
          </div>

          <div className="time-vector-interpretation">
  <p className="time-vector-result-card__label">
    Interpretation
    <span>時間幾何学的な解釈</span>
  </p>

  <p>
    複数の時間成分が重なり、
    一つの時間状態として
    空間内に現れています。
  </p>

  <p>
    係数を変化させることで、
    状態がどの時間方向を
    強く含むかが変わります。
  </p>

  <div className="time-vector-phenomenon-note">
    <p className="time-vector-phenomenon-note__title">
      Dream（夢）
      <span>Linear Combination（線形結合）</span>
    </p>

    <p>
      夢の中では、本来は異なる時間に属する
      人物、場所、記憶が、一つの体験として
      混ざり合うことがあります。
    </p>

    <p>
      本作品では、その状態を複数の時間成分が
      線形結合されたものとして捉えています。
    </p>
  </div>
</div>
        </aside>
        </section>
    </main>
  );
}
