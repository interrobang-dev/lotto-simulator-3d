import React from 'react';
import * as THREE from 'three';

export const LoadingRack: React.FC = () => {
  return (
    <group position={[0, 4.5, -0.5]}>
      {/* 상단 투명 S자 랙 트랙 아크릴 가이드 파이프 3D 메쉬 */}
      <mesh rotation={[0, 0, Math.PI / 8]}>
        <cylinderGeometry args={[0.26, 0.26, 7.5, 32, 1, true]} />
        <meshPhysicalMaterial
          transparent
          opacity={0.4}
          transmission={0.85}
          roughness={0.05}
          color="#38bdf8"
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 상단 랙 고정 금속 브래킷 하우징 */}
      <mesh position={[0, 3.6, 0]}>
        <boxGeometry args={[4, 0.2, 0.5]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};
