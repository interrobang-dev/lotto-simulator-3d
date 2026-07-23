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

  // 챔버 투입 낙하 안전 스폰 위치 (챔버 중앙 내부 안쪽)
  const physicsSpawnPosition = useMemo<[number, number, number]>(() => {
    const row = Math.floor((number - 1) / 9);
    const col = (number - 1) % 9;
    const x = -1.2 + col * 0.3;
    const y = -1.8 + row * 0.35;
    const z = -1.0 + (number % 5) * 0.4;
    return [x, y, z];
  }, [number]);

  const texture = useMemo(() => {
    const colorHex = getLottoColor(number);
    return createBallCanvasTexture(number, colorHex);
  }, [number]);

  const slideProgress = useRef(0);

  useFrame((_, delta) => {
    // 1. SLIDE_MODE: 전면 레일 굴러내려옴
    if (ballMode === 'SLIDE_MODE' && activeExtractingBall?.number === number) {
      slideProgress.current = Math.min(slideProgress.current + delta * 0.5, 1);
      const pos = getVenusSlidePath(activeExtractingBall.slotIndex, slideProgress.current);

      if (meshRef.current) {
        meshRef.current.position.copy(pos);
        meshRef.current.rotation.x += delta * 10;
        meshRef.current.rotation.z += delta * 5;
      }
    }

    // 2. DOCKED_MODE: 전면 거치대에 안착
    if (ballMode === 'DOCKED_MODE') {
      const extractedInfo = [...extractedBalls, bonusBall].find((b) => b?.number === number);
      if (extractedInfo && meshRef.current) {
        const targetX = -1.8 + extractedInfo.slotIndex * 0.55;
        meshRef.current.position.set(targetX, -1.8, 2.2);
      }
    }

    // 3. PHYSICS_MODE 세이프티 가드 (혹시라도 밖으로 나가면 챔버 중앙으로 원점 복구)
    if (ballMode === 'PHYSICS_MODE' && rigidBodyRef.current) {
      const translation = rigidBodyRef.current.translation();
      const distFromCenter = Math.sqrt(translation.x ** 2 + translation.y ** 2 + translation.z ** 2);
      if (distFromCenter > 2.8) {
        rigidBodyRef.current.setTranslation({ x: 0, y: -1.0, z: 0 }, true);
        rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      }
    }
  });

  // PHYSICS_MODE일 때만 Rapier RigidBody 렌더링 (ccd=true로 통과 방지)
  if (ballMode === 'PHYSICS_MODE') {
    return (
      <RigidBody
        ref={rigidBodyRef}
        colliders={false}
        position={physicsSpawnPosition}
        restitution={0.8}
        friction={0.2}
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

  // RACK_MODE / SLIDE_MODE / DOCKED_MODE 일 때는 Kinematic Mesh 렌더링
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
