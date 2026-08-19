import { formatTime } from './format';

export interface ShareCardOptions {
  appName: string;
  levelTitle: string;
  timeSec: number;
  isNewRecord: boolean;
}

const CARD_SIZE = 1080;
const ORANGE = '#f2600c';
const BLACK = '#141414';

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Draws a branded "achievement card" (orange/black, same palette as the overlay) and
 *  returns it as a PNG blob, so the share buttons can attach an actual image instead of
 *  just text — url-based share intents (wa.me, twitter/facebook intents) can't carry
 *  images without a server, so this is only usable via the Web Share API's `files`. */
export function renderShareCard(options: ShareCardOptions): Promise<Blob> {
  const { appName, levelTitle, timeSec, isNewRecord } = options;
  const canvas = document.createElement('canvas');
  canvas.width = CARD_SIZE;
  canvas.height = CARD_SIZE;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = ORANGE;
  ctx.fillRect(0, 0, CARD_SIZE, CARD_SIZE);
  ctx.textAlign = 'center';
  ctx.fillStyle = BLACK;

  ctx.font = 'bold 56px sans-serif';
  ctx.fillText(appName.toUpperCase(), CARD_SIZE / 2, 140);

  ctx.font = 'bold 84px sans-serif';
  let y = 340;
  for (const line of wrapLines(ctx, '¡Nivel completado!', 920)) {
    ctx.fillText(line, CARD_SIZE / 2, y);
    y += 96;
  }

  ctx.font = '52px sans-serif';
  ctx.globalAlpha = 0.75;
  y += 40;
  for (const line of wrapLines(ctx, levelTitle, 920)) {
    ctx.fillText(line, CARD_SIZE / 2, y);
    y += 62;
  }
  ctx.globalAlpha = 1;

  ctx.font = 'bold 100px sans-serif';
  y += 90;
  ctx.fillText(formatTime(timeSec), CARD_SIZE / 2, y);

  if (isNewRecord) {
    ctx.font = 'bold 44px sans-serif';
    const badgeText = '🏆 ¡Nuevo récord!';
    const badgeWidth = ctx.measureText(badgeText).width + 80;
    const badgeY = y + 70;
    ctx.fillStyle = 'rgba(20, 20, 20, 0.12)';
    const radius = 40;
    const x = CARD_SIZE / 2 - badgeWidth / 2;
    ctx.beginPath();
    ctx.roundRect(x, badgeY, badgeWidth, radius * 2, radius);
    ctx.fill();
    ctx.fillStyle = BLACK;
    ctx.fillText(badgeText, CARD_SIZE / 2, badgeY + radius + 16);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('canvas.toBlob returned null'))), 'image/png');
  });
}
