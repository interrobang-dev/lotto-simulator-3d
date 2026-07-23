import React, { useRef } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { useLottoStore } from '../../store/useLottoStore';

export const ExtractionTube: React.FC = () => {
  const { extractBall, status } = useLottoStore();
  const lastExtractedTime = useRef(0);

  const handleIntersection = () => {
    if (status !== 'MIXING' && status !== 'EXTRACTING') return;

    const now = Date.now();
    if (now - lastExtractedTime.current < 2500) return;

    const randomBallNum = Math.floor(Math.random() * 45) + 1;
    const success = extractBall(randomBallNum);
    if (success) {
      lastExtractedTime.current = now;
    }
  };

  return (
    <group position={[0, 3.2, 0]}>
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

      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider
          args={[0.3, 0.2, 0.3]}
          position={[0, 0.2, 0]}
          sensor
          onIntersectionEnter={handleIntersection}
        />
      </RigidBody>
    </group>
  );
};
