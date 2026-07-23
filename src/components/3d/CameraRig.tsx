import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useLottoStore } from '../../store/useLottoStore';

export const CameraRig: React.FC = () => {
  const controlsRef = useRef<any>(null);
  const cameraView = useLottoStore((state) => state.cameraView);
  const { camera } = useThree();

  // 정면 고정 시 3D 추첨기 구도 상향 조정 (Target: Y=0.95)
  const FIXED_POS = new THREE.Vector3(0, 1.3, 15);
  const FIXED_TARGET = new THREE.Vector3(0, 0.7, 0);

  // 시점 변경 시 카메라 보간 이동
  useEffect(() => {
    if (cameraView === 'FIXED' && controlsRef.current) {
      controlsRef.current.reset();
    }
  }, [cameraView]);

  // 방향키 및 WASD 키보드 입력 시 자유 3D 카메라 이동 제어
  const keysPressed = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    if (cameraView === 'FIXED' && controlsRef.current) {
      camera.position.lerp(FIXED_POS, delta * 3);
      controlsRef.current.target.lerp(FIXED_TARGET, delta * 3);
      controlsRef.current.update();
    } else if (cameraView === 'FREE' && controlsRef.current) {
      const speed = 6 * delta;
      const target = controlsRef.current.target;

      if (keysPressed.current['KeyW'] || keysPressed.current['ArrowUp']) {
        target.y += speed;
        camera.position.y += speed;
      }
      if (keysPressed.current['KeyS'] || keysPressed.current['ArrowDown']) {
        target.y -= speed;
        camera.position.y -= speed;
      }
      if (keysPressed.current['KeyA'] || keysPressed.current['ArrowLeft']) {
        target.x -= speed;
        camera.position.x -= speed;
      }
      if (keysPressed.current['KeyD'] || keysPressed.current['ArrowRight']) {
        target.x += speed;
        camera.position.x += speed;
      }

      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={cameraView === 'FREE'}
      enableZoom={true}
      enableRotate={cameraView === 'FREE'}
      minDistance={6}
      maxDistance={25}
      minPolarAngle={0.05}
      maxPolarAngle={Math.PI - 0.05} // Bottom View 하단 뒤집기 각도 개방
      target={[0, 0.95, 0]}
    />
  );
};
