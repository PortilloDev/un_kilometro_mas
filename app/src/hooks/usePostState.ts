import { useState, useCallback } from 'react';
import type { PostState, Layer } from '../model/types';
import { DEFAULT_STATE, DEFAULT_LAYERS } from '../model/types';

const STORAGE_KEY = 'ukm_post_state';
const LAYERS_KEY = 'ukm_layers';

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

export function usePostState() {
  const [state, setStateInternal] = useState<PostState>(loadState);
  const [layers, setLayersInternal] = useState<Layer[]>(loadLayers);

  const setState = useCallback((updater: (prev: PostState) => PostState) => {
    setStateInternal((prev) => {
      const next = updater(prev);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const setLayers = useCallback((updater: (prev: Layer[]) => Layer[]) => {
    setLayersInternal((prev) => {
      const next = updater(prev);
      localStorage.setItem(LAYERS_KEY, JSON.stringify(next));
      return next;
    });
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
    setStateInternal(DEFAULT_STATE);
    setLayersInternal(DEFAULT_LAYERS);
  }, []);

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
    setState,
  };
}
