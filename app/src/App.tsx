import { useRef, useState, useCallback, useEffect } from 'react';
import type { ExportRatio } from './export/exportImage';
import { usePostState } from './hooks/usePostState';
import PostCanvas from './components/PostCanvas/PostCanvas';
import Toolbar from './components/Toolbar/Toolbar';
import LayersPanel from './components/LayersPanel/LayersPanel';
import StatsPanel from './components/StatsPanel/StatsPanel';
import ProjectsDialog from './components/ProjectsDialog/ProjectsDialog';
import Toast from './components/Toast/Toast';
import type { ToastData } from './components/Toast/Toast';
import './App.css';

export default function App() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [ratio, setRatio] = useState<ExportRatio>('4:5');
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [canvasScale, setCanvasScale] = useState(0.5);
  const [showProjects, setShowProjects] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Render counter forces undo/redo button states to recompute on each render
  const [, forceUpdate] = useState(0);
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
    undo,
    redo,
    canUndo,
    canRedo,
    loadSnapshot,
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

  function showToast(message: string, type: ToastData['type']) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, type });
    toastTimerRef.current = setTimeout(() => setToast(null), 4000);
  }

  /* Keyboard shortcuts: Cmd/Ctrl+Z undo, Cmd/Ctrl+Shift+Z redo, Cmd/Ctrl+S save */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey;
      if (!meta) return;
      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        forceUpdate((n) => n + 1);
      } else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
        e.preventDefault();
        redo();
        forceUpdate((n) => n + 1);
      } else if (e.key === 's') {
        e.preventDefault();
        setShowProjects(true);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [undo, redo]);

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
      forceUpdate((n) => n + 1);
    }
  }

  function handleUndo() {
    undo();
    forceUpdate((n) => n + 1);
  }

  function handleRedo() {
    redo();
    forceUpdate((n) => n + 1);
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
        onSave={() => setShowProjects(true)}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo()}
        canRedo={canRedo()}
        onOpenProjects={() => setShowProjects(true)}
        onExportSuccess={(f) => showToast(`Imagen exportada: ${f}`, 'success')}
        onExportError={(msg) => showToast(msg, 'error')}
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

      {showProjects && (
        <ProjectsDialog
          currentState={state}
          currentLayers={layers}
          onLoad={(s, ls) => { loadSnapshot(s, ls); forceUpdate((n) => n + 1); }}
          onClose={() => setShowProjects(false)}
        />
      )}

      <Toast toast={toast} />

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
