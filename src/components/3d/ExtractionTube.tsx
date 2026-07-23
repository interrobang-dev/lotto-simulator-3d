import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { useLottoStore } from '../../store/useLottoStore';

interface ExtractionTubeProps {
  ballsRefMap: React.MutableRefObject<Record<number, any>>;
}

export const ExtractionTube: React.FC<ExtractionTubeProps> = ({ ballsRefMap }) => {
  const { status, activeExtractingBall, triggerExtractionByBallNumber, extractedBalls, bonusBall } = useLottoStore();
  const lastExtractedTime = useRef(0);
  const exitPoint = useRef(new THREE.Vector3(0, 2.85, 0)); // 아치 캡 내부 중심 위치

  useFrame(() => {
    if (status !== 'EXTRACTING' || activeExtractingBall !== null) return;

    const now = Date.now();
    if (now - lastExtractedTime.current < 3800) return;

    const extractedNumbers = [...extractedBalls.map((b) => b.number), bonusBall?.number].filter(Boolean) as number[];

    let closestBallNum: number | null = null;
    let minDistance = Infinity;

    Object.entries(ballsRefMap.current).forEach(([numStr, rigidBody]) => {
      const num = Number(numStr);
      if (extractedNumbers.includes(num) || !rigidBody) return;

      try {
        const translation = rigidBody.translation();
        const ballPos = new THREE.Vector3(translation.x, translation.y, translation.z);
        const distance = ballPos.distanceTo(exitPoint.current);

        if (distance < minDistance) {
          minDistance = distance;
          closestBallNum = num;
        }
      } catch (e) {
        // 물리 바인딩 방어
      }
    });

    if (closestBallNum !== null) {
      const success = triggerExtractionByBallNumber(closestBallNum);
      if (success) {
        lastExtractedTime.current = now;
      }
    }
  });

  return (
    <group position={[0, 2.85, 0]}>
      {/* ===== 비너스 정품 아치형 투명 캡 하우징 (Venus Arch Vault Cap) ===== */}
      <group>
        {/* 1. 상단 둥근 아치 돔 캡 (Arch Dome Top) */}
        <mesh position={[0, 0.25, 0]} rotation={[0, 0, 0]}>
          <sphereGeometry args={[0.38, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshPhysicalMaterial
            transparent
            opacity={0.45}
            transmission={0.92}
            roughness={0.05}
            ior={1.45}
            thickness={0.6}
            color="#ffffff"
            specularColor="#ffffff"
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* 2. 전면 아치 개포구 / 아치문 틀 리브 기둥 (Arch Gate Pillars - 이미지와 동일) */}
        {[-0.34, 0.34].map((xPos, idx) => (
          <group key={idx} position={[xPos, -0.05, 0]}>
            {/* 세로 아크릴 기둥 */}
            <mesh position={[0, 0.15, 0]}>
              <boxGeometry args={[0.08, 0.5, 0.5]} />
              <meshPhysicalMaterial
                transparent
                opacity={0.5}
                transmission={0.9}
                roughness={0.05}
                color="#e2e8f0"
              />
            </mesh>
          </group>
        ))}

        {/* 후면 아크릴 벽면 리브 */}
        <mesh position={[0, 0.1, -0.26]}>
          <boxGeometry args={[0.6, 0.5, 0.08]} />
          <meshPhysicalMaterial
            transparent
            opacity={0.5}
            transmission={0.9}
            roughness={0.05}
            color="#e2e8f0"
          />
        </mesh>

        {/* 3. 캡 상단 중앙 흡입 연결 튜브 링 (Top Suction Head) */}
        <mesh position={[0, 0.65, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.25, 32]} />
          <meshPhysicalMaterial
            transparent
            opacity={0.6}
            transmission={0.88}
            roughness={0.08}
            color="#ffffff"
          />
        </mesh>

        {/* 4. 아치 캡 하단 아크릴 베이스 테두리 링 */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.06, 32, 1, true]} />
          <meshPhysicalMaterial
            transparent
            opacity={0.6}
            transmission={0.85}
            roughness={0.1}
            color="#cbd5e1"
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* 물리 센서 콜라이더 */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[0.3, 0.2, 0.3]} position={[0, 0.1, 0]} sensor />
      </RigidBody>
    </group>
  );
};
