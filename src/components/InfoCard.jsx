import { useEffect, useState } from 'react';

export function InfoCard({ planet }) {
  const [displayedPlanet, setDisplayedPlanet] = useState(planet);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  }, [planet.id, isMobile]);

  useEffect(() => {
    if (planet.id !== displayedPlanet.id) {
      setIsVisible(false);
      const timeout = setTimeout(() => {
        setDisplayedPlanet(planet);
        setIsVisible(true);
      }, 250);
      return () => clearTimeout(timeout);
    }
  }, [planet, displayedPlanet.id]);

  return (
    <>
      {isMobile && (
        <button
          className={`info-card-toggle ${isMobileOpen ? 'active' : ''}`}
          onClick={() => setIsMobileOpen((prev) => !prev)}
          aria-label={isMobileOpen ? 'إغلاق المعلومات' : 'عرض المعلومات'}
          style={{ '--planet-color': displayedPlanet.color }}
        >
          {isMobileOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          )}
          <span className="info-card-toggle-label">
            {isMobileOpen ? 'إغلاق' : displayedPlanet.name}
          </span>
        </button>
      )}

      {isMobile && isMobileOpen && (
        <div
          className="info-card-overlay"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div
        className={`info-card ${isVisible ? 'visible' : 'hidden'} ${
          isMobile ? (isMobileOpen ? 'mobile-open' : 'mobile-closed') : ''
        }`}
      >
        <div className="info-card-inner">

          {isMobile && (
            <button
              className="info-card-close"
              onClick={() => setIsMobileOpen(false)}
              aria-label="إغلاق"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}

          <div className="info-card-header" style={{ '--planet-color': displayedPlanet.color }}>
            <div className="info-card-accent" style={{ background: displayedPlanet.color }} />
            <div>
              <h2 style={{ color: displayedPlanet.color }}>{displayedPlanet.name}</h2>
              <span className="info-card-en">{displayedPlanet.nameEn}</span>
            </div>
          </div>

          <p className="info-card-desc">{displayedPlanet.info}</p>

          <div className="info-card-stats">
            {Object.entries(displayedPlanet.stats).map(([key, value]) => (
              <div key={key} className="stat-row">
                <span className="stat-key">{key}</span>
                <span className="stat-value">{value}</span>
              </div>
            ))}
          </div>

          {displayedPlanet.moons && displayedPlanet.moons.length > 0 && (
            <div className="info-card-moons">
              <h3>الأقمار الرئيسية</h3>
              <div className="moons-list">
                {displayedPlanet.moons.map((moon) => (
                  <span
                    key={moon.name}
                    className="moon-tag"
                    style={{ borderColor: moon.color, color: moon.color }}
                  >
                    {moon.name}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}