import { useRef, useMemo, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFErrorBoundary } from './GLTFErrorBoundary';

function FallbackSphere({ planet, onSelect, isMoon = false }) {
  const ref = useRef();

  useFrame((_, delta) => {
    if (ref.current && planet.rotationSpeed) {
      ref.current.rotation.y += delta * planet.rotationSpeed;
    }
  });

  return (
    <group ref={ref}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onSelect(planet);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
      >
        <sphereGeometry args={[1, isMoon ? 16 : 32, isMoon ? 16 : 32]} />
        <meshStandardMaterial
          color={planet.color}
          emissive={planet.isSun ? planet.color : '#000000'}
          emissiveIntensity={planet.isSun ? 1.5 : 0}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
}

function ModelLoader({ planet, onSelect, isMoon = false }) {
  const localRef = useRef();

  const gltf = useGLTF(planet.model, false);

  const clonedScene = useMemo(() => {
    if (!gltf || !gltf.scene) return null;

    const clone = gltf.scene.clone(true);

    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z);

    if (maxDim > 0) {
      const normalizeScale = 1 / maxDim;
      clone.scale.setScalar(normalizeScale);
      clone.position.sub(center.multiplyScalar(normalizeScale));
    }

    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = !isMoon;
        child.receiveShadow = !isMoon;

        if (child.material) {
          child.material.envMapIntensity = 1;

          if (planet.isSun) {
            child.material.emissive = new THREE.Color(planet.color);
            child.material.emissiveIntensity = 1.5;
            child.material.toneMapped = false;
          }
        }
      }
    });

    return clone;
  }, [gltf, planet.color, planet.isSun, isMoon]);

  useFrame((_, delta) => {
    if (localRef.current && planet.rotationSpeed) {
      localRef.current.rotation.y += delta * planet.rotationSpeed;
    }
  });

  if (!clonedScene) return null;

  return (
    <group ref={localRef}>
      <primitive
        object={clonedScene}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(planet);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
      />
    </group>
  );
}

export function CelestialBody({ planet, onSelect, isActive = false, isMoon = false }) {
  const fallback = <FallbackSphere planet={planet} onSelect={onSelect} isMoon={isMoon} />;

  if (!planet.model) {
    return fallback;
  }

  return (
    <GLTFErrorBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <ModelLoader planet={planet} onSelect={onSelect} isMoon={isMoon} />
      </Suspense>
    </GLTFErrorBoundary>
  );
}