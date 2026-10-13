import { useRef } from 'react';
import { exportPost } from '../../export/exportImage';
import type { ExportFormat, ExportRatio } from '../../export/exportImage';
import './Toolbar.css';

interface Props {
  canvasRef: React.RefObject<HTMLDivElement | null>;
  currentDay: number;
  ratio: ExportRatio;
  onRatioChange: (r: ExportRatio) => void;
  onReset: () => void;
  onSave: () => void;
}

export default function Toolbar({ canvasRef, currentDay, ratio, onRatioChange, onReset, onSave }: Props) {
  const exportingRef = useRef(false);

  async function handleExport(format: ExportFormat) {
    if (!canvasRef.current || exportingRef.current) return;
    exportingRef.current = true;
    try {
      await exportPost(canvasRef.current, ratio, format, currentDay);
    } catch (e) {
      console.error('Error al exportar:', e);
      alert('Error al exportar la imagen. Inténtalo de nuevo.');
    } finally {
      exportingRef.current = false;
    }
  }

  return (
    <div className="toolbar">
      <div className="toolbar-brand">
        <span className="toolbar-brand-name">Un Kilómetro Más</span>
        <span className="toolbar-brand-sub">Editor de publicaciones</span>
      </div>

      <div className="toolbar-divider" />

      <button className="toolbar-btn" onClick={onSave} title="Guardar cambios">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </svg>
        Guardar
      </button>

      <button className="toolbar-btn danger" onClick={onReset} title="Restablecer plantilla">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 .49-4.87L1 10" />
        </svg>
        Restablecer
      </button>

      <div className="toolbar-divider" />

      <select
        className="toolbar-select"
        value={ratio}
        onChange={(e) => onRatioChange(e.target.value as ExportRatio)}
        title="Formato de salida"
      >
        <option value="4:5">4:5 — 1080×1350</option>
        <option value="1:1">1:1 — 1080×1080</option>
      </select>

      <div className="toolbar-spacer" />

      <button className="toolbar-btn" onClick={() => handleExport('jpeg')} title="Exportar como JPEG">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        JPEG
      </button>

      <button className="toolbar-btn primary" onClick={() => handleExport('png')} title="Exportar como PNG">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Exportar PNG
      </button>
    </div>
  );
}
