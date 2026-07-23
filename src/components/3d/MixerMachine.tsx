import React, { useMemo } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';

export const MixerMachine: React.FC = () => {
  const domeColliders = useMemo(() => {
    const colliders: { pos: [number, number, number]; rot: [number, number, number] }[] = [];
    const radius = 2.85;
    const latitudes = [-1.2, -0.6, 0, 0.6, 1.2];
    const longitudes = 12;

    latitudes.forEach((lat) => {
      const latRadius = radius * Math.cos(lat);
      const y = radius * Math.sin(lat);

      for (let i = 0; i < longitudes; i++) {
        const lng = (i * Math.PI * 2) / longitudes;
        const x = latRadius * Math.cos(lng);
        const z = latRadius * Math.sin(lng);

        const rotX = 0;
        const rotY = -lng + Math.PI / 2;
        const rotZ = lat;

        colliders.push({
          pos: [x, y, z],
          rot: [rotX, rotY, rotZ],
        });
      }
    });
    return colliders;
  }, []);

  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshPhysicalMaterial
          transparent
          opacity={0.35}
          transmission={0.92}
          roughness={0.05}
          ior={1.45}
          thickness={0.5}
          color="#bae6fd"
          specularColor="#ffffff"
        />
      </mesh>

      <mesh position={[0, -3.2, 0]}>
        <cylinderGeometry args={[2.2, 2.8, 1, 32]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
      </mesh>

      <group position={[0, -2.7, 0]}>
        {Array.from({ length: 8 }).map((_, idx) => {
          const angle = (idx * Math.PI) / 4;
          const r = 1.6;
          const x = Math.cos(angle) * r;
          const z = Math.sin(angle) * r;

          return (
            <mesh key={idx} position={[x, 0, z]} rotation={[0, -angle, Math.PI / 6]}>
              <cylinderGeometry args={[0.08, 0.12, 0.4, 16]} />
              <meshStandardMaterial color="#38bdf8" metalness={0.8} roughness={0.2} />
            </mesh>
          );
        })}
      </group>

      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[2.5, 0.2, 2.5]} position={[0, -2.85, 0]} restitution={0.85} />

        {domeColliders.map((c, idx) => (
          <CuboidCollider
            key={idx}
            args={[0.8, 0.8, 0.15]}
            position={c.pos}
            rotation={c.rot}
            restitution={0.85}
          />
        ))}

        <CuboidCollider args={[3, 0.2, 0.8]} position={[0, 2.9, 2]} restitution={0.85} />
        <CuboidCollider args={[3, 0.2, 0.8]} position={[0, 2.9, -2]} restitution={0.85} />
        <CuboidCollider args={[0.8, 0.2, 3]} position={[2, 2.9, 0]} restitution={0.85} />
        <CuboidCollider args={[0.8, 0.2, 3]} position={[-2, 2.9, 0]} restitution={0.85} />
      </RigidBody>
    </group>
  );
};
