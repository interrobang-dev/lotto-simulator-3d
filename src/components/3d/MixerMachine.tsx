import React from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';

export const MixerMachine: React.FC = () => {
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshPhysicalMaterial
          transparent
          opacity={0.3}
          transmission={0.9}
          roughness={0.05}
          ior={1.4}
          thickness={0.5}
          color="#e0f2fe"
          specularColor="#ffffff"
        />
      </mesh>

      <mesh position={[0, -3.2, 0]}>
        <cylinderGeometry args={[2, 2.5, 1, 32]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
      </mesh>

      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[3, 0.2, 3]} position={[0, -2.8, 0]} restitution={0.8} />

        <CuboidCollider args={[0.2, 3, 3]} position={[3.1, 0, 0]} restitution={0.8} />
        <CuboidCollider args={[0.2, 3, 3]} position={[-3.1, 0, 0]} restitution={0.8} />
        <CuboidCollider args={[3, 3, 0.2]} position={[0, 0, 3.1]} restitution={0.8} />
        <CuboidCollider args={[3, 3, 0.2]} position={[0, 0, -3.1]} restitution={0.8} />

        <CuboidCollider args={[3, 0.2, 1]} position={[0, 3.1, 2]} restitution={0.8} />
        <CuboidCollider args={[3, 0.2, 1]} position={[0, 3.1, -2]} restitution={0.8} />
        <CuboidCollider args={[1, 0.2, 3]} position={[2, 3.1, 0]} restitution={0.8} />
        <CuboidCollider args={[1, 0.2, 3]} position={[-2, 3.1, 0]} restitution={0.8} />
      </RigidBody>
    </group>
  );
};
