import React from 'react';

export const SlideTrack: React.FC = () => {
  return (
    <group>
      {/* 하단 7개 공 전면 안착 거치대 트레이 하우징 */}
      <group position={[0, -2.2, 3.4]}>
        {/* 거치대 베이스 메탈 프레임 */}
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[4.4, 0.15, 0.8]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* 7개 공 홈 (6개 메인 + 1개 보너스) */}
        {Array.from({ length: 7 }).map((_, idx) => {
          const xPos = -1.8 + idx * 0.55;
          const isBonus = idx === 6;

          return (
            <group key={idx} position={[xPos, 0, 0]}>
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.26, 0.22, 0.1, 32]} />
                <meshStandardMaterial
                  color={isBonus ? '#eab308' : '#334155'}
                  metalness={0.8}
                  roughness={0.2}
                />
              </mesh>
            </group>
          );
        })}

        {/* 거치대 하단 지지 다리 (Leg Supports to Mixer Base Y: -3.7) */}
        {[-2.0, 2.0].map((xPos, idx) => (
          <group key={idx} position={[xPos, -0.75, 0]}>
            {/* 수직 지지 메탈 기둥 */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.08, 0.12, 1.4, 16]} />
              <meshStandardMaterial color="#1e293b" metalness={0.95} roughness={0.1} />
            </mesh>
            {/* 관절 메탈 링 포인트 */}
            <mesh position={[0, 0.65, 0]}>
              <cylinderGeometry args={[0.13, 0.13, 0.1, 16]} />
              <meshStandardMaterial color="#38bdf8" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* 바닥 접지 메탈 받침대 패드 (추첨기 바닥 Y: -3.7 수평 일치) */}
            <mesh position={[0, -0.7, 0]}>
              <cylinderGeometry args={[0.22, 0.28, 0.1, 32]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};
