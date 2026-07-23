import React, { useMemo, useRef } from 'react';
import { RigidBody, BallCollider } from '@react-three/rapier';
import { getLottoColor, createBallCanvasTexture } from '../../utils/colorUtils';

interface LottoBallProps {
  number: number;
  initialPosition: [number, number, number];
}

export const LottoBall: React.FC<LottoBallProps> = ({ number, initialPosition }) => {
  const rigidBodyRef = useRef<any>(null);

  const texture = useMemo(() => {
    const colorHex = getLottoColor(number);
    return createBallCanvasTexture(number, colorHex);
  }, [number]);

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders={false}
      position={initialPosition}
      restitution={0.85}
      friction={0.1}
      linearDamping={0.2}
      angularDamping={0.2}
    >
      <BallCollider args={[0.22]} />
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial map={texture} roughness={0.2} metalness={0.1} />
      </mesh>
    </RigidBody>
  );
};
