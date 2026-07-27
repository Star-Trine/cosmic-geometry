// DensityParticles.jsx

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  attribute vec3 color;
  attribute float birth;

  uniform float uProgress;
  uniform float uPointSize;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    /*
      粒子の出現時刻 birth を少し過ぎるまで、
      透明度を0から1へ滑らかに変化させる。
    */
    vAlpha = smoothstep(
      birth,
      birth + 0.08,
      uProgress
    );

    vColor = color;

    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);

    gl_Position = projectionMatrix * viewPosition;

    /*
      カメラから遠い粒子を少し小さくする。
    */
    gl_PointSize = uPointSize * (5.0 / -viewPosition.z);
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    /*
      四角形として描画されるPointを、
      円形の粒子に切り抜く。
    */
    vec2 center = gl_PointCoord - vec2(0.5);
    float distanceFromCenter = length(center);

    if (distanceFromCenter > 0.5) {
      discard;
    }

    /*
      粒子の縁も滑らかに透明化する。
    */
    float softEdge = 1.0 - smoothstep(
      0.25,
      0.5,
      distanceFromCenter
    );

    gl_FragColor = vec4(
      vColor,
      vAlpha * softEdge
    );
  }
`;

const DensityParticles = ({
  active = false,
  particleCount = 10000,
  extent = 1.3,
  duration = 8,
  pointSize = 7,
  onComplete,
}) => {
  const materialRef = useRef();
  const progressRef = useRef(0);
  const completedRef = useRef(false);

  const geometry = useMemo(() => {
    const particleGeometry = new THREE.BufferGeometry();

    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const births = new Float32Array(particleCount);

    /*
      作品を再生するたびに変わる、
      グラデーション全体の基準色。
    */
    const baseHue = Math.random();

    /*
      各軸が色相へ与える影響もランダムにする。
      近い位置の粒子は似た色になり、
      空間全体では滑らかなグラデーションになる。
    */
    const hueDirection = {
      x: THREE.MathUtils.randFloat(-0.3, 0.3),
      y: THREE.MathUtils.randFloat(-0.3, 0.3),
      z: THREE.MathUtils.randFloat(-0.3, 0.3),
    };

    const temporaryColor = new THREE.Color();

    for (let index = 0; index < particleCount; index += 1) {
      const arrayIndex = index * 3;

      /*
        初期化時に一度だけ、
        テッセラクトの内部領域へ位置を生成する。
      */
      const x = THREE.MathUtils.randFloatSpread(extent * 2);
      const y = THREE.MathUtils.randFloatSpread(extent * 2);
      const z = THREE.MathUtils.randFloatSpread(extent * 2);

      positions[arrayIndex] = x;
      positions[arrayIndex + 1] = y;
      positions[arrayIndex + 2] = z;

      /*
        空間座標から色相を作り、
        少量の乱数を混ぜる。
      */
      const normalizedX = x / extent;
      const normalizedY = y / extent;
      const normalizedZ = z / extent;

      const colorNoise = THREE.MathUtils.randFloatSpread(0.08);

      let hue =
        baseHue +
        normalizedX * hueDirection.x +
        normalizedY * hueDirection.y +
        normalizedZ * hueDirection.z +
        colorNoise;

      /*
        色相を0〜1の範囲に収める。
      */
      hue = ((hue % 1) + 1) % 1;

      /*
        彩度と明度を高めに限定し、
        ランダムでも濁りにくくする。
      */
      const saturation = THREE.MathUtils.randFloat(0.82, 1.0);
      const lightness = THREE.MathUtils.randFloat(0.55, 0.7);

      temporaryColor.setHSL(hue, saturation, lightness);

      colors[arrayIndex] = temporaryColor.r;
      colors[arrayIndex + 1] = temporaryColor.g;
      colors[arrayIndex + 2] = temporaryColor.b;

      /*
        それぞれの粒子が出現する時点。
        0〜1の間で一度だけ決定する。
      */
      births[index] = Math.random();
    }

    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );

    particleGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(colors, 3)
    );

    particleGeometry.setAttribute(
      'birth',
      new THREE.BufferAttribute(births, 1)
    );

    particleGeometry.computeBoundingSphere();

    return particleGeometry;
  }, [particleCount, extent]);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  /*
    Densityが非アクティブになったら、
    次の再生に備えて進行度をリセットする。
  */
  useEffect(() => {
    if (!active) {
      progressRef.current = 0;
      completedRef.current = false;

      if (materialRef.current) {
        materialRef.current.uniforms.uProgress.value = 0;
      }
    }
  }, [active]);

  useFrame((_, delta) => {
    if (!active || !materialRef.current) {
      return;
    }

    progressRef.current = Math.min(
      progressRef.current + delta / duration,
      1
    );

    materialRef.current.uniforms.uProgress.value =
      progressRef.current;

    if (
      progressRef.current >= 1 &&
      !completedRef.current
    ) {
      completedRef.current = true;
      onComplete?.();
    }
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uProgress: { value: 0 },
          uPointSize: { value: pointSize },
        }}
      />
    </points>
  );
};

export default DensityParticles;