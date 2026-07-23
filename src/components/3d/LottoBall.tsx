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
    const x = -0.8 + col * 0.2;
    const y = -1.8 + row * 0.3;
    const z = -0.6 + (number % 5) * 0.3;
    return [x, y, z];
  }, [number]);

  const texture = useMemo(() => {
    const colorHex = getLottoColor(number);
    return createBallCanvasTexture(number, colorHex);
  }, [number]);

  const slideProgress = useRef(0);
  const impulseTimer = useRef(Math.random() * 100);

  useFrame((_, delta) => {
    // 1. PHYSICS_MODE: 상하 순환 역동적 회오리 물리력 적용
    if (ballMode === 'PHYSICS_MODE' && rigidBodyRef.current && (status === 'MIXING' || status === 'EXTRACTING')) {
      impulseTimer.current += delta * (3.5 + (number % 3) * 0.5);

      const translation = rigidBodyRef.current.translation();
      const vortexAngle = impulseTimer.current * 0.8 + number;
      const baseForce = airPower * 0.02;

      let impulseX = Math.cos(vortexAngle) * baseForce * 0.6;
      let impulseZ = Math.sin(vortexAngle) * baseForce * 0.6;
      let impulseY = 0;

      // 위치 기반 상하 순환 물리 연산 (Y < 0.2 시 강한 상승, Y > 1.2 시 하향 낙하 유도)
      if (translation.y < 0.2) {
        impulseY = (Math.random() * 0.5 + 0.8) * baseForce * 2.8; // 하단 -> 상단 솟구침
      } else if (translation.y > 1.2) {
        impulseY = -(Math.random() * 0.4 + 0.3) * baseForce * 1.5; // 상단 -> 하단 낙하 유도
      } else {
        impulseY = (Math.random() - 0.4) * baseForce * 1.2; // 중앙 난류
      }

      rigidBodyRef.current.applyImpulse({ x: impulseX, y: impulseY, z: impulseZ }, true);
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
        restitution={0.75}
        friction={0.2}
        linearDamping={0.25}
        angularDamping={0.25}
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
