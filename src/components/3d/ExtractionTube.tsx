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
  const exitPoint = useRef(new THREE.Vector3(0, 3.0, 0)); // 구 상단 출구 좌표

  useFrame(() => {
    // EXTRACTING 상태이고 현재 슬라이드 이송 중인 공이 없을 때만 4초 간격으로 최단거리 공 탐지
    if (status !== 'EXTRACTING' || activeExtractingBall !== null) return;

    const now = Date.now();
    if (now - lastExtractedTime.current < 4000) return; // 4초 인터벌

    const extractedNumbers = [...extractedBalls.map((b) => b.number), bonusBall?.number].filter(Boolean) as number[];

    let closestBallNum: number | null = null;
    let minDistance = Infinity;

    // 1~45번 물리 공 중 미추출 공들의 실시간 3D 위치와 천장 출구(0, 3.0, 0) 간의 거리 계산
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
        // 물리 바인딩 예외 방어
      }
    });

    // 천장 출구와 가장 가까운 실제 물리 공 추출 트리거
    if (closestBallNum !== null) {
      const success = triggerExtractionByBallNumber(closestBallNum);
      if (success) {
        lastExtractedTime.current = now;
      }
    }
  });

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
        <CuboidCollider args={[0.3, 0.2, 0.3]} position={[0, 0.2, 0]} sensor />
      </RigidBody>
    </group>
  );
};
