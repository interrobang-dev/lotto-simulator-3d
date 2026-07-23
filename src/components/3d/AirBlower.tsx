import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useLottoStore } from '../../store/useLottoStore';

export const AirBlower: React.FC = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const status = useLottoStore((state) => state.status);
  const airPower = useLottoStore((state) => state.airPower);

  const particleCount = 120;
  const positions = useRef(new Float32Array(particleCount * 3));

  useFrame((_, delta) => {
    if (status === 'MIXING' || status === 'EXTRACTING') {
      if (particlesRef.current) {
        const posArr = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          posArr[i * 3 + 1] += delta * (airPower * 1.5);
          if (posArr[i * 3 + 1] > 2.5) {
            posArr[i * 3 + 1] = -2.5;
            posArr[i * 3] = (Math.random() - 0.5) * 4;
            posArr[i * 3 + 2] = (Math.random() - 0.5) * 4;
          }
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  });

  return (
    <group>
      {(status === 'MIXING' || status === 'EXTRACTING') && (
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[positions.current, 3]}
            />
          </bufferGeometry>
          <pointsMaterial size={0.08} color="#60a5fa" transparent opacity={0.6} />
        </points>
      )}
    </group>
  );
};
