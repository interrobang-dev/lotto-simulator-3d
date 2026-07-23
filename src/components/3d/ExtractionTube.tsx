import React from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';

export const ExtractionTube: React.FC = () => {
  return (
    <group position={[0, 3.2, 0]}>
      {/* 상단 투명 진공 흡입 파이프 메쉬 */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 1.6, 32, 1, true]} />
        <meshPhysicalMaterial
          transparent
          opacity={0.5}
          transmission={0.8}
          roughness={0.1}
          color="#38bdf8"
        />
      </mesh>

      {/* 진공 흡입 튜브 센서 콜라이더 */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider
          args={[0.3, 0.2, 0.3]}
          position={[0, 0.2, 0]}
          sensor
        />
      </RigidBody>
    </group>
  );
};
