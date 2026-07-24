import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, BallCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { useLottoStore } from '../../store/useLottoStore';
import { getLottoColor, createBallCanvasTexture } from '../../utils/colorUtils';
import { getVenusFlightPath } from '../../utils/bezierUtils';

interface LottoBallProps {
  number: number;
  ballsRefMap: React.MutableRefObject<Record<number, any>>;
}

export const LottoBall: React.FC<LottoBallProps> = ({ number, ballsRefMap }) => {
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
    const r = 0.5 + layer * 0.4;
    
    const x = Math.cos(angle) * r;
    const y = -2.3 + layer * 0.45;
    const z = Math.sin(angle) * r;
    return [x, y, z];
  }, [number]);

  const texture = useMemo(() => {
    const colorHex = getLottoColor(number);
    return createBallCanvasTexture(number, colorHex);
  }, [number]);

  const slideProgress = useRef(0);
  const pulseOffset = useRef(Math.random() * Math.PI * 2);

  // 공별 무작위 비행 3축 회전 속도
  const flightRotSpeed = useMemo(() => {
    return {
      x: (Math.random() * 8 + 5) * (Math.random() > 0.5 ? 1 : -1),
      y: (Math.random() * 8 + 5) * (Math.random() > 0.5 ? 1 : -1),
      z: (Math.random() * 6 + 3) * (Math.random() > 0.5 ? 1 : -1),
    };
  }, []);

  // RigidBody 인스턴스 실시간 맵 등록
  useEffect(() => {
    if (rigidBodyRef.current) {
      ballsRefMap.current[number] = rigidBodyRef.current;
    }
    return () => {
      delete ballsRefMap.current[number];
    };
  }, [ballMode, ballsRefMap, number]);

  useFrame((_, delta) => {
    // 1. PHYSICS_MODE: MIXING 또는 EXTRACTING 상태일 때 공기 임펄스 작동
    if (ballMode === 'PHYSICS_MODE' && rigidBodyRef.current && (status === 'MIXING' || status === 'EXTRACTING')) {
      pulseOffset.current += delta * 4;

      const translation = rigidBodyRef.current.translation();
      
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

    // 2. SLIDE_MODE: 뚜껑 캡 부르르 떨림 후 전면 거치대로 다차원 3D 회전 감속 비행
    if (ballMode === 'SLIDE_MODE' && activeExtractingBall?.number === number) {
      slideProgress.current = Math.min(slideProgress.current + delta * 0.45, 1);
      const pos = getVenusFlightPath(activeExtractingBall.slotIndex, slideProgress.current);

      if (meshRef.current) {
        meshRef.current.position.copy(pos);

        if (slideProgress.current < 0.25) {
          // 캡 포획 구간 부르르 미세 회전 진동
          meshRef.current.rotation.x += Math.sin(slideProgress.current * 80) * 0.1;
          meshRef.current.rotation.z += Math.cos(slideProgress.current * 80) * 0.1;
        } else {
          // 비행 후반부(0.7~1.0) 서서히 멈추는 감속 계수 (Ease-Out Damping)
          const normFlight = (slideProgress.current - 0.25) / 0.75;
          const easeFactor = normFlight > 0.65 ? Math.pow(Math.max(0, (1 - normFlight) / 0.35), 2) : 1;

          meshRef.current.rotation.x += delta * flightRotSpeed.x * easeFactor;
          meshRef.current.rotation.y += delta * flightRotSpeed.y * easeFactor;
          meshRef.current.rotation.z += delta * flightRotSpeed.z * easeFactor;
        }
      }
    }

    // 3. DOCKED_MODE: 전면 거치대에 부드럽게 멈춘 무작위 방향으로 안착
    if (ballMode === 'DOCKED_MODE') {
      const extractedInfo = [...extractedBalls, bonusBall].find((b) => b?.number === number);
      if (extractedInfo && meshRef.current) {
        const targetX = -1.8 + extractedInfo.slotIndex * 0.55;
        meshRef.current.position.set(targetX, -2.1, 3.4);
      }
    }
  });

  if (ballMode === 'PHYSICS_MODE') {
    return (
      <RigidBody
        ref={(ref) => {
          rigidBodyRef.current = ref;
          if (ref) ballsRefMap.current[number] = ref;
        }}
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
