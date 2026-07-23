import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import { Environment, AdaptiveDpr } from '@react-three/drei';
import { MixerMachine } from './MixerMachine';
import { SlideTrack } from './SlideTrack';
import { LottoBall } from './LottoBall';
import { AirBlower } from './AirBlower';
import { ExtractionTube } from './ExtractionTube';
import { CameraRig } from './CameraRig';

export const CanvasContainer: React.FC = () => {
  // 45개 공의 실시간 RigidBody 인스턴스 참조 맵
  const ballsRefMap = useRef<Record<number, any>>({});

  return (
    <div className="w-full h-full relative bg-slate-950">
      <Canvas
        shadows
        camera={{ position: [0, 0.5, 10.5], fov: 45 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#080c14']} />
        
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 15, 10]} intensity={1.6} castShadow shadow-mapSize={[2048, 2048]} />
        <pointLight position={[-10, -5, -10]} intensity={0.6} color="#38bdf8" />
        <spotLight position={[0, 10, 0]} intensity={1.4} angle={0.6} penumbra={0.8} color="#ffffff" />
        <Environment preset="city" />

        <CameraRig />
        <AdaptiveDpr pixelated />

        <SlideTrack />

        <Physics gravity={[0, -9.81, 0]}>
          <MixerMachine />
          <ExtractionTube ballsRefMap={ballsRefMap} />
          <AirBlower />

          <RigidBody type="fixed" colliders={false}>
            <CuboidCollider args={[15, 0.5, 15]} position={[0, -5, 0]} />
          </RigidBody>

          {/* 45개 로또 공 렌더링 */}
          {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => (
            <LottoBall key={num} number={num} ballsRefMap={ballsRefMap} />
          ))}
        </Physics>
      </Canvas>
    </div>
  );
};
