import { useState, useEffect, useRef } from 'react';
import type { PostState, Layer } from '../../model/types';
import { dbGetAll, dbSave, dbDelete } from '../../persistence/projectDB';
import type { SavedProject } from '../../persistence/projectDB';
import './ProjectsDialog.css';

interface Props {
  currentState: PostState;
  currentLayers: Layer[];
  onLoad: (state: PostState, layers: Layer[]) => void;
  onClose: () => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function ProjectsDialog({ currentState, currentLayers, onLoad, onClose }: Props) {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [saveName, setSaveName] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dbGetAll().then(setProjects).catch(console.error);
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function handleSave() {
    const name = saveName.trim();
    if (!name || saving) return;
    setSaving(true);
    const project: SavedProject = {
      id: `proj_${Date.now()}`,
      name,
      savedAt: new Date().toISOString(),
      state: currentState,
      layers: currentLayers,
    };
    try {
      await dbSave(project);
      const updated = await dbGetAll();
      setProjects(updated);
      setSaveName('');
    } catch (e) {
      console.error('Error al guardar proyecto:', e);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await dbDelete(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      console.error('Error al eliminar proyecto:', e);
    } finally {
      setConfirmDeleteId(null);
    }
  }

  function handleLoad(project: SavedProject) {
    onLoad(project.state, project.layers);
    onClose();
  }

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="projects-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2 className="dialog-title">Proyectos guardados</h2>
          <button className="dialog-close" onClick={onClose} title="Cerrar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Save current state */}
        <div className="dialog-save-row">
          <input
            ref={inputRef}
            className="dialog-name-input"
            type="text"
            placeholder="Nombre del proyecto..."
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
            maxLength={80}
          />
          <button
            className="dialog-save-btn"
            onClick={handleSave}
            disabled={!saveName.trim() || saving}
          >
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
        </div>

        {/* Project list */}
        <div className="dialog-list">
          {projects.length === 0 ? (
            <div className="dialog-empty">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
              <p>No hay proyectos guardados aún.</p>
            </div>
          ) : (
            projects.map((p) => (
              <div key={p.id} className="dialog-project-row">
                <div className="dialog-project-info">
                  <span className="dialog-project-name">{p.name}</span>
                  <span className="dialog-project-date">Día {p.state.challenge.currentDay} · {formatDate(p.savedAt)}</span>
                </div>
                <div className="dialog-project-actions">
                  <button className="dialog-load-btn" onClick={() => handleLoad(p)}>
                    Abrir
                  </button>
                  {confirmDeleteId === p.id ? (
                    <>
                      <button className="dialog-confirm-delete-btn" onClick={() => handleDelete(p.id)}>
                        Confirmar
                      </button>
                      <button className="dialog-cancel-btn" onClick={() => setConfirmDeleteId(null)}>
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button className="dialog-delete-btn" onClick={() => setConfirmDeleteId(p.id)} title="Eliminar">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
