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

  // 챔버 투입 낙하 초기 위치 (바닥 근처)
  const physicsSpawnPosition = useMemo<[number, number, number]>(() => {
    const row = Math.floor((number - 1) / 9);
    const col = (number - 1) % 9;
    const x = -0.9 + col * 0.22;
    const y = -2.2 + row * 0.25;
    const z = -0.7 + (number % 5) * 0.35;
    return [x, y, z];
  }, [number]);

  const texture = useMemo(() => {
    const colorHex = getLottoColor(number);
    return createBallCanvasTexture(number, colorHex);
  }, [number]);

  const slideProgress = useRef(0);
  const pulseOffset = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    // 1. PHYSICS_MODE: 펄스파(Pulse Wave) 기반 무작위 3D 카오스 뒤섞임 연산
    if (ballMode === 'PHYSICS_MODE' && rigidBodyRef.current && (status === 'MIXING' || status === 'EXTRACTING')) {
      pulseOffset.current += delta * 4;

      const translation = rigidBodyRef.current.translation();
      
      // 공이 바닥 구역(Y < -0.8m)에 내려왔을 때 강력한 펄스 파동으로 위로 폭발적 분출
      if (translation.y < -0.8) {
        // 공마다 약간씩 다른 타이밍의 펄스 분출
        const isPulseActive = Math.sin(pulseOffset.current + number * 0.5) > -0.3;

        if (isPulseActive) {
          const powerFactor = airPower * 0.045;
          const vortexAngle = pulseOffset.current * 1.5 + number;

          // 사방으로 튀어오르는 난수 수평 벡터 + 강한 상승 벡터
          const impulseX = Math.cos(vortexAngle) * powerFactor * (0.8 + Math.random() * 0.6);
          const impulseY = powerFactor * (1.8 + Math.random() * 1.4); // 챔버 천장까지 분출
          const impulseZ = Math.sin(vortexAngle) * powerFactor * (0.8 + Math.random() * 0.6);

          rigidBodyRef.current.applyImpulse({ x: impulseX, y: impulseY, z: impulseZ }, true);
        }
      } else if (translation.y > 0) {
        // 중중에 뜬 공에 불규칙 회오리 소용돌이 힘 추가 (하향 저항 없이 순수 중력으로 낙하 유도)
        const powerFactor = airPower * 0.008;
        const vortexAngle = pulseOffset.current * 2.0 + number;
        const impulseX = Math.cos(vortexAngle) * powerFactor;
        const impulseZ = Math.sin(vortexAngle) * powerFactor;

        rigidBodyRef.current.applyImpulse({ x: impulseX, y: 0, z: impulseZ }, true);
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
        friction={0.1}
        linearDamping={0.15}
        angularDamping={0.15}
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
