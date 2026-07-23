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
  const ballMode = useLottoStore((state) => state.ballModes[number] || 'PHYSICS_MODE');
  const activeExtractingBall = useLottoStore((state) => state.activeExtractingBall);
  const extractedBalls = useLottoStore((state) => state.extractedBalls);
  const bonusBall = useLottoStore((state) => state.bonusBall);

  // 챔버 내부 바닥 초기 안착 스폰 좌표 (45개 공이 층층이 정돈되어 바닥에 쌓임)
  const physicsSpawnPosition = useMemo<[number, number, number]>(() => {
    const layer = Math.floor((number - 1) / 12);
    const idxInLayer = (number - 1) % 12;
    const angle = (idxInLayer / 12) * Math.PI * 2;
    const r = 0.5 + (layer * 0.4);
    
    const x = Math.cos(angle) * r;
    const y = -2.3 + layer * 0.45; // 챔버 바닥(-2.3m)부터 적층
    const z = Math.sin(angle) * r;
    return [x, y, z];
  }, [number]);

  const texture = useMemo(() => {
    const colorHex = getLottoColor(number);
    return createBallCanvasTexture(number, colorHex);
  }, [number]);

  const slideProgress = useRef(0);
  const pulseOffset = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    // 1. PHYSICS_MODE: MIXING 또는 EXTRACTING 상태일 때만 바람(Impulse)이 작용함! (IDLE 일 때는 바람 없이 중력만 적용되어 바닥에 고요히 놓여짐)
    if (ballMode === 'PHYSICS_MODE' && rigidBodyRef.current && (status === 'MIXING' || status === 'EXTRACTING')) {
      pulseOffset.current += delta * 4;

      const translation = rigidBodyRef.current.translation();
      
      // 공이 바닥 구역(Y < -0.5m)에 있을 때 펄스파 분출
      if (translation.y < -0.5) {
        const isPulseActive = Math.sin(pulseOffset.current + number * 0.5) > -0.3;

        if (isPulseActive) {
          const powerFactor = airPower * 0.045;
          const vortexAngle = pulseOffset.current * 1.5 + number;

          const impulseX = Math.cos(vortexAngle) * powerFactor * (0.8 + Math.random() * 0.6);
          const impulseY = powerFactor * (1.8 + Math.random() * 1.4);
          const impulseZ = Math.sin(vortexAngle) * powerFactor * (0.8 + Math.random() * 0.6);

          rigidBodyRef.current.applyImpulse({ x: impulseX, y: impulseY, z: impulseZ }, true);
        }
      } else if (translation.y > 0) {
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
        restitution={0.7}
        friction={0.3}
        linearDamping={0.3}
        angularDamping={0.3}
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
      position={[0, 0, 0]}
      castShadow
      receiveShadow
    >
      <sphereGeometry args={[0.22, 32, 32]} />
      <meshStandardMaterial map={texture} roughness={0.2} metalness={0.1} />
    </mesh>
  );
};
