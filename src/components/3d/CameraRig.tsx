import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useLottoStore } from '../../store/useLottoStore';

export const CameraRig: React.FC = () => {
  const { camera } = useThree();
  const cameraView = useLottoStore((state) => state.cameraView);
  const controlsRef = useRef<any>(null);

  const targetPosition = useRef(new THREE.Vector3(0, 0, 11));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    switch (cameraView) {
      case 'DEFAULT':
        targetPosition.current.set(0, 0.5, 10.5);
        targetLookAt.current.set(0, -0.2, 0);
        break;
      case 'RACK_ZOOM':
        targetPosition.current.set(0, 5, 6);
        targetLookAt.current.set(0, 4.2, -0.5);
        break;
      case 'TUBE_ZOOM':
        targetPosition.current.set(0, 4, 4.5);
        targetLookAt.current.set(0, 3.2, 0);
        break;
      case 'FOLLOW_BALL':
        targetPosition.current.set(0, -0.5, 5.5);
        targetLookAt.current.set(0, -1.5, 1.8);
        break;
    }
  }, [cameraView]);

  useFrame((_, delta) => {
    camera.position.lerp(targetPosition.current, delta * 3.5);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt.current, delta * 3.5);
      controlsRef.current.update();
    }
  });

  return <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} minDistance={3} maxDistance={22} />;
};
