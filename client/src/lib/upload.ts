import { api } from './api';

/** Shrinks an image in the browser (so uploads stay small), then uploads it. Returns its URL. */
export async function uploadImage(file: File, maxSide: number): Promise<string> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) throw new Error('Choose a JPG, PNG or WebP image.');

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Your browser can’t process images.');
  ctx.fillStyle = '#ffffff'; // JPEG has no transparency; use white behind transparent PNGs
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
  const { url } = await api<{ url: string }>('/me/images', { method: 'POST', body: { dataUrl } });
  return url;
}
