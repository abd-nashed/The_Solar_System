import { useRef, useEffect } from 'react';
import { Planet } from './Planet';
import { CameraController } from './CameraController';
import { planets } from '../data/planets';

export function SolarSystem({ activePlanet, onSelect }) {
  const planetRefs = useRef({});

  useEffect(() => {
    planets.forEach((p) => {
      if (!(p.id in planetRefs.current)) {
        planetRefs.current[p.id] = null;
      }
    });
  }, []);

  return (
    <>
      {planets.map((planet) => (
        <Planet
          key={planet.id}
          planet={planet}
          onSelect={onSelect}
          isActive={activePlanet.id === planet.id}
          planetRefs={planetRefs}
        />
      ))}

      <CameraController
        activePlanet={activePlanet}
        planetRefs={planetRefs}
      />
    </>
  );
}