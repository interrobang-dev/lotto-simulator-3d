import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import { Environment, AdaptiveDpr } from '@react-three/drei';
import { MixerMachine } from './MixerMachine';
import { LottoBall } from './LottoBall';
import { AirBlower } from './AirBlower';
import { ExtractionTube } from './ExtractionTube';
import { CameraRig } from './CameraRig';

export const CanvasContainer: React.FC = () => {
  const initialPositions = useMemo(() => {
    const pos: [number, number, number][] = [];
    let count = 0;
    for (let x = -1.2; x <= 1.2 && count < 45; x += 0.5) {
      for (let y = -2.0; y <= 0.5 && count < 45; y += 0.5) {
        for (let z = -1.2; z <= 1.2 && count < 45; z += 0.5) {
          pos.push([x + (Math.random() - 0.5) * 0.1, y, z + (Math.random() - 0.5) * 0.1]);
          count++;
        }
      }
    }
    return pos;
  }, []);

  return (
    <div className="w-full h-full relative bg-slate-950">
      <Canvas
        shadows
        camera={{ position: [0, 1, 10], fov: 45 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#090d16']} />
        
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 15, 10]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} />
        <pointLight position={[-10, -5, -10]} intensity={0.5} color="#38bdf8" />
        <spotLight position={[0, 10, 0]} intensity={1.2} angle={0.6} penumbra={0.8} color="#ffffff" />
        <Environment preset="city" />

        <CameraRig />
        <AdaptiveDpr pixelated />

        <Physics gravity={[0, -9.81, 0]}>
          <MixerMachine />
          <ExtractionTube />
          <AirBlower />

          <RigidBody type="fixed" colliders={false}>
            <CuboidCollider args={[15, 0.5, 15]} position={[0, -5, 0]} />
          </RigidBody>

          {Array.from({ length: 45 }, (_, i) => i + 1).map((num, idx) => (
            <LottoBall key={num} number={num} initialPosition={initialPositions[idx]} />
          ))}
        </Physics>
      </Canvas>
    </div>
  );
};
