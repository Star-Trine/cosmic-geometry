import { useMemo } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

import VectorArrow from './VectorArrow';
import { BASIS_LENGTH, COLORS } from './constants';

export default function BasisAxes() {
  const t1 = useMemo(
    () => new THREE.Vector3(BASIS_LENGTH, 0, 0),
    []
  );

  const t2 = useMemo(
    () => new THREE.Vector3(0, BASIS_LENGTH, 0),
    []
  );

  const t3 = useMemo(
    () => new THREE.Vector3(0, 0, BASIS_LENGTH),
    []
  );

  return (
    <group>
      <VectorArrow
        vector={t1}
        color={COLORS.t1}
        label="t₁"
        opacity={0.88}
      />

      <VectorArrow
        vector={t2}
        color={COLORS.t2}
        label="t₂"
        opacity={0.88}
      />

      <VectorArrow
        vector={t3}
        color={COLORS.t3}
        label="t₃"
        opacity={0.88}
      />

      <mesh>
        <sphereGeometry args={[0.1, 24, 24]} />
        <meshBasicMaterial
          color="#ffffff"
          toneMapped={false}
        />
      </mesh>

      <Text
        position={[-0.18, -0.2, 0]}
        fontSize={0.17}
        color="#b9c2df"
        anchorX="right"
        anchorY="top"
      >
        O
      </Text>
    </group>
  );
}
