import * as THREE from "three";

/**
 * Gán đúng không gian màu cho map diffuse/emissive (sRGB) để khớp output sRGB của renderer.
 * Three r145: texture.encoding; bản mới: texture.colorSpace.
 */
export function fixGltfColorMapsForDisplay(root) {
  const sRGB =
    THREE.SRGBColorSpace !== undefined
      ? THREE.SRGBColorSpace
      : THREE.sRGBEncoding;

  root.traverse((child) => {
    if (!child.isMesh) return;
    const mats = Array.isArray(child.material) ? child.material : [child.material];
    mats.forEach((mat) => {
      if (!mat || typeof mat !== "object") return;
      const colorKeys = ["map", "emissiveMap", "sheenColorMap", "specularColorMap"];
      colorKeys.forEach((key) => {
        const tex = mat[key];
        if (tex && tex.isTexture) {
          if ("colorSpace" in tex) tex.colorSpace = sRGB;
          else tex.encoding = sRGB;
        }
      });
      mat.needsUpdate = true;
    });
  });
}
