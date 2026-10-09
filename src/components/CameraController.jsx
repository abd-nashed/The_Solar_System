import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function CameraController({ activePlanet, planetRefs }) {
  const { camera } = useThree();

  const targetPosition = useRef(new THREE.Vector3(0, 5, 15));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const planetWorldPos = useRef(new THREE.Vector3());
  const isTransitioning = useRef(false);
  const transitionTimer = useRef(0);

  useEffect(() => {
    isTransitioning.current = true;
    transitionTimer.current = 0;
  }, [activePlanet?.id]);

  useFrame((_, delta) => {
    if (!activePlanet) return;
    if (!planetRefs || !planetRefs.current) return;

    const ref = planetRefs.current[activePlanet.id];
    if (!ref) {
      return;
    }

    if (!ref.getWorldPosition) return;

    ref.getWorldPosition(planetWorldPos.current);

    const offset = activePlanet.cameraOffset || [0, 1, 4];

    targetPosition.current.set(
      planetWorldPos.current.x + offset[0],
      planetWorldPos.current.y + offset[1],
      planetWorldPos.current.z + offset[2]
    );

    let lerpFactor;
    if (isTransitioning.current) {
      lerpFactor = 0.05;
      transitionTimer.current += delta;
      if (transitionTimer.current > 1.2) {
        isTransitioning.current = false;
      }
    } else {
      lerpFactor = 0.12;
    }

    const smoothFactor = Math.min(lerpFactor * delta * 60, 1);

    camera.position.lerp(targetPosition.current, smoothFactor);
    currentLookAt.current.lerp(planetWorldPos.current, smoothFactor * 1.2);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}