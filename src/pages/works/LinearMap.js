import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import './LinearMap.css';

function Arrow({ from = [0, 0, 0], to = [0, 0, 0], color = 'blue', label }) {
  const dir = new THREE.Vector3(...to).sub(new THREE.Vector3(...from));
  const length = dir.length();
  const midPoint = new THREE.Vector3(...from).add(dir.clone().multiplyScalar(0.5));

  const axis = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, dir.clone().normalize());

  return (
    <group position={midPoint.toArray()} quaternion={quaternion}>
      <mesh>
        <cylinderGeometry args={[0.05, 0.05, length * 0.8, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, length * 0.4, 0]}>
        <coneGeometry args={[0.1, length * 0.2, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {label && (
        <Text
          position={[0, length * 0.6, 0]}
          fontSize={0.3}
          color={color}
          anchorX="center"
          anchorY="middle"
          rotation={[0, 0, 0]}
        >
          {label}
        </Text>
      )}
    </group>
  );
}

export default function LinearMap() {
  const transformMatrix = new THREE.Matrix3().set(
    2, 0, 0,
    0, 1, 0,
    0, 0, 1
  );

  const baseVector = new THREE.Vector3(1, 1, 0);
  const transformedVector = baseVector.clone().applyMatrix3(transformMatrix);

  return (
    <div className="linear-map-wrapper">
    <Canvas camera={{ position: [4, 4, 4], fov: 60 }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />
      <Arrow from={[0, 0, 0]} to={baseVector.toArray()} color="blue" label="v" />
      <Arrow from={[0, 0, 0]} to={transformedVector.toArray()} color="red" label="T(v)" />
    </Canvas>
    </div>
  );
}
