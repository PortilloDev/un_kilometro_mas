import { forwardRef, useRef } from 'react';
import type { PostState, Layer } from '../../model/types';
import './PostCanvas.css';

interface Props {
  state: PostState;
  layers: Layer[];
  onHeroClick: () => void;
  onMapClick: () => void;
}

function isVisible(layers: Layer[], id: string): boolean {
  const l = layers.find((x) => x.id === id);
  return l ? l.visible : true;
}

const PostCanvas = forwardRef<HTMLDivElement, Props>(
  ({ state, layers, onHeroClick, onMapClick }, ref) => {
    const { challenge, stats, content } = state;

    return (
      <div className="post-canvas" ref={ref}>
        {/* ── Hero image ──────────────────────────────────────────────── */}
        {isVisible(layers, 'hero-image') && (
          <>
            {state.heroImage ? (
              <img
                className="layer-hero-image"
                src={state.heroImage}
                alt="Hero"
                draggable={false}
              />
            ) : (
              <div className="layer-hero-placeholder" onClick={onHeroClick}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span>Añadir fotografía principal</span>
              </div>
            )}
            <div className="hero-gradient-overlay" />
            <div className="hero-bottom-overlay" />
          </>
        )}

        {/* ── Logo ────────────────────────────────────────────────────── */}
        {isVisible(layers, 'logo') && (
          <div className="layer-logo">
            <div className="logo-text">
              <span className="logo-un">UN</span>
              <span className="logo-kilometro">KILÓMETRO</span>
              <div className="logo-mas-row">
                <div>
                  <span className="logo-mas">MÁS</span>
                  <div className="logo-orange-line" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── RETO title ──────────────────────────────────────────────── */}
        {isVisible(layers, 'reto-title') && (
          <div className="layer-reto-title">
            <div className="reto-label">RETO</div>
            <div className="reto-number">
              <span className="current-day">{challenge.currentDay}</span>
              <span className="reto-total">/{challenge.totalDays}</span>
            </div>
            <div className="reto-goal">{challenge.dailyGoal}</div>
          </div>
        )}

        {/* ── Stats card ──────────────────────────────────────────────── */}
        {isVisible(layers, 'stats-card') && (
          <div className="layer-stats-card">
            <div className="stats-card-header">
              <div className="stats-header-left">
                <span className="stats-run-icon">🏃</span>
                <span className="stats-datetime">
                  {stats.date} · {stats.time}
                </span>
              </div>
              {state.showTemperature && stats.temperature && (
                <div className="stats-weather">
                  <span>{stats.temperature}°</span>
                  <span>☀️</span>
                </div>
              )}
            </div>

            <div className="stats-map-area">
              {state.mapImage ? (
                <>
                  <img
                    className="stats-map-img"
                    src={state.mapImage}
                    alt="Mapa del recorrido"
                    draggable={false}
                  />
                  {stats.location && (
                    <span className="stats-location">{stats.location}</span>
                  )}
                </>
              ) : (
                <div className="stats-map-placeholder" onClick={onMapClick}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                    <line x1="9" y1="3" x2="9" y2="18" />
                    <line x1="15" y1="6" x2="15" y2="21" />
                  </svg>
                  <span>Añadir captura del mapa</span>
                </div>
              )}
            </div>

            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-icon">📍</span>
                <div className="stat-content">
                  <span className="stat-value">{stats.distance} km</span>
                  <span className="stat-label">Distancia</span>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">⏱</span>
                <div className="stat-content">
                  <span className="stat-value">{stats.duration}</span>
                  <span className="stat-label">Tiempo total</span>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">⚡</span>
                <div className="stat-content">
                  <span className="stat-value">{stats.pace} /km</span>
                  <span className="stat-label">Ritmo medio</span>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">❤️</span>
                <div className="stat-content">
                  <span className="stat-value">{stats.heartRate} bpm</span>
                  <span className="stat-label">Frecuencia media</span>
                </div>
              </div>
              {state.showCalories && (
                <div className="stat-item full-width">
                  <span className="stat-icon">🔥</span>
                  <div className="stat-content">
                    <span className="stat-value">{stats.calories} cal</span>
                    <span className="stat-label">Calorías</span>
                  </div>
                </div>
              )}
              {state.showElevation && stats.elevation && (
                <div className="stat-item full-width">
                  <span className="stat-icon">⛰️</span>
                  <div className="stat-content">
                    <span className="stat-value">{stats.elevation} m</span>
                    <span className="stat-label">Desnivel positivo</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Landscape decoration ────────────────────────────────────── */}
        {isVisible(layers, 'landscape') && (
          <div className="layer-landscape">
            <svg className="landscape-svg" viewBox="0 0 540 200" preserveAspectRatio="xMidYMax meet">
              <defs>
                <linearGradient id="sunGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FF6B1A" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#FF6B1A" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Sun glow */}
              <ellipse cx="420" cy="200" rx="120" ry="80" fill="url(#sunGlow)" />
              <circle cx="420" cy="180" r="28" fill="#FF6B1A" opacity="0.9" />
              {/* Mountains */}
              <polygon points="0,200 80,80 160,200" fill="#1a1a1a" />
              <polygon points="60,200 160,50 260,200" fill="#222" />
              <polygon points="160,200 280,70 400,200" fill="#1a1a1a" />
              <polygon points="300,200 400,100 540,200" fill="#222" />
              {/* Road */}
              <polygon points="220,200 240,130 300,130 320,200" fill="#111" opacity="0.8" />
              <line x1="260" y1="130" x2="260" y2="200" stroke="#FF6B1A" strokeWidth="2" opacity="0.5" strokeDasharray="8,8" />
            </svg>
          </div>
        )}

        {/* ── DÍA title ───────────────────────────────────────────────── */}
        {isVisible(layers, 'day-title') && (
          <div className="layer-day-title">
            <div className="dia-label">DÍA</div>
            <div className="dia-number">
              <span className="current-day">{challenge.currentDay}</span>
              <span className="dia-total">/{challenge.totalDays}</span>
            </div>
          </div>
        )}

        {/* ── Day text ────────────────────────────────────────────────── */}
        {isVisible(layers, 'day-text') && (
          <div className="layer-day-text">
            <div className="day-title-text">
              {content.titleLine1}
              {content.titleLine2 && <><br />{content.titleLine2}</>}
            </div>
            <div className="day-description">{content.description}</div>
          </div>
        )}

        {/* ── Closing phrase ──────────────────────────────────────────── */}
        {isVisible(layers, 'closing-phrase') && (
          <div className="layer-closing-phrase">
            <div className="closing-text">{content.closingPhrase}</div>
          </div>
        )}
      </div>
    );
  },
);

PostCanvas.displayName = 'PostCanvas';
export default PostCanvas;
