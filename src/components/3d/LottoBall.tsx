import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, BallCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { useLottoStore } from '../../store/useLottoStore';
import { getLottoColor, createBallCanvasTexture } from '../../utils/colorUtils';
import { getVenusSlidePath } from '../../utils/bezierUtils';

interface LottoBallProps {
  number: number;
}

export const LottoBall: React.FC<LottoBallProps> = ({ number }) => {
  const rigidBodyRef = useRef<any>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const status = useLottoStore((state) => state.status);
  const airPower = useLottoStore((state) => state.airPower);
  const ballMode = useLottoStore((state) => state.ballModes[number] || 'RACK_MODE');
  const activeExtractingBall = useLottoStore((state) => state.activeExtractingBall);
  const extractedBalls = useLottoStore((state) => state.extractedBalls);
  const bonusBall = useLottoStore((state) => state.bonusBall);

  // 상단 S자 랙 내의 대기 좌표 (1~45번 순서대로 정렬)
  const rackPosition = useMemo<[number, number, number]>(() => {
    const angle = ((number - 1) / 45) * Math.PI * 1.5;
    const x = Math.cos(angle) * 3.2 - 0.5;
    const y = 4.8 - number * 0.05;
    const z = -0.5 + Math.sin(angle) * 0.4;
    return [x, y, z];
  }, [number]);

  // 챔버 투입 낙하 초기 위치
  const physicsSpawnPosition = useMemo<[number, number, number]>(() => {
    const row = Math.floor((number - 1) / 9);
    const col = (number - 1) % 9;
    const x = -1.0 + col * 0.25;
    const y = -1.8 + row * 0.3;
    const z = -0.8 + (number % 5) * 0.35;
    return [x, y, z];
  }, [number]);

  const texture = useMemo(() => {
    const colorHex = getLottoColor(number);
    return createBallCanvasTexture(number, colorHex);
  }, [number]);

  const slideProgress = useRef(0);
  const impulseTimer = useRef(Math.random() * 10);

  useFrame((_, delta) => {
    // 1. PHYSICS_MODE 인 공들에게 지속적인 8방향 회오리 공기 물리력(Impulse) 적용
    if (ballMode === 'PHYSICS_MODE' && rigidBodyRef.current && (status === 'MIXING' || status === 'EXTRACTING')) {
      impulseTimer.current += delta * 5;

      const translation = rigidBodyRef.current.translation();
      // 하단 챔버에 가깝거나 일정 높이 이하일수록 강하게 튀어오름
      if (translation.y < 1.5) {
        // 회오리 소용돌이 각도 및 불규칙 상승 임펄스 계산
        const vortexAngle = impulseTimer.current + number;
        const baseForce = airPower * 0.035;

        const impulseX = Math.cos(vortexAngle) * baseForce + (Math.random() - 0.5) * 0.02;
        const impulseY = (Math.random() * 0.4 + 0.6) * baseForce * 2.2;
        const impulseZ = Math.sin(vortexAngle) * baseForce + (Math.random() - 0.5) * 0.02;

        rigidBodyRef.current.applyImpulse({ x: impulseX, y: impulseY, z: impulseZ }, true);
      }
    }

    // 2. SLIDE_MODE: 전면 레일 굴러내려옴
    if (ballMode === 'SLIDE_MODE' && activeExtractingBall?.number === number) {
      slideProgress.current = Math.min(slideProgress.current + delta * 0.5, 1);
      const pos = getVenusSlidePath(activeExtractingBall.slotIndex, slideProgress.current);

      if (meshRef.current) {
        meshRef.current.position.copy(pos);
        meshRef.current.rotation.x += delta * 10;
        meshRef.current.rotation.z += delta * 5;
      }
    }

    // 3. DOCKED_MODE: 전면 거치대에 안착
    if (ballMode === 'DOCKED_MODE') {
      const extractedInfo = [...extractedBalls, bonusBall].find((b) => b?.number === number);
      if (extractedInfo && meshRef.current) {
        const targetX = -1.8 + extractedInfo.slotIndex * 0.55;
        meshRef.current.position.set(targetX, -1.8, 2.2);
      }
    }
  });

  if (ballMode === 'PHYSICS_MODE') {
    return (
      <RigidBody
        ref={rigidBodyRef}
        colliders={false}
        position={physicsSpawnPosition}
        restitution={0.85}
        friction={0.15}
        linearDamping={0.2}
        angularDamping={0.2}
        ccd={true}
      >
        <BallCollider args={[0.22]} />
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.22, 32, 32]} />
          <meshStandardMaterial map={texture} roughness={0.2} metalness={0.1} />
        </mesh>
      </RigidBody>
    );
  }

  return (
    <mesh
      ref={meshRef}
      position={ballMode === 'RACK_MODE' ? rackPosition : [0, 0, 0]}
      castShadow
      receiveShadow
    >
      <sphereGeometry args={[0.22, 32, 32]} />
      <meshStandardMaterial map={texture} roughness={0.2} metalness={0.1} />
    </mesh>
  );
};
