import type { Layer } from '../../model/types';
import './LayersPanel.css';

interface Props {
  layers: Layer[];
  selectedLayer: string | null;
  onSelect: (id: string) => void;
  onToggleVisible: (id: string) => void;
  onToggleLock: (id: string) => void;
  onMove: (id: string, dir: 'up' | 'down') => void;
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function LockIcon({ locked }: { locked: boolean }) {
  return locked ? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  );
}

export default function LayersPanel({ layers, selectedLayer, onSelect, onToggleVisible, onToggleLock, onMove }: Props) {
  return (
    <div className="layers-panel">
      <div className="panel-header">Capas</div>
      <ul className="layers-list">
        {layers.map((layer, idx) => (
          <li
            key={layer.id}
            className={`layer-item${selectedLayer === layer.id ? ' selected' : ''}${!layer.visible ? ' hidden' : ''}`}
            onClick={() => onSelect(layer.id)}
          >
            <button
              className={`layer-icon-btn${layer.visible ? '' : ' active'}`}
              onClick={(e) => { e.stopPropagation(); onToggleVisible(layer.id); }}
              title={layer.visible ? 'Ocultar capa' : 'Mostrar capa'}
            >
              <EyeIcon open={layer.visible} />
            </button>

            <button
              className={`layer-icon-btn${layer.locked ? ' active' : ''}`}
              onClick={(e) => { e.stopPropagation(); onToggleLock(layer.id); }}
              title={layer.locked ? 'Desbloquear capa' : 'Bloquear capa'}
            >
              <LockIcon locked={layer.locked} />
            </button>

            <span className="layer-name">{layer.name}</span>

            <div className="layer-reorder">
              <button
                onClick={(e) => { e.stopPropagation(); onMove(layer.id, 'up'); }}
                disabled={idx === 0}
                title="Subir capa"
              >▲</button>
              <button
                onClick={(e) => { e.stopPropagation(); onMove(layer.id, 'down'); }}
                disabled={idx === layers.length - 1}
                title="Bajar capa"
              >▼</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
