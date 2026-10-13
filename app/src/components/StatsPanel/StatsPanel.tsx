import { useRef, useState, useEffect } from 'react';
import type { PostState, LayerId, ElementTransform } from '../../model/types';
import './StatsPanel.css';

interface Props {
  state: PostState;
  selectedLayer: string | null;
  onUpdateStats: (field: string, value: string) => void;
  onUpdateChallenge: (field: string, value: string | number) => void;
  onUpdateContent: (field: string, value: string) => void;
  onSetHeroImage: (src: string | null) => void;
  onSetMapImage: (src: string | null) => void;
  onToggleCalories: () => void;
  onToggleElevation: () => void;
  onToggleTemperature: () => void;
  onAdvanceDay: () => void;
  onUpdateTransform: (id: LayerId, t: ElementTransform) => void;
  onResetTransform: (id: LayerId) => void;
}

type Tab = 'propiedades' | 'reto' | 'estadisticas' | 'texto' | 'imagenes';

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target!.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const LAYER_NAMES: Record<string, string> = {
  'hero-image': 'Fotografía principal',
  logo: 'Logotipo',
  'reto-title': 'Título del reto',
  'stats-card': 'Tarjeta de estadísticas',
  'day-title': 'DÍA X/100',
  'day-text': 'Texto del día',
  'closing-phrase': 'Frase de cierre',
  landscape: 'Paisaje (fondo)',
};

export default function StatsPanel({
  state,
  selectedLayer,
  onUpdateStats,
  onUpdateChallenge,
  onUpdateContent,
  onSetHeroImage,
  onSetMapImage,
  onToggleCalories,
  onToggleElevation,
  onToggleTemperature,
  onAdvanceDay,
  onUpdateTransform,
  onResetTransform,
}: Props) {
  const [tab, setTab] = useState<Tab>('reto');
  const heroInputRef = useRef<HTMLInputElement>(null);
  const mapInputRef = useRef<HTMLInputElement>(null);

  /* Auto-switch to Propiedades when a layer is selected on canvas */
  useEffect(() => {
    if (selectedLayer) setTab('propiedades');
  }, [selectedLayer]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, type: 'hero' | 'map') {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataURL(file);
    if (type === 'hero') onSetHeroImage(dataUrl);
    else onSetMapImage(dataUrl);
    e.target.value = '';
  }

  const { challenge, stats, content } = state;

  const activeTransform = selectedLayer ? (state.transforms[selectedLayer as LayerId] ?? { x: 0, y: 0, opacity: 1 }) : null;

  return (
    <div className="stats-panel">
      <div className="panel-tabs">
        <button
          className={`panel-tab${tab === 'propiedades' ? ' active' : ''}${selectedLayer ? ' tab-has-selection' : ''}`}
          onClick={() => setTab('propiedades')}
          title="Propiedades del elemento seleccionado"
        >
          {selectedLayer ? '✦ Props' : 'Props'}
        </button>
        <button className={`panel-tab${tab === 'reto' ? ' active' : ''}`} onClick={() => setTab('reto')}>Reto</button>
        <button className={`panel-tab${tab === 'estadisticas' ? ' active' : ''}`} onClick={() => setTab('estadisticas')}>Stats</button>
        <button className={`panel-tab${tab === 'texto' ? ' active' : ''}`} onClick={() => setTab('texto')}>Texto</button>
        <button className={`panel-tab${tab === 'imagenes' ? ' active' : ''}`} onClick={() => setTab('imagenes')}>Fotos</button>
      </div>

      <div className="panel-scroll">

        {/* ── PROPIEDADES tab ───────────────────────────────────────── */}
        {tab === 'propiedades' && (
          <>
            {!selectedLayer ? (
              <div className="props-empty">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <p>Haz clic sobre cualquier elemento del lienzo para seleccionarlo y editar sus propiedades.</p>
              </div>
            ) : (
              <>
                <div className="panel-section">
                  <div className="panel-section-title">
                    {LAYER_NAMES[selectedLayer] ?? selectedLayer}
                  </div>

                  <div className="field-row">
                    <div className="field">
                      <label>Desplazamiento X</label>
                      <input
                        type="number"
                        step="1"
                        value={Math.round(activeTransform!.x)}
                        onChange={(e) =>
                          onUpdateTransform(selectedLayer as LayerId, {
                            ...activeTransform!,
                            x: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="field">
                      <label>Desplazamiento Y</label>
                      <input
                        type="number"
                        step="1"
                        value={Math.round(activeTransform!.y)}
                        onChange={(e) =>
                          onUpdateTransform(selectedLayer as LayerId, {
                            ...activeTransform!,
                            y: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="panel-section">
                  <div className="panel-section-title">Opacidad</div>
                  <div className="opacity-row">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={activeTransform!.opacity}
                      className="opacity-slider"
                      onChange={(e) =>
                        onUpdateTransform(selectedLayer as LayerId, {
                          ...activeTransform!,
                          opacity: Number(e.target.value),
                        })
                      }
                    />
                    <span className="opacity-value">
                      {Math.round(activeTransform!.opacity * 100)}%
                    </span>
                  </div>
                </div>

                <div className="panel-section">
                  <button
                    className="image-upload-btn"
                    onClick={() => onResetTransform(selectedLayer as LayerId)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="1 4 1 10 7 10" />
                      <path d="M3.51 15a9 9 0 1 0 .49-4.87L1 10" />
                    </svg>
                    Restablecer posición y opacidad
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* ── RETO tab ──────────────────────────────────────────────── */}
        {tab === 'reto' && (
          <>
            <div className="panel-section">
              <div className="panel-section-title">Contador del reto</div>
              <div className="challenge-counter">
                <button
                  className="counter-btn"
                  onClick={() => {
                    if (challenge.currentDay > 1)
                      onUpdateChallenge('currentDay', challenge.currentDay - 1);
                  }}
                >−</button>
                <div className="counter-display">
                  {challenge.currentDay}
                  <span className="counter-total">/{challenge.totalDays}</span>
                </div>
                <button
                  className="counter-btn"
                  onClick={() => {
                    if (challenge.currentDay < challenge.totalDays)
                      onUpdateChallenge('currentDay', challenge.currentDay + 1);
                  }}
                >+</button>
              </div>
              <button className="advance-btn" onClick={onAdvanceDay}>
                Avanzar al día siguiente →
              </button>
            </div>

            <div className="panel-section">
              <div className="panel-section-title">Configuración</div>
              <div className="field-row">
                <div className="field">
                  <label>Día actual</label>
                  <input
                    type="number"
                    min={1}
                    max={challenge.totalDays}
                    value={challenge.currentDay}
                    onChange={(e) => onUpdateChallenge('currentDay', parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="field">
                  <label>Total días</label>
                  <input
                    type="number"
                    min={1}
                    value={challenge.totalDays}
                    onChange={(e) => onUpdateChallenge('totalDays', parseInt(e.target.value) || 100)}
                  />
                </div>
              </div>
              <div className="field">
                <label>Objetivo diario</label>
                <input
                  type="text"
                  value={challenge.dailyGoal}
                  onChange={(e) => onUpdateChallenge('dailyGoal', e.target.value)}
                />
              </div>
            </div>
          </>
        )}

        {/* ── ESTADÍSTICAS tab ──────────────────────────────────────── */}
        {tab === 'estadisticas' && (
          <>
            <div className="panel-section">
              <div className="panel-section-title">Fecha y lugar</div>
              <div className="field-row">
                <div className="field">
                  <label>Fecha</label>
                  <input
                    type="text"
                    placeholder="13 Oct"
                    value={stats.date}
                    onChange={(e) => onUpdateStats('date', e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>Hora</label>
                  <input
                    type="text"
                    placeholder="05:15"
                    value={stats.time}
                    onChange={(e) => onUpdateStats('time', e.target.value)}
                  />
                </div>
              </div>
              <div className="field">
                <label>Localización</label>
                <input
                  type="text"
                  placeholder="Fuenlabrada"
                  value={stats.location}
                  onChange={(e) => onUpdateStats('location', e.target.value)}
                />
              </div>
            </div>

            <div className="panel-section">
              <div className="panel-section-title">Datos del entrenamiento</div>
              <div className="field-row">
                <div className="field">
                  <label>Distancia (km)</label>
                  <input
                    type="text"
                    placeholder="5.19"
                    value={stats.distance}
                    onChange={(e) => onUpdateStats('distance', e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>Tiempo total</label>
                  <input
                    type="text"
                    placeholder="31:07"
                    value={stats.duration}
                    onChange={(e) => onUpdateStats('duration', e.target.value)}
                  />
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Ritmo (min/km)</label>
                  <input
                    type="text"
                    placeholder="6:00"
                    value={stats.pace}
                    onChange={(e) => onUpdateStats('pace', e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>Frec. cardíaca</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={stats.heartRate}
                    onChange={(e) => onUpdateStats('heartRate', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="panel-section">
              <div className="panel-section-title">Opcionales</div>

              <div className="toggle-row">
                <span className="toggle-label">Mostrar calorías</span>
                <label className="toggle">
                  <input type="checkbox" checked={state.showCalories} onChange={onToggleCalories} />
                  <span className="toggle-slider" />
                </label>
              </div>
              {state.showCalories && (
                <div className="field">
                  <label>Calorías</label>
                  <input
                    type="text"
                    placeholder="343"
                    value={stats.calories}
                    onChange={(e) => onUpdateStats('calories', e.target.value)}
                  />
                </div>
              )}

              <div className="toggle-row">
                <span className="toggle-label">Mostrar desnivel</span>
                <label className="toggle">
                  <input type="checkbox" checked={state.showElevation} onChange={onToggleElevation} />
                  <span className="toggle-slider" />
                </label>
              </div>
              {state.showElevation && (
                <div className="field">
                  <label>Desnivel positivo (m)</label>
                  <input
                    type="text"
                    placeholder="45"
                    value={stats.elevation}
                    onChange={(e) => onUpdateStats('elevation', e.target.value)}
                  />
                </div>
              )}

              <div className="toggle-row">
                <span className="toggle-label">Mostrar temperatura</span>
                <label className="toggle">
                  <input type="checkbox" checked={state.showTemperature} onChange={onToggleTemperature} />
                  <span className="toggle-slider" />
                </label>
              </div>
              {state.showTemperature && (
                <div className="field">
                  <label>Temperatura (°C)</label>
                  <input
                    type="text"
                    placeholder="14"
                    value={stats.temperature}
                    onChange={(e) => onUpdateStats('temperature', e.target.value)}
                  />
                </div>
              )}
            </div>
          </>
        )}

        {/* ── TEXTO tab ──────────────────────────────────────────────── */}
        {tab === 'texto' && (
          <>
            <div className="panel-section">
              <div className="panel-section-title">Título del día</div>
              <div className="field">
                <label>Primera línea</label>
                <input
                  type="text"
                  value={content.titleLine1}
                  onChange={(e) => onUpdateContent('titleLine1', e.target.value)}
                />
              </div>
              <div className="field">
                <label>Segunda línea</label>
                <input
                  type="text"
                  value={content.titleLine2}
                  onChange={(e) => onUpdateContent('titleLine2', e.target.value)}
                />
              </div>
            </div>

            <div className="panel-section">
              <div className="panel-section-title">Descripción</div>
              <div className="field">
                <textarea
                  value={content.description}
                  onChange={(e) => onUpdateContent('description', e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <div className="panel-section">
              <div className="panel-section-title">Frase de cierre</div>
              <div className="field">
                <input
                  type="text"
                  value={content.closingPhrase}
                  onChange={(e) => onUpdateContent('closingPhrase', e.target.value)}
                />
              </div>
            </div>
          </>
        )}

        {/* ── IMÁGENES tab ───────────────────────────────────────────── */}
        {tab === 'imagenes' && (
          <>
            <div className="panel-section">
              <div className="panel-section-title">Fotografía principal</div>
              {state.heroImage && (
                <img className="image-thumb" src={state.heroImage} alt="Hero preview" />
              )}
              <input
                ref={heroInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                style={{ display: 'none' }}
                onChange={(e) => handleImageUpload(e, 'hero')}
              />
              <button className="image-upload-btn" onClick={() => heroInputRef.current?.click()}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                {state.heroImage ? 'Cambiar fotografía' : 'Subir fotografía (PNG/JPG/WebP)'}
              </button>
              {state.heroImage && (
                <button className="image-upload-btn" style={{ marginTop: 6 }} onClick={() => onSetHeroImage(null)}>
                  Eliminar fotografía
                </button>
              )}
            </div>

            <div className="panel-section">
              <div className="panel-section-title">Captura del mapa</div>
              {state.mapImage && (
                <img className="image-thumb" src={state.mapImage} alt="Map preview" />
              )}
              <input
                ref={mapInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                style={{ display: 'none' }}
                onChange={(e) => handleImageUpload(e, 'map')}
              />
              <button className="image-upload-btn" onClick={() => mapInputRef.current?.click()}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                {state.mapImage ? 'Cambiar mapa' : 'Subir captura del mapa (PNG/JPG/WebP)'}
              </button>
              {state.mapImage && (
                <button className="image-upload-btn" style={{ marginTop: 6 }} onClick={() => onSetMapImage(null)}>
                  Eliminar mapa
                </button>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
