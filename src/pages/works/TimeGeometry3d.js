import React, { useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import './TimeGeometry3d.css';

const arrowLength = 4; // ベクトルの長さを調整

function ArrowVector({ direction, color }) {
  const ref = useRef();
  const { scene } = useThree();

  useEffect(() => {
    const dir = new THREE.Vector3(...direction).normalize();
    const origin = new THREE.Vector3(0, 0, 0);
    const arrowHelper = new THREE.ArrowHelper(dir, origin, arrowLength, color);
    ref.current.add(arrowHelper);
  }, [direction, color]);

  return <group ref={ref} />;
}

function ResonanceSphere({ vecA, vecB, colorBase = 200 }) {
  const vA = new THREE.Vector3(...vecA).normalize();
  const vB = new THREE.Vector3(...vecB).normalize();
  const dot = vA.dot(vB);
  const intensity = Math.abs(dot);
  const mid = new THREE.Vector3().addVectors(vA, vB).normalize().multiplyScalar(arrowLength * 0.5);

  const color = new THREE.Color(`hsl(${colorBase}, 100%, ${intensity * 50 + 25}%)`);

  return (
    <mesh position={mid}>
      <sphereGeometry args={[0.1 + intensity * 0.2, 32, 32]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6 + intensity * 1} />
    </mesh>
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

export default function TimeGeometry3d() {
  return (
    <div className = "timegeometry3d-wrapper">
    <Canvas camera={{ position: [6, 6, 6], fov: 50 }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />

      {/* 時間ベクトル */}
      <ArrowVector direction={[1, 0, 0]} color={0x00ffff} />   {/* t1 */}
      <ArrowVector direction={[0, 1, 0]} color={0x800080} />   {/* t2 */}
      <ArrowVector direction={[0, 0, 1]} color={0xff69b4} />   {/* t3 */}

      {/* ラベル */}
      <VectorLabel position={[arrowLength, 0, 0]} label="t₁（現実時間）" />
      <VectorLabel position={[0, arrowLength, 0]} label="t₂（夢時間）" />
      <VectorLabel position={[0, 0, arrowLength]} label="t₃（祈り・想念時間）" />

      {/* 共鳴可視化（内積） */}
      <ResonanceSphere vecA={[1, 0, 0]} vecB={[0, 1, 0]} colorBase={30} />   {/* t1・t2 */}
      <ResonanceSphere vecA={[0, 1, 0]} vecB={[0, 0, 1]} colorBase={270} />  {/* t2・t3 */}
      <ResonanceSphere vecA={[1, 0, 0]} vecB={[0, 0, 1]} colorBase={120} />  {/* t1・t3 */}
    </Canvas>
    </div>
  );
}
