// TimeGeometryCross.jsx
import React, { useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import './InnerProduct.css'; // CSSは内積版と同じでもOK

const arrowLength = 4;

function ArrowVector({ direction, color }) {
  const ref = useRef();

  useEffect(() => {
    if (!ref.current) return;

    const dir = new THREE.Vector3(...direction).normalize();
    const origin = new THREE.Vector3(0, 0, 0);
    const arrowHelper = new THREE.ArrowHelper(dir, origin, arrowLength, color);

    ref.current.add(arrowHelper);

    return () => {
      if (ref.current) ref.current.remove(arrowHelper);
    };
  }, [direction, color]);

  return <group ref={ref} />;
}

function CrossProductVisualization({ vecA, vecB, baseHue = 200 }) {
  const vA = new THREE.Vector3(...vecA);
  const vB = new THREE.Vector3(...vecB);

  const cross = new THREE.Vector3().crossVectors(vA, vB);
  const length = cross.length();

  // 外積ベクトルの中間位置（矢印の途中に表示用）
  const midPoint = cross.clone().multiplyScalar(0.5);

  // 色はベース色相 + 外積の大きさに応じて明るさ調整
  const color = new THREE.Color(`hsl(${baseHue}, 100%, ${Math.min(length * 50 + 30, 80)}%)`);

  return (
    <>
      {/* 外積ベクトル矢印 */}
      <ArrowVector direction={[cross.x, cross.y, cross.z]} color={color} />

      {/* 外積ベクトルの大きさを表す球 */}
      <mesh position={midPoint}>
        <sphereGeometry args={[0.1 + length * 0.3, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} />
      </mesh>

      {/* ラベル：外積の大きさ */}
      <Text position={[midPoint.x, midPoint.y, midPoint.z]} fontSize={0.3} color="#fff" anchorX="center" anchorY="middle">
        {`|A×B| = ${length.toFixed(2)}`}
      </Text>
    </>
  );
}

function VectorLabel({ position, label }) {
  return (
    <Text
      position={position}
      fontSize={0.3}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
    >
      {label}
    </Text>
  );
}

export default function TimeGeometryCross() {
  return (
    <div className="inner-product-wrapper">
      <Canvas camera={{ position: [6, 6, 6], fov: 50 }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />

        {/* 時間ベクトル */}
        <ArrowVector direction={[1, 0, 0]} color={0x00ffff} />
        <ArrowVector direction={[0, 1, 0]} color={0x800080} />
        <ArrowVector direction={[0, 0, 1]} color={0xff69b4} />

        {/* ラベル */}
        <VectorLabel position={[arrowLength, 0, 0]} label="t₁（現実時間）" />
        <VectorLabel position={[0, arrowLength, 0]} label="t₂（夢時間）" />
        <VectorLabel position={[0, 0, arrowLength]} label="t₃（祈り・想念時間）" />

        {/* 外積ベクトルの可視化 */}
        <CrossProductVisualization vecA={[1, 0, 0]} vecB={[0, 1, 0]} baseHue={30} />
        <CrossProductVisualization vecA={[0, 1, 0]} vecB={[0, 0, 1]} baseHue={270} />
        <CrossProductVisualization vecA={[1, 0, 0]} vecB={[0, 0, 1]} baseHue={120} />
      </Canvas>
    </div>
  );
}
