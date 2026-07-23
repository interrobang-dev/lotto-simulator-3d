import React from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';

export const MixerMachine: React.FC = () => {
  // 12방향 챔버 둘레 각도 계산 (구형 챔버 밀폐 벽면)
  const wallCount = 12;
  const radius = 2.85;

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

      {/* 챔버 내부 완전 밀폐 물리 콜라이더 하우징 */}
      <RigidBody type="fixed" colliders={false}>
        {/* 하단 오목 바닥 콜라이더 */}
        <CuboidCollider args={[3, 0.2, 3]} position={[0, -2.85, 0]} restitution={0.85} />
        <CuboidCollider args={[2, 0.2, 2]} position={[0, -2.5, 0]} restitution={0.85} />

        {/* 12방향 360도 촘촘한 원형 아크릴 벽면 콜라이더 (대각선 틈새 100% 차단) */}
        {Array.from({ length: wallCount }).map((_, idx) => {
          const angle = (idx * Math.PI * 2) / wallCount;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;

          return (
            <CuboidCollider
              key={idx}
              args={[0.8, 3, 0.2]}
              position={[x, 0, z]}
              rotation={[0, -angle + Math.PI / 2, 0]}
              restitution={0.85}
            />
          );
        })}

        {/* 상단 캡 밀폐 콜라이더 (추출구 구멍 제외 부분 차단) */}
        <CuboidCollider args={[3, 0.2, 0.8]} position={[0, 2.9, 2]} restitution={0.85} />
        <CuboidCollider args={[3, 0.2, 0.8]} position={[0, 2.9, -2]} restitution={0.85} />
        <CuboidCollider args={[0.8, 0.2, 3]} position={[2, 2.9, 0]} restitution={0.85} />
        <CuboidCollider args={[0.8, 0.2, 3]} position={[-2, 2.9, 0]} restitution={0.85} />
      </RigidBody>
    </group>
  );
};
