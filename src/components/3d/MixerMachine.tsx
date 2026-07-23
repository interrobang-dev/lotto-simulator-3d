import React from 'react';
import { RigidBody, MeshCollider, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';

export const MixerMachine: React.FC = () => {
  return (
    <group>
      {/* 비너스 구형 투명 아크릴 챔버 메쉬 */}
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
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 챔버 하단 크롬 메탈 받침대 메쉬 */}
      <mesh position={[0, -3.2, 0]}>
        <cylinderGeometry args={[2.2, 2.8, 1, 32]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* 8방향 방사형 회오리 제트 노즐 메쉬 */}
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

      {/* 수학적으로 완전 밀폐된 내벽 구형 물리 콜라이더 (trimesh MeshCollider) */}
      <RigidBody type="fixed" colliders={false}>
        {/* 구형 내벽 충돌체 (반지름 2.82m) */}
        <MeshCollider type="trimesh">
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[2.82, 32, 32]} />
            <meshBasicMaterial visible={false} side={THREE.BackSide} />
          </mesh>
        </MeshCollider>

        {/* 하단 바닥 보강 콜라이더 */}
        <CuboidCollider args={[2.5, 0.2, 2.5]} position={[0, -2.75, 0]} restitution={0.8} />
      </RigidBody>
    </group>
  );
};
