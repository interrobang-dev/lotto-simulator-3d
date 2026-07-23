import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useLottoStore } from '../../store/useLottoStore';

export const AirBlower: React.FC = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const status = useLottoStore((state) => state.status);
  const airPower = useLottoStore((state) => state.airPower);

  const particleCount = 180;
  const positions = useRef(new Float32Array(particleCount * 3));

  useFrame((_, delta) => {
    if (status === 'MIXING' || status === 'EXTRACTING') {
      if (particlesRef.current) {
        const posArr = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          const angle = posArr[i * 3 + 1] * 2 + i; // 회오리 각도
          const radius = 0.5 + Math.sin(posArr[i * 3 + 1]) * 1.5;

          posArr[i * 3] = Math.cos(angle) * radius;
          posArr[i * 3 + 2] = Math.sin(angle) * radius;
          posArr[i * 3 + 1] += delta * (airPower * 1.8);

          if (posArr[i * 3 + 1] > 2.5) {
            posArr[i * 3 + 1] = -2.5;
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
          <pointsMaterial size={0.09} color="#38bdf8" transparent opacity={0.7} />
        </points>
      )}
    </group>
  );
};
