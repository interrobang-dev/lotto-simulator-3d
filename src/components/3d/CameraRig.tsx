import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useLottoStore } from '../../store/useLottoStore';

export const CameraRig: React.FC = () => {
  const { camera } = useThree();
  const cameraView = useLottoStore((state) => state.cameraView);
  const controlsRef = useRef<any>(null);

  const targetPosition = useRef(new THREE.Vector3(0, 1.0, 13.5)); // 지금보다 조금 더 멀리 배치
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (cameraView === 'FIXED') {
      targetPosition.current.set(0, 1.0, 13.5);
      targetLookAt.current.set(0, 0, 0);
    }
  }, [cameraView]);

  useFrame((_, delta) => {
    if (cameraView === 'FIXED') {
      camera.position.lerp(targetPosition.current, delta * 4);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLookAt.current, delta * 4);
        controlsRef.current.update();
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={cameraView === 'FREE'}
      enableDamping
      dampingFactor={0.05}
      minDistance={4}
      maxDistance={25}
    />
  );
};
