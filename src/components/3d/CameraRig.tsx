import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useLottoStore } from '../../store/useLottoStore';

export const CameraRig: React.FC = () => {
  const { camera } = useThree();
  const cameraView = useLottoStore((state) => state.cameraView);
  const orbitRef = useRef<any>(null);

  const keysRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    // 1. FIXED 모드: 정면 고정 뷰포트 (추첨기가 화면 아래쪽에 안정적으로 놓이도록 Y축 Target & Position 조정)
    if (cameraView === 'FIXED') {
      const fixedPos = new THREE.Vector3(0, 1.4, 17.5);
      const fixedTarget = new THREE.Vector3(0, 0.9, 0);

      camera.position.lerp(fixedPos, delta * 4);
      if (orbitRef.current) {
        orbitRef.current.target.lerp(fixedTarget, delta * 4);
        orbitRef.current.update();
      }
      return;
    }

    // 2. FREE 모드: 키보드 방향키 이동
    if (cameraView === 'FREE' && orbitRef.current) {
      const keys = keysRef.current;
      const moveSpeed = delta * 6.0;

      const forward = new THREE.Vector3();
      camera.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();

      const right = new THREE.Vector3();
      right.crossVectors(forward, camera.up).normalize();

      const moveVector = new THREE.Vector3();

      if (keys['ArrowUp'] || keys['KeyW']) {
        moveVector.addScaledVector(forward, moveSpeed);
      }
      if (keys['ArrowDown'] || keys['KeyS']) {
        moveVector.addScaledVector(forward, -moveSpeed);
      }
      if (keys['ArrowLeft'] || keys['KeyA']) {
        moveVector.addScaledVector(right, -moveSpeed);
      }
      if (keys['ArrowRight'] || keys['KeyD']) {
        moveVector.addScaledVector(right, moveSpeed);
      }

      if (moveVector.lengthSq() > 0) {
        camera.position.add(moveVector);
        orbitRef.current.target.add(moveVector);
        orbitRef.current.update();
      }
    }
  });

  return (
    <OrbitControls
      ref={orbitRef}
      enabled={cameraView === 'FREE'}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={2.5}
      maxDistance={35}
      minPolarAngle={0.05}
      maxPolarAngle={Math.PI - 0.05}
      target={[0, 0.9, 0]}
    />
  );
};
