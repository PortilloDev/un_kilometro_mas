import { useRef, useState, useCallback, useEffect } from 'react';
import type { ExportRatio } from './export/exportImage';
import { usePostState } from './hooks/usePostState';
import PostCanvas from './components/PostCanvas/PostCanvas';
import Toolbar from './components/Toolbar/Toolbar';
import LayersPanel from './components/LayersPanel/LayersPanel';
import StatsPanel from './components/StatsPanel/StatsPanel';
import './App.css';

export default function App() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [ratio, setRatio] = useState<ExportRatio>('4:5');
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [canvasScale, setCanvasScale] = useState(0.5);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const mapInputRef = useRef<HTMLInputElement>(null);

  const {
    state,
    layers,
    updateStats,
    updateChallenge,
    updateContent,
    setHeroImage,
    setMapImage,
    toggleLayer,
    toggleLock,
    moveLayer,
    resetToDefault,
    advanceDay,
    updateTransform,
    resetTransform,
    setState,
  } = usePostState();

  const CANVAS_W = 1080;
  const CANVAS_H = ratio === '4:5' ? 1350 : 1080;

  /* Scale the canvas to fit the viewport */
  useEffect(() => {
    function compute() {
      if (!viewportRef.current) return;
      const vw = viewportRef.current.clientWidth - 32;
      const vh = viewportRef.current.clientHeight - 32;
      const scale = Math.min(vw / CANVAS_W, vh / CANVAS_H, 1);
      setCanvasScale(Math.max(scale, 0.1));
    }
    compute();
    const ro = new ResizeObserver(compute);
    if (viewportRef.current) ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, [CANVAS_H, CANVAS_W]);

  const toggleCalories = useCallback(
    () => setState((s) => ({ ...s, showCalories: !s.showCalories })),
    [setState],
  );
  const toggleElevation = useCallback(
    () => setState((s) => ({ ...s, showElevation: !s.showElevation })),
    [setState],
  );
  const toggleTemperature = useCallback(
    () => setState((s) => ({ ...s, showTemperature: !s.showTemperature })),
    [setState],
  );

  function handleReset() {
    if (confirm('¿Restablecer la plantilla a los valores iniciales? Se perderán los cambios no guardados.')) {
      resetToDefault();
    }
  }

  function handleSave() {
    /* State is already persisted to localStorage in real-time via usePostState */
    const btn = document.activeElement as HTMLElement;
    btn?.blur();
  }

  const scaledW = Math.round(CANVAS_W * canvasScale);
  const scaledH = Math.round(CANVAS_H * canvasScale);

  return (
    <div className="app">
      <Toolbar
        canvasRef={canvasRef}
        currentDay={state.challenge.currentDay}
        ratio={ratio}
        onRatioChange={setRatio}
        onReset={handleReset}
        onSave={handleSave}
      />

      <div className="editor-body">
        <LayersPanel
          layers={layers}
          selectedLayer={selectedLayer}
          onSelect={setSelectedLayer}
          onToggleVisible={toggleLayer}
          onToggleLock={toggleLock}
          onMove={moveLayer}
        />

        {/* Central canvas viewport */}
        <div className="canvas-viewport" ref={viewportRef}>
          <div
            className="canvas-scale-wrapper"
            style={{
              width: scaledW,
              height: scaledH,
              position: 'relative',
            }}
          >
            <div
              style={{
                transform: `scale(${canvasScale})`,
                transformOrigin: 'top left',
                width: CANVAS_W,
                height: CANVAS_H,
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            >
              <PostCanvas
                ref={canvasRef}
                state={state}
                layers={layers}
                selectedLayer={selectedLayer}
                canvasScale={canvasScale}
                onHeroClick={() => heroInputRef.current?.click()}
                onMapClick={() => mapInputRef.current?.click()}
                onSelectLayer={setSelectedLayer}
                onTransformChange={updateTransform}
              />
            </div>
          </div>
        </div>

        <StatsPanel
          state={state}
          selectedLayer={selectedLayer}
          onUpdateStats={updateStats}
          onUpdateChallenge={updateChallenge}
          onUpdateContent={updateContent}
          onSetHeroImage={setHeroImage}
          onSetMapImage={setMapImage}
          onToggleCalories={toggleCalories}
          onToggleElevation={toggleElevation}
          onToggleTemperature={toggleTemperature}
          onAdvanceDay={advanceDay}
          onUpdateTransform={updateTransform}
          onResetTransform={resetTransform}
        />
      </div>

      {/* Hidden file inputs triggered from canvas placeholders */}
      <input
        ref={heroInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        style={{ display: 'none' }}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (ev) => setHeroImage(ev.target!.result as string);
          reader.readAsDataURL(file);
          e.target.value = '';
        }}
      />
      <input
        ref={mapInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        style={{ display: 'none' }}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (ev) => setMapImage(ev.target!.result as string);
          reader.readAsDataURL(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}
