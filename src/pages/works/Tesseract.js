import { useMemo, useRef, useState, } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import TesseractDensityParticles from '../../components/TesseractDensityParticles';
import './Tesseract.css';

/**
 * 0〜1の値を滑らかに変化させる
 */
function smoothstep(value) {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}
/**xw回転関数**/
function rotateXW([x, y, z, w], angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  return [
    x * cos - w * sin,
    y,
    z,
    x * sin + w * cos,
  ];
}
/**yw回転関数**/
function rotateYW([x, y, z, w], angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  return [
    x,
    y * cos - w * sin,
    z,
    y * sin + w * cos,
  ];
}

/**zw回転関数**/
function rotateZW([x, y, z, w], angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  return [
    x,
    y,
    z * cos - w * sin,
    z * sin + w * cos,
  ];
}

/**
 * 4次元座標を3次元へ透視投影する
 */
function project4Dto3D([x, y, z, w]) {
  const projectionDistance = 4;
  const scale = projectionDistance / (projectionDistance - w);

  return [
    x * scale,
    y * scale,
    z * scale,
  ];
}

/**
 * 16個の頂点を生成する
 *
 * 各頂点は
 * [x, y, z, w]
 * の4次元座標を持つ。
 */
function createVertices4D() {
  const vertices = [];

  for (let index = 0; index < 16; index += 1) {
    vertices.push([
      index & 1 ? 1 : -1,
      index & 2 ? 1 : -1,
      index & 4 ? 1 : -1,
      index & 8 ? 1 : -1,
    ]);
  }

  return vertices;
}

/**
 * 32本の辺を生成する
 *
 * 4つの座標のうち、
 * 1つだけ異なる頂点同士を結ぶ。
 */
function createEdges(vertices) {
  const edges = [];

  for (let i = 0; i < vertices.length; i += 1) {
    for (let j = i + 1; j < vertices.length; j += 1) {
      let differences = 0;

      for (let axis = 0; axis < 4; axis += 1) {
        if (vertices[i][axis] !== vertices[j][axis]) {
          differences += 1;
        }
      }

      if (differences === 1) {
        edges.push([i, j]);
      }
    }
  }

  return edges;
}

/**
 * 0D → 1D → 2D → 3D → 4D
 * を描画する本体
 */
function DimensionModel({ onStageChange }) {
  const groupRef = useRef();
  const pointAttributeRef = useRef();
  const edgeAttributeRef = useRef();
  const previousLabelRef = useRef('');

  const vertices4D = useMemo(() => createVertices4D(), []);
  const edges = useMemo(() => createEdges(vertices4D), [vertices4D]);

  const pointPositions = useMemo(
    () => new Float32Array(vertices4D.length * 3),
    [vertices4D]
  );

  const edgePositions = useMemo(
    () => new Float32Array(edges.length * 2 * 3),
    [edges]
  );

  useFrame(({ clock }) => {
    /*
     * 1段階の時間
     *
     * 3秒：図形が伸びる
     * 1.5秒：完成状態を見せる
     */
    const movementDuration = 3;
    const holdDuration = 1.5;
    const stepDuration = movementDuration + holdDuration;

    /*
     * 最後の4次元状態を少し長めに表示
     */
    const finalHoldDuration = 4;
    const cycleDuration = stepDuration * 4 + finalHoldDuration;

    const elapsed = clock.getElapsedTime() % cycleDuration;

    /*
     * 現在どの次元を生成しているか
     *
     * 0 = x軸を伸ばす
     * 1 = y軸を伸ばす
     * 2 = z軸を伸ばす
     * 3 = w軸を伸ばす
     * 4 = テッセラクト完成
     */
    const currentStep = Math.min(
      Math.floor(elapsed / stepDuration),
      4
    );

    const localTime = elapsed - currentStep * stepDuration;

    /*
     * x, y, z, w方向の広がり
     */
    const axisScales = [0, 0, 0, 0];

    for (let axis = 0; axis < 4; axis += 1) {
      if (axis < currentStep) {
        axisScales[axis] = 1;
      } else if (axis === currentStep && currentStep < 4) {
        axisScales[axis] = smoothstep(
          localTime / movementDuration
        );
      }
    }

    const labels = [
      '0次元の点 → 1次元の線',
      '1次元の線 → 2次元の正方形',
      '2次元の正方形 → 3次元の立方体',
      '3次元の立方体 → 4次元のテッセラクト',
      '4次元テッセラクトの3次元投影',
    ];

    const nextLabel = labels[currentStep];

    /*
     * ラベルが変化したときだけReactのstateを更新
     */
    if (previousLabelRef.current !== nextLabel) {
      previousLabelRef.current = nextLabel;
      onStageChange(nextLabel);
    }

    /*
     * 16頂点の現在位置を計算
     */
   const projectedVertices = vertices4D.map((vertex) => {
  const scaledVertex = vertex.map(
    (coordinate, axis) =>
      coordinate * axisScales[axis] * 1.15
  );

  let rotatedVertex = scaledVertex;

  // X-W回転
  rotatedVertex = rotateXW(
    rotatedVertex,
    clock.getElapsedTime() * 0.8
  );

  // Y-W回転
  rotatedVertex = rotateYW(
    rotatedVertex,
    clock.getElapsedTime() * 0.5
  );

  //Z-W回転
  rotatedVertex = rotateZW(
  rotatedVertex,
  clock.getElapsedTime() * 0.35
);

  return project4Dto3D(rotatedVertex);
});

    /*
     * 頂点のBufferGeometryを更新
     */
    projectedVertices.forEach((vertex, index) => {
      const positionIndex = index * 3;

      pointPositions[positionIndex] = vertex[0];
      pointPositions[positionIndex + 1] = vertex[1];
      pointPositions[positionIndex + 2] = vertex[2];
    });

    pointAttributeRef.current.needsUpdate = true;

    /*
     * 辺のBufferGeometryを更新
     */
    edges.forEach(([startIndex, endIndex], edgeIndex) => {
      const start = projectedVertices[startIndex];
      const end = projectedVertices[endIndex];

      const positionIndex = edgeIndex * 6;

      edgePositions[positionIndex] = start[0];
      edgePositions[positionIndex + 1] = start[1];
      edgePositions[positionIndex + 2] = start[2];

      edgePositions[positionIndex + 3] = end[0];
      edgePositions[positionIndex + 4] = end[1];
      edgePositions[positionIndex + 5] = end[2];
    });

    edgeAttributeRef.current.needsUpdate = true;

    /*
     * 立方体以降は、全体をわずかに回転させる
     */
    if (groupRef.current) {
      const cubeProgress = axisScales[2];

      groupRef.current.rotation.x =
        0.35 * cubeProgress;

      groupRef.current.rotation.y =
        0.45 * cubeProgress +
        clock.getElapsedTime() * 0.08 * cubeProgress;
    }
  });

  
  return (
    <group ref={groupRef}>
      {/* 32本の辺 */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            ref={edgeAttributeRef}
            attach="attributes-position"
            args={[edgePositions, 3]}
          />
        </bufferGeometry>

        <lineBasicMaterial
          color="#b7a7ff"
          transparent
          opacity={0.85}
        />
      </lineSegments>

      {/* 16個の頂点 */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            ref={pointAttributeRef}
            attach="attributes-position"
            args={[pointPositions, 3]}
          />
        </bufferGeometry>

        <pointsMaterial
          color="#ffffff"
          size={0.09}
          sizeAttenuation
          transparent
          opacity={0.95}
        />
      </points>
    </group>
  );
}

export default function Tesseract() {
  const [stageLabel, setStageLabel] = useState(false);
  const [densityActive, setDensityActive] = useState(false);

  const handleStageChange = (stage) => {
  console.log(stage);
  setStageLabel(stage);

  setDensityActive(
    stage === '4次元テッセラクトの3次元投影'
  );
};
  return (
    <main className="tesseract">
      <header className="tesseract__header">
        <p className="tesseract__eyebrow">
          Generation of Dimensions
        </p>

        <h1>テッセラクト（4次元密度可視化）</h1>

        <p className="tesseract__description">
          前の次元の図形を複製し、新しい軸方向へ移動させ、
          対応する頂点同士を結ぶことで次元を生成します。
        </p>
      </header>

      <section className="tesseract__viewer">
        <div className="tesseract__stage-label">
          {stageLabel}
        </div>

        <Canvas
          camera={{
            position: [0, 0, 5.5],
            fov: 45,
          }}
          gl={{
            alpha: true,
            antialias: true,
          }}
        >
          <DimensionModel onStageChange={handleStageChange} />
          
          <OrbitControls
            enableDamping
            dampingFactor={0.08}
            minDistance={3}
            maxDistance={9}
          />
    {densityActive && (
  <TesseractDensityParticles
    active={densityActive}
    particleCount={5000}
    size={2}
    pointSize={0.05}
    opacity={0.35}
    projectionDistance={4}
    rotationSpeeds={{
      xw: 0.8,
      yw: 0.5,
      zw: 0.35,
    }}
  />
)}
          
        
        </Canvas>
      </section>

      <section className="tesseract__information">
        <div>
          <span>0D</span>
          <strong>1</strong>
          <p>点</p>
        </div>

        <div>
          <span>1D</span>
          <strong>2 / 1</strong>
          <p>頂点 / 辺</p>
        </div>

        <div>
          <span>2D</span>
          <strong>4 / 4 / 1</strong>
          <p>頂点 / 辺 / 面</p>
        </div>

        <div>
          <span>3D</span>
          <strong>8 / 12 / 6</strong>
          <p>頂点 / 辺 / 面</p>
        </div>

        <div>
          <span>4D</span>
          <strong>16 / 32 / 24 / 8</strong>
          <p>頂点 / 辺 / 面 / 立方体</p>
        </div>
      </section>
    </main>
  );
}