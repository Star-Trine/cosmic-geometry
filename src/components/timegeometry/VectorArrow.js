import { useMemo } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export default function VectorArrow({
  vector,
  color,
  label,
  labelColor = color,
  opacity = 1,
  headLength = 0.28,
  headWidth = 0.15,
}) {
  const length = vector.length();

  const direction = useMemo(() => {
    if (length === 0) {
      return new THREE.Vector3(1, 0, 0);
    }

    return vector.clone().normalize();
  }, [vector, length]);

  const arrow = useMemo(() => {
    const safeLength = Math.max(length, 0.001);

    const helper = new THREE.ArrowHelper(
      direction,
      new THREE.Vector3(0, 0, 0),
      safeLength,
      color,
      Math.min(headLength, safeLength * 0.28),
      Math.min(headWidth, safeLength * 0.16)
    );

    helper.line.material.transparent = opacity < 1;
    helper.line.material.opacity = opacity;

    helper.cone.material.transparent = opacity < 1;
    helper.cone.material.opacity = opacity;

    return helper;
  }, [
    color,
    direction,
    headLength,
    headWidth,
    length,
    opacity,
  ]);

  const labelPosition = useMemo(() => {
    if (length === 0) {
      return new THREE.Vector3(0, 0, 0);
    }

    return vector
      .clone()
      .add(direction.clone().multiplyScalar(0.32));
  }, [direction, length, vector]);

  if (length < 0.001) {
    return null;
  }

  return (
    <group>
      <primitive object={arrow} />

      <mesh position={vector.toArray()}>
        <sphereGeometry args={[0.07, 20, 20]} />
        <meshBasicMaterial
          color={color}
          toneMapped={false}
        />
      </mesh>

      {label && (
        <Text
          position={labelPosition.toArray()}
          fontSize={0.22}
          color={labelColor}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.008}
          outlineColor="#050712"
        >
          {label}
        </Text>
      )}
    </group>
  );
}
