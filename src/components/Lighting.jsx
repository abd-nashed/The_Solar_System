import { useRef } from 'react';
import * as THREE from 'three';

export function Lighting() {
  const sunLightRef = useRef();

  return (
    <>
      <ambientLight intensity={0.15} color="#2a3a5a" />

      <pointLight
        ref={sunLightRef}
        position={[0, 0, 0]}
        intensity={250}
        color="#FDB813"
        distance={400}
        decay={2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />

      <hemisphereLight
        args={['#1a2a4a', '#000000', 0.3]}
      />

      <directionalLight
        position={[0, 50, 0]}
        intensity={0.2}
        color="#ffffff"
      />
    </>
  );
}