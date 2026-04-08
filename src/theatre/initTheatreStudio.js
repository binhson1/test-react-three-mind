import studio from "@theatre/studio";
import r3fExtension from "@theatre/r3f/dist/extension";

/**
 * Gọi một lần khi dev để mở Theatre Studio với extension R3F.
 * Production: không gọi (bundle nhẹ hơn, không UI Studio).
 */
export function initTheatreStudio() {
  if (!import.meta.env.DEV) return;
  studio.extend(r3fExtension);
  studio.initialize();
}
