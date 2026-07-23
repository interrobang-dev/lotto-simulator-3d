import React from 'react';

export const SlideTrack: React.FC = () => {
  return (
    <group>
      {/* 하단 7개 공 전면 안착 거치대 트레이 하우징 */}
      <group position={[0, -1.9, 2.2]}>
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
      </group>
    </group>
  );
};
