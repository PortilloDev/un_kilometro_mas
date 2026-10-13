import { useState, useCallback, useRef } from 'react';
import type { PostState, Layer, LayerId, ElementTransform } from '../model/types';
import { DEFAULT_STATE, DEFAULT_LAYERS } from '../model/types';

const STORAGE_KEY = 'ukm_post_state';
const LAYERS_KEY = 'ukm_layers';
const HISTORY_MAX = 50;
const HISTORY_DEBOUNCE = 800;

function loadState(): PostState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_STATE;
}

function loadLayers(): Layer[] {
  try {
    const raw = localStorage.getItem(LAYERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_LAYERS;
}

interface HistoryEntry { state: PostState; layers: Layer[] }

export function usePostState() {
  const [state, setStateInternal] = useState<PostState>(loadState);
  const [layers, setLayersInternal] = useState<Layer[]>(loadLayers);

  const stateRef = useRef(state);
  const layersRef = useRef(layers);
  const historyRef = useRef<HistoryEntry[]>([{ state: loadState(), layers: loadLayers() }]);
  const historyIdxRef = useRef(0);
  const isRestoringRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function scheduleSnapshot() {
    if (isRestoringRef.current) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const entry: HistoryEntry = { state: stateRef.current, layers: layersRef.current };
      const trimmed = historyRef.current.slice(0, historyIdxRef.current + 1);
      trimmed.push(entry);
      if (trimmed.length > HISTORY_MAX) trimmed.shift();
      historyRef.current = trimmed;
      historyIdxRef.current = trimmed.length - 1;
    }, HISTORY_DEBOUNCE);
  }

  const setState = useCallback((updater: (prev: PostState) => PostState) => {
    setStateInternal((prev) => {
      const next = updater(prev);
      stateRef.current = next;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      scheduleSnapshot();
      return next;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLayers = useCallback((updater: (prev: Layer[]) => Layer[]) => {
    setLayersInternal((prev) => {
      const next = updater(prev);
      layersRef.current = next;
      localStorage.setItem(LAYERS_KEY, JSON.stringify(next));
      scheduleSnapshot();
      return next;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const undo = useCallback(() => {
    if (historyIdxRef.current <= 0) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    isRestoringRef.current = true;
    historyIdxRef.current--;
    const entry = historyRef.current[historyIdxRef.current];
    stateRef.current = entry.state;
    layersRef.current = entry.layers;
    setStateInternal(entry.state);
    setLayersInternal(entry.layers);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entry.state));
    localStorage.setItem(LAYERS_KEY, JSON.stringify(entry.layers));
    setTimeout(() => { isRestoringRef.current = false; }, 50);
  }, []);

  const redo = useCallback(() => {
    if (historyIdxRef.current >= historyRef.current.length - 1) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    isRestoringRef.current = true;
    historyIdxRef.current++;
    const entry = historyRef.current[historyIdxRef.current];
    stateRef.current = entry.state;
    layersRef.current = entry.layers;
    setStateInternal(entry.state);
    setLayersInternal(entry.layers);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entry.state));
    localStorage.setItem(LAYERS_KEY, JSON.stringify(entry.layers));
    setTimeout(() => { isRestoringRef.current = false; }, 50);
  }, []);

  const canUndo = useCallback(() => historyIdxRef.current > 0, []);
  const canRedo = useCallback(() => historyIdxRef.current < historyRef.current.length - 1, []);

  const loadSnapshot = useCallback((s: PostState, ls: Layer[]) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    isRestoringRef.current = true;
    stateRef.current = s;
    layersRef.current = ls;
    setStateInternal(s);
    setLayersInternal(ls);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    localStorage.setItem(LAYERS_KEY, JSON.stringify(ls));
    historyRef.current = [{ state: s, layers: ls }];
    historyIdxRef.current = 0;
    setTimeout(() => { isRestoringRef.current = false; }, 50);
  }, []);

  const updateStats = useCallback(
    (field: string, value: string) =>
      setState((s) => ({ ...s, stats: { ...s.stats, [field]: value } })),
    [setState],
  );

  const updateChallenge = useCallback(
    (field: string, value: string | number) =>
      setState((s) => ({ ...s, challenge: { ...s.challenge, [field]: value } })),
    [setState],
  );

  const updateContent = useCallback(
    (field: string, value: string) =>
      setState((s) => ({ ...s, content: { ...s.content, [field]: value } })),
    [setState],
  );

  const setHeroImage = useCallback(
    (src: string | null) => setState((s) => ({ ...s, heroImage: src })),
    [setState],
  );

  const setMapImage = useCallback(
    (src: string | null) => setState((s) => ({ ...s, mapImage: src })),
    [setState],
  );

  const toggleLayer = useCallback(
    (id: string) =>
      setLayers((ls) =>
        ls.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)),
      ),
    [setLayers],
  );

  const toggleLock = useCallback(
    (id: string) =>
      setLayers((ls) =>
        ls.map((l) => (l.id === id ? { ...l, locked: !l.locked } : l)),
      ),
    [setLayers],
  );

  const moveLayer = useCallback(
    (id: string, direction: 'up' | 'down') =>
      setLayers((ls) => {
        const idx = ls.findIndex((l) => l.id === id);
        if (idx < 0) return ls;
        const next = [...ls];
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= next.length) return ls;
        [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
        return next;
      }),
    [setLayers],
  );

  const resetToDefault = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LAYERS_KEY);
    stateRef.current = DEFAULT_STATE;
    layersRef.current = DEFAULT_LAYERS;
    setStateInternal(DEFAULT_STATE);
    setLayersInternal(DEFAULT_LAYERS);
    historyRef.current = [{ state: DEFAULT_STATE, layers: DEFAULT_LAYERS }];
    historyIdxRef.current = 0;
  }, []);

  const updateTransform = useCallback(
    (id: LayerId, t: ElementTransform) =>
      setState((s) => ({ ...s, transforms: { ...s.transforms, [id]: t } })),
    [setState],
  );

  const resetTransform = useCallback(
    (id: LayerId) =>
      setState((s) => {
        const next = { ...s.transforms };
        delete next[id];
        return { ...s, transforms: next };
      }),
    [setState],
  );

  const advanceDay = useCallback(() => {
    setState((s) => {
      const next = s.challenge.currentDay + 1;
      if (next > s.challenge.totalDays) return s;
      return { ...s, challenge: { ...s.challenge, currentDay: next } };
    });
  }, [setState]);

  return {
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
  };
}
