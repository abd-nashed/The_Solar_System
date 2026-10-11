import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CelestialBody } from './CelestialBody';

export function Planet({ planet, onSelect, isActive, planetRefs }) {
  const orbitRef = useRef();
  const moonOrbitRefs = useRef([]);
  const moonOrbitRotations = useMemo(
    () => (planet.moons || []).map((_, index) => (
      (index * Math.PI * 2) / (planet.moons.length || 1)
    )),
    [planet.moons]
  );

  useFrame((_, delta) => {
    if (orbitRef.current && planet.speed) {
      orbitRef.current.rotation.y += delta * planet.speed * 0.15;
    }

    moonOrbitRefs.current.forEach((ref, i) => {
      if (ref && planet.moons && planet.moons[i]) {
        ref.rotation.y += delta * planet.moons[i].speed * 0.08;
      }
    });
  });

  return (
    <>
      {planet.distance > 0 && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[planet.distance - 0.02, planet.distance + 0.02, 64]} />
          <meshBasicMaterial
            color="#4a5568"
            transparent
            opacity={isActive ? 0.4 : 0.12}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      <group ref={orbitRef}>
        <group position={[planet.distance, 0, 0]}>

          <group
            ref={(el) => {
              if (planetRefs && planetRefs.current) {
                planetRefs.current[planet.id] = el;
              }
            }}
          >
            <CelestialBody
              planet={planet}
              onSelect={onSelect}
              isActive={isActive}
            />
          </group>

          {planet.moons && planet.moons.map((moon, i) => (
            <group
              key={moon.name}
              ref={(el) => (moonOrbitRefs.current[i] = el)}
              rotation={[0, moonOrbitRotations[i], 0]}
            >
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[moon.distance - 0.005, moon.distance + 0.005, 32]} />
                <meshBasicMaterial
                  color="#ffffff"
                  transparent
                  opacity={0.06}
                  side={THREE.DoubleSide}
                />
              </mesh>

              <group position={[moon.distance, 0, 0]} scale={0.08}>
                <CelestialBody
                  planet={{
                    ...moon,
                    isSun: false,
                    rotationSpeed: 0.5,
                    model: moon.model || '',
                  }}
                  onSelect={onSelect}
                  isMoon={true}
                />
              </group>
            </group>
          ))}
        </group>
      </group>
    </>
  );
}