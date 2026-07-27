// TesseractDensityParticles.jsx

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * XW平面上で4次元座標を回転させる
 */
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

/**
 * YW平面上で4次元座標を回転させる
 */
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

/**
 * ZW平面上で4次元座標を回転させる
 */
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
function project4Dto3D(
  [x, y, z, w],
  projectionDistance = 6
) {
  const denominator = projectionDistance - w;

  // 極端な拡大やゼロ除算を防ぐ
  const safeDenominator =
    Math.abs(denominator) < 0.001
      ? Math.sign(denominator || 1) * 0.001
      : denominator;

  const scale = projectionDistance / safeDenominator;

  return [
    x * scale,
    y * scale,
    z * scale,
  ];
}

/**
 * 4次元超立方体全体へ広がるように粒子を生成する
 */
function createParticles4D(
  count,
  size,
  spreadRatio = 0.6,
  spreadPower = 0.6
) {
  const halfSize = size / 2;

  const randomUniform = () =>
    THREE.MathUtils.randFloat(-halfSize, halfSize);

  /*
   * 中央にも粒子を残しながら、
   * 座標を外側へ連続的に偏らせる
   */
  const randomSpread = () => {
    const sign = Math.random() < 0.5 ? -1 : 1;
    const distance =
      halfSize * Math.pow(Math.random(), spreadPower);

    return sign * distance;
  };

  return Array.from({ length: count }, () => {
    const useSpreadDistribution =
      Math.random() < spreadRatio;

    const randomCoordinate = useSpreadDistribution
      ? randomSpread
      : randomUniform;

    return [
      randomCoordinate(),
      randomCoordinate(),
      randomCoordinate(),
      randomCoordinate(),
    ];
  });
}
export default function TesseractDensityParticles({
  active = true,
  particleCount = 4000,
  size = 2,
  pointSize = 0.025,
  opacity = 0.55,
  projectionDistance = 4,
  rotationSpeeds = {
    xw: 0.8,
    yw: 0.5,
    zw: 0.35,
  },
}) {
  const pointsRef = useRef();
  const positionAttributeRef = useRef();


  const { particles4D, positions, colors } = useMemo(() => {
  const particles = createParticles4D(particleCount, size);

  const positionsArray = new Float32Array(particleCount * 3);
  const colorsArray = new Float32Array(particleCount * 3);

  const baseHue = Math.random();

  const hueDirection = {
    x: THREE.MathUtils.randFloat(-0.3, 0.3),
    y: THREE.MathUtils.randFloat(-0.3, 0.3),
    z: THREE.MathUtils.randFloat(-0.3, 0.3),
    w: THREE.MathUtils.randFloat(-0.3, 0.3),
  };

  const temporaryColor = new THREE.Color();

  const halfSize = size / 2;

  particles.forEach(([x, y, z, w], index) => {
    const arrayIndex = index * 3;

    const normalizedX = x / halfSize;
    const normalizedY = y / halfSize;
    const normalizedZ = z / halfSize;
    const normalizedW = w / halfSize;

    const colorNoise = THREE.MathUtils.randFloatSpread(0.08);

    let hue =
      baseHue +
      normalizedX * hueDirection.x +
      normalizedY * hueDirection.y +
      normalizedZ * hueDirection.z +
      normalizedW * hueDirection.w +
      colorNoise;

    hue = ((hue % 1) + 1) % 1;

    const saturation = THREE.MathUtils.randFloat(0.95, 1.0);
    const lightness = THREE.MathUtils.randFloat(0.42, 0.58);

    temporaryColor.setHSL(
      hue,
      saturation,
      lightness
    );

    colorsArray[arrayIndex] = temporaryColor.r;
    colorsArray[arrayIndex + 1] = temporaryColor.g;
    colorsArray[arrayIndex + 2] = temporaryColor.b;
  });

  return {
    particles4D: particles,
    positions: positionsArray,
    colors: colorsArray,
  };

}, [particleCount, size]);

  useFrame(({ clock }) => {
    if (!active || !positionAttributeRef.current) {
      return;
    }

    const time = clock.getElapsedTime();

    const angleXW = time * rotationSpeeds.xw;
    const angleYW = time * rotationSpeeds.yw;
    const angleZW = time * rotationSpeeds.zw;

    particles4D.forEach((particle4D, index) => {
      let rotatedParticle = particle4D;

      rotatedParticle = rotateXW(
        rotatedParticle,
        angleXW
      );

      rotatedParticle = rotateYW(
        rotatedParticle,
        angleYW
      );

      rotatedParticle = rotateZW(
        rotatedParticle,
        angleZW
      );

      const [x, y, z] = project4Dto3D(
        rotatedParticle,
        projectionDistance
      );

      const positionIndex = index * 3;

      positions[positionIndex] = x;
      positions[positionIndex + 1] = y;
      positions[positionIndex + 2] = z;
    });

    positionAttributeRef.current.needsUpdate = true;

    /**
     * テッセラクト本体にも同様のgroup回転を
     * 設定している場合は、同じ値に合わせる。
     */
    if (pointsRef.current) {
      pointsRef.current.rotation.x = time * 0.05;
      pointsRef.current.rotation.y = time * 0.08;
    }
  });

  return (
    <points
      ref={pointsRef}
      visible={active}
      frustumCulled={false}
    >
      <bufferGeometry>
  <bufferAttribute
    ref={positionAttributeRef}
    attach="attributes-position"
    array={positions}
    count={positions.length / 3}
    itemSize={3}
  />

  <bufferAttribute
    attach="attributes-color"
    array={colors}
    count={colors.length / 3}
    itemSize={3}
  />
</bufferGeometry>
<pointsMaterial
  size={pointSize}
  vertexColors
  transparent
  opacity={opacity}
  blending={THREE.AdditiveBlending}
  depthWrite={false}
/>
</points>
  );
}
