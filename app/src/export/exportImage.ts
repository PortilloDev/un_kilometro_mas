import { toPng, toJpeg } from 'html-to-image';

export type ExportFormat = 'png' | 'jpeg';
export type ExportRatio = '4:5' | '1:1';

const DIMENSIONS: Record<ExportRatio, { width: number; height: number }> = {
  '4:5': { width: 1080, height: 1350 },
  '1:1': { width: 1080, height: 1080 },
};

export async function exportPost(
  canvasEl: HTMLElement,
  ratio: ExportRatio = '4:5',
  format: ExportFormat = 'png',
  dayNumber: number = 1,
): Promise<void> {
  const { width, height } = DIMENSIONS[ratio];

  // Hide selection outline and cursor indicators during capture
  canvasEl.classList.add('exporting');

  const options = {
    width,
    height,
    pixelRatio: 1,
    style: {
      transform: 'scale(1)',
      transformOrigin: 'top left',
      width: `${width}px`,
      height: `${height}px`,
    },
    skipFonts: false,
  };

  const day = String(dayNumber).padStart(3, '0');
  const filename = `un-kilometro-mas-dia-${day}.${format}`;

  try {
    let dataUrl: string;
    if (format === 'jpeg') {
      dataUrl = await toJpeg(canvasEl, { ...options, quality: 0.95 });
    } else {
      dataUrl = await toPng(canvasEl, options);
    }

    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } finally {
    canvasEl.classList.remove('exporting');
  }
}
