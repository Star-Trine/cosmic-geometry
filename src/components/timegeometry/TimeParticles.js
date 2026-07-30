import { useMemo } from 'react';

export default function TimeParticles() {
  const positions = useMemo(() => {
    const particleCount = 280;
    const values = new Float32Array(
      particleCount * 3
    );

    for (
      let index = 0;
      index < particleCount;
      index += 1
    ) {
      const radius = 4 + Math.random() * 7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(
        2 * Math.random() - 1
      );

      values[index * 3] =
        radius *
        Math.sin(phi) *
        Math.cos(theta);

      values[index * 3 + 1] =
        radius * Math.cos(phi);

      values[index * 3 + 2] =
        radius *
        Math.sin(phi) *
        Math.sin(theta);
    }

    return values;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>

      <pointsMaterial
        color="#cecaff"
        size={0.025}
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
