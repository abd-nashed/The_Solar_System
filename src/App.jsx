import { Suspense, useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { SolarSystem } from './components/SolarSystem';
import { InfoCard } from './components/InfoCard';
import { StarField } from './components/StarField';
import { Lighting } from './components/Lighting';
import { Effects } from './components/Effects';
import { planets } from './data/planets';
import './App.css';

planets.forEach((p) => {
  if (p.model) useGLTF.preload(p.model);
});

function SceneFallback() {
  return (
    <mesh>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial color="#333" wireframe />
    </mesh>
  );
}

function Scene({ activePlanet, onSelect }) {
  return (
    <>
      <color attach="background" args={['#000005']} />

      <Lighting />
      <StarField count={3000} />

      <Suspense fallback={<SceneFallback />}>
        <SolarSystem activePlanet={activePlanet} onSelect={onSelect} />
      </Suspense>

      <Effects />
    </>
  );
}

function App() {
  const [activePlanet, setActivePlanet] = useState(planets[0]);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = docHeight > 0 ? scrollTop / docHeight : 0;
          setScrollProgress(progress);

          const totalPlanets = planets.length;
          const index = Math.min(
            Math.floor(progress * totalPlanets * 0.999),
            totalPlanets - 1
          );

          setActivePlanet(planets[index]);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePlanetSelect = useCallback((planet) => {
    const index = planets.findIndex(p => p.id === planet.id);
    if (index === -1) return;

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const targetScroll = (index / planets.length) * docHeight + 1;

    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  }, []);

  return (
    <div className="app">
      <div className="canvas-container">
        <Canvas
          camera={{ position: [0, 5, 15], fov: 55, near: 0.1, far: 2000 }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
          }}
          dpr={1}                         
          frameloop="always"
        >
          <Scene activePlanet={activePlanet} onSelect={handlePlanetSelect} />
        </Canvas>
      </div>

      <InfoCard planet={activePlanet} />

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${scrollProgress * 100}%`,
            background: `linear-gradient(90deg, #FDB813, ${activePlanet.color})`,
          }}
        />
      </div>

      <nav className="planet-nav">
        {planets.map((p) => (
          <button
            key={p.id}
            className={`nav-dot ${activePlanet.id === p.id ? 'active' : ''}`}
            style={{
              background: p.color,
              '--planet-color': p.color,
            }}
            onClick={() => handlePlanetSelect(p)}
            aria-label={p.name}
          >
            <span className="nav-tooltip">{p.name}</span>
          </button>
        ))}
      </nav>

      <header className="site-header">
        <h1>النظام الشمسي</h1>
        <p>رحلة تفاعلية ثلاثية الأبعاد</p>
      </header>

      {scrollProgress < 0.02 && (
        <div className="scroll-hint">
          <span>اسحب للأسفل للاستكشاف</span>
          <div className="scroll-arrow">↓</div>
        </div>
      )}

      <div className="scroll-space" />
    </div>
  );
}

export default App;