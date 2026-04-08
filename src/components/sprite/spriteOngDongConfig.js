/** Thư mục trong public (Vite serve từ root) */
export const SPRITE_ONG_DONG_BASE_PATH = "/animations/01_22 ong dong";

/** Pattern: 01_22 ong dong_00001.webp */
export const SPRITE_ONG_DONG_FILE_PREFIX = "01_22 ong dong_";

/**
 * Số frame WebP có trong thư mục (chỉnh cho khớp asset thật).
 * Ví dụ 00001–00120 → 120.
 */
export const SPRITE_ONG_DONG_FRAME_COUNT = 59;

export function getSpriteOngDongFrameUrl(index) {
  const n = Math.max(0, Math.floor(index));
  const padded = String(n + 1).padStart(5, "0");
  const rel = `${SPRITE_ONG_DONG_BASE_PATH}/${SPRITE_ONG_DONG_FILE_PREFIX}${padded}.webp`;
  return encodeURI(rel);
}

export function getSpriteOngDongFrameUrls(
  frameCount = SPRITE_ONG_DONG_FRAME_COUNT,
) {
  return Array.from({ length: frameCount }, (_, i) =>
    getSpriteOngDongFrameUrl(i),
  );
}
