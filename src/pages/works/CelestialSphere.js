// CelestialSphere.js

import React, { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import './CelestialSphere.css';
import { stars } from './celestialSphere/starData';
import { asterisms } from'./celestialSphere/asterismData';

const SPHERE_RADIUS = 3;
const EARTH_RADIUS = 0.45;
const ECLIPTIC_TILT = THREE.MathUtils.degToRad(23.4);

function celestialToCartesian(raHours, decDegrees, radius = SPHERE_RADIUS) {
  const ra = THREE.MathUtils.degToRad(raHours * 15);
  const dec = THREE.MathUtils.degToRad(decDegrees);

  return [
    radius * Math.cos(dec) * Math.cos(ra),
    radius * Math.sin(dec),
    radius * Math.cos(dec) * Math.sin(ra),
  ];
}
function StarPoints() {
  const [hoveredStarId, setHoveredStarId] = useState(null);

  return (
    <group>
      {stars.map((star) => {
        const position = celestialToCartesian(
          star.ra,
          star.dec,
          SPHERE_RADIUS * 1.01
        );

        const size = Math.max(
          0.02,
          0.06 - star.magnitude * 0.01
        );

        const isHovered = hoveredStarId === star.id;

        return (
          <group
            key={star.id}
            position={position}
          >
            <mesh
              onPointerOver={(event) => {
                event.stopPropagation();
                setHoveredStarId(star.id);
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                setHoveredStarId(null);
                document.body.style.cursor = 'default';
              }}
            >
              <sphereGeometry args={[size, 16, 16]} />
              <meshBasicMaterial color={star.color ?? '#ffffff'} />
            </mesh>

            {isHovered && (
              <Text
                position={[0, size + 0.12, 0]}
                fontSize={0.16}
                color="#ffffff"
                anchorX="center"
                anchorY="bottom"
              >
                {star.nameJa}
              </Text>
            )}
          </group>
        );
      })}
    </group>
  );
}

function AsterismLines() {
  const lineSegments = useMemo(() => {
    const points = [];

    asterisms.forEach((asterism) => {
      asterism.connections.forEach(([startId, endId]) => {
        const startStar = stars.find((star) => star.id === startId);
        const endStar = stars.find((star) => star.id === endId);

        if (!startStar || !endStar) return;

        const startPosition = celestialToCartesian(
          startStar.ra,
          startStar.dec,
          SPHERE_RADIUS * 1.005
        );

        const endPosition = celestialToCartesian(
          endStar.ra,
          endStar.dec,
          SPHERE_RADIUS * 1.005
        );

        points.push(
          new THREE.Vector3(...startPosition),
          new THREE.Vector3(...endPosition)
        );
      });
    });

    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  return (
    <lineSegments geometry={lineSegments}>
      <lineBasicMaterial
        color="#88ccff"
        transparent
        opacity={0.75}
      />
    </lineSegments>
  );
}

// 3D空間に円周を描く
function CircleLine({
  radius = 3,
  color = '#ffffff',
  opacity = 1,
  rotation = [0, 0, 0],
  segments = 128,
}) {
  const geometry = useMemo(() => {
    const points = [];

    for (let i = 0; i <= segments; i += 1) {
      const angle = (i / segments) * Math.PI * 2;

      points.push(
        new THREE.Vector3(
          radius * Math.cos(angle),
          0,
          radius * Math.sin(angle)
        )
      );
    }

    return new THREE.BufferGeometry().setFromPoints(points);
  }, [radius, segments]);

  return (
    <line geometry={geometry} rotation={rotation}>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={opacity}
      />
    </line>
  );
}

// 中心の地球
function Earth() {
  return (
    <group rotation={[0, 0, ECLIPTIC_TILT]}>
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS, 48, 48]} />
        <meshStandardMaterial
          color="#2878d0"
          roughness={0.75}
          metalness={0.05}
        />
      </mesh>

      {/* 地球の赤道 */}
      <CircleLine
        radius={EARTH_RADIUS * 1.01}
        color="#8fe8ff"
        opacity={0.9}
      />

      {/* 地軸 */}
      <mesh>
        <cylinderGeometry args={[0.012, 0.012, 1.8, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

// 天球本体
function CelestialSphereModel() {
  return (
    <group>
      {/* 半透明の天球 */}
      <mesh>
        <sphereGeometry args={[SPHERE_RADIUS, 32, 24]} />
        <meshBasicMaterial
          color="#4ebcff"
          transparent
          opacity={0.055}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 外周を少し見やすくする球 */}
      {/* <mesh>
        <sphereGeometry args={[SPHERE_RADIUS, 32, 24]} />
        <meshBasicMaterial
          color="#65d5ff"
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh> 
      */}

      {/* 天の赤道 */}
      <CircleLine
        radius={SPHERE_RADIUS}
        color="#79e6ff"
        opacity={0.9}
      />

      {/* 黄道 */}
      <CircleLine
        radius={SPHERE_RADIUS * 1.002}
        color="#ffcc66"
        opacity={0.95}
        rotation={[ECLIPTIC_TILT, 0, 0]}
      />

      {/* 天の子午線 */}
      <CircleLine
        radius={SPHERE_RADIUS}
        color="#70a9ff"
        opacity={0.3}
        rotation={[Math.PI / 2, 0, 0]}
      />

      <CircleLine
        radius={SPHERE_RADIUS}
        color="#70a9ff"
        opacity={0.22}
        rotation={[Math.PI / 2, 0, Math.PI / 2]}
      />

      {/* 天の極を結ぶ軸 */}
      <mesh>
        <cylinderGeometry
          args={[0.018, 0.018, SPHERE_RADIUS * 2.35, 16]}
        />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.75}
        />
      </mesh>

      {/* 天の北極 */}
      <mesh position={[0, SPHERE_RADIUS, 0]}>
        <sphereGeometry args={[0.065, 24, 24]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* 天の南極 */}
      <mesh position={[0, -SPHERE_RADIUS, 0]}>
        <sphereGeometry args={[0.065, 24, 24]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* ラベル */}
      <Text
        position={[0, SPHERE_RADIUS + 0.28, 0]}
        fontSize={0.18}
        color="#ffffff"
        anchorX="center"
      >
        天の北極
      </Text>

      <Text
        position={[0, -SPHERE_RADIUS - 0.28, 0]}
        fontSize={0.18}
        color="#ffffff"
        anchorX="center"
      >
        天の南極
      </Text>

      <Text
        position={[SPHERE_RADIUS + 0.45, 0, 0]}
        fontSize={0.18}
        color="#79e6ff"
        anchorX="center"
      >
        天の赤道
      </Text>

      <Text
        position={[-SPHERE_RADIUS - 0.35, 0.65, 0]}
        fontSize={0.18}
        color="#ffcc66"
        anchorX="center"
      >
        黄道
      </Text>

      <StarPoints />  
      <AsterismLines />
      <Earth />
    </group>
  );
}

export default function CelestialSphere() {
  return (
    <div className="celestial-sphere">
      <h2>Celestial Sphere</h2>

      <div className="celestial-sphere-canvas">
        <Canvas
          camera={{
            position: [6.5, 4.5, 6.5],
            fov: 45,
          }}
        >
          <ambientLight intensity={1.1} />
          <directionalLight
            position={[5, 6, 5]}
            intensity={1.5}
          />

          <CelestialSphereModel />

          <OrbitControls
            enablePan={false}
            enableDamping
            dampingFactor={0.06}
            minDistance={1.2}
            maxDistance={16}
          />
        </Canvas>
      </div>

      <p>
        地球を中心に、天の赤道・黄道・天の極を外側から観察する天球モデル
      </p>
    </div>
  );
}