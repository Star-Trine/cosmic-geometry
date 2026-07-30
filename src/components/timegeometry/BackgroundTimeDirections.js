import { useMemo } from 'react';
import * as THREE from 'three';

export default function BackgroundTimeDirections() {
  const positions = useMemo(() => {
    const values = [];
    const lineCount = 34;

    for (let index = 0; index < lineCount; index += 1) {
      const theta = (index / lineCount) * Math.PI * 2;
      const phi =
        Math.acos(
          1 - (2 * (index + 0.5)) / lineCount
        );

      const direction = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta)
      );

      const startDistance = 3.9;
      const endDistance =
        5.8 + (index % 5) * 0.45;

      const start = direction
        .clone()
        .multiplyScalar(startDistance);

      const end = direction
        .clone()
        .multiplyScalar(endDistance);

      values.push(
        start.x,
        start.y,
        start.z,
        end.x,
        end.y,
        end.z
      );
    }

    return new Float32Array(values);
  }, []);

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>

      <lineBasicMaterial
        color="#8179c9"
        transparent
        opacity={0.13}
        depthWrite={false}
      />
    </lineSegments>
  );
}
