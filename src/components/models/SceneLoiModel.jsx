/* eslint-disable react/prop-types, react/no-unknown-property -- R3F primitive / drei */
import { useLayoutEffect, useMemo } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { editable as e } from "@theatre/r3f";
import { types as t } from "@theatre/core";
import { useCurrentSheet } from "@theatre/r3f";

/** File trong public/models — tên có khoảng trắng */
const MODEL_PATH = encodeURI("/models/Scene 03.2_Loi_BAKE_03.glb");

const ANIM_THEATRE_KEY = "sceneLoiBake_anim";
const GLOW_THEATRE_KEY = "sceneLoiBake_glow";

function sanitizeKeyPart(value) {
  return String(value || "")
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 40);
}

/**
 * Điều khiển clip GLB trong Theatre: object `sceneLoiBake_anim` (time, clipIndex).
 * Drei useAnimations gọi mixer.update mỗi frame — đặt timeScale = 0 và set action.time từ Theatre.
 */
function SceneLoiGltfAnimations({ gltf }) {
  const sheet = useCurrentSheet();
  const { mixer, clips, actions } = useAnimations(gltf.animations, gltf.scene);

  useLayoutEffect(() => {
    mixer.timeScale = 0;
  }, [mixer]);

  useLayoutEffect(() => {
    if (!sheet || !clips.length) return undefined;

    const maxIdx = Math.max(0, clips.length - 1);
    const longestDur = clips.reduce((m, c) => Math.max(m, c.duration || 0), 0);
    const defaultDur = Math.max(0.01, longestDur || clips[0]?.duration || 1);

    const obj = sheet.object(ANIM_THEATRE_KEY, {
      time: t.number(0, {
        label: "Animation time (s)",
        range: [0, defaultDur],
        nudgeMultiplier: 0.02,
      }),
      clipIndex: t.number(0, {
        label: "Clip index",
        range: [0, maxIdx <= 0 ? 1 : maxIdx],
        nudgeMultiplier: 1,
      }),
    });

    const apply = (v) => {
      const idx = Math.min(maxIdx, Math.max(0, Math.round(v.clipIndex)));
      const clip = clips[idx];
      if (!clip) return;
      const act = actions[clip.name];
      if (!act) return;
      act.reset();
      act.play();
      act.paused = true;
      const dur = Math.max(1e-6, clip.duration || 1);
      act.time = ((v.time % dur) + dur) % dur;
      mixer.update(0);
    };

    apply(obj.value);
    const unsub = obj.onValuesChange(apply);

    return () => {
      unsub();
      sheet.detachObject(ANIM_THEATRE_KEY);
      mixer.stopAllAction();
    };
  }, [sheet, clips, actions, mixer]);

  return null;
}

/**
 * GLB: transform trong Theatre (`sceneLoiBake`), animation clip trong Theatre (`sceneLoiBake_anim`).
 */
export function SceneLoiModel() {
  const sheet = useCurrentSheet();
  const gltf = useGLTF(MODEL_PATH);
  const meshEntries = useMemo(() => {
    const entries = [];
    let meshCounter = 0;

    gltf.scene.traverse((obj) => {
      if (!obj.isMesh || !obj.material) return;
      const keyPart = sanitizeKeyPart(obj.name) || `mesh_${meshCounter}`;
      entries.push({
        mesh: obj,
        key: `${GLOW_THEATRE_KEY}_${keyPart}_${meshCounter}`,
        label: obj.name || `Mesh ${meshCounter}`,
      });
      meshCounter += 1;
    });

    return entries;
  }, [gltf.scene]);

  useLayoutEffect(() => {
    if (!sheet || !meshEntries.length) return undefined;

    const disposers = [];

    meshEntries.forEach(({ mesh, key }) => {
      const materials = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];

      const originals = materials.map((mat) => ({
        mat,
        toneMapped: mat.toneMapped,
        color: mat.color?.clone?.(),
        emissive: mat.emissive?.clone?.(),
        emissiveIntensity:
          typeof mat.emissiveIntensity === "number"
            ? mat.emissiveIntensity
            : undefined,
      }));

      const glowObj = sheet.object(key, {
        enabled: t.boolean(false, { label: "Glow enabled" }),
        glowColor: t.rgba(
          { r: 0.2, g: 0.55, b: 1, a: 1 },
          { label: "Glow color" },
        ),
        intensity: t.number(3, {
          label: "Intensity",
          range: [0, 10],
          nudgeMultiplier: 0.1,
        }),
      });

      const applyGlow = (v) => {
        originals.forEach(
          ({ mat, toneMapped, color, emissive, emissiveIntensity }) => {
            if (v.enabled) {
              mat.toneMapped = true;
              const { r, g, b } = v.glowColor;
              const s = v.intensity;
              if (mat.emissive) {
                if (typeof mat.emissiveIntensity === "number") {
                  mat.emissive.setRGB(r, g, b);
                  mat.emissiveIntensity = s;
                } else {
                  mat.emissive.setRGB(r * s, g * s, b * s);
                }
              } else if (mat.color) {
                mat.color.setRGB(r * s, g * s, b * s);
              }
            } else {
              mat.toneMapped = toneMapped;
              if (color && mat.color) mat.color.copy(color);
              if (emissive && mat.emissive) mat.emissive.copy(emissive);
              if (typeof emissiveIntensity === "number") {
                mat.emissiveIntensity = emissiveIntensity;
              }
            }
            mat.needsUpdate = true;
          },
        );
      };

      applyGlow(glowObj.value);
      const unsub = glowObj.onValuesChange(applyGlow);

      disposers.push(() => {
        unsub();
        originals.forEach(
          ({ mat, toneMapped, color, emissive, emissiveIntensity }) => {
            mat.toneMapped = toneMapped;
            if (color && mat.color) mat.color.copy(color);
            if (emissive && mat.emissive) mat.emissive.copy(emissive);
            if (typeof mat.emissiveIntensity === "number") {
              mat.emissiveIntensity =
                typeof emissiveIntensity === "number"
                  ? emissiveIntensity
                  : mat.emissiveIntensity;
            }
            mat.needsUpdate = true;
          },
        );
        sheet.detachObject(key);
      });
    });

    return () => {
      disposers.forEach((dispose) => dispose());
    };
  }, [sheet, meshEntries]);

  return (
    <>
      <SceneLoiGltfAnimations gltf={gltf} />
      <e.group theatreKey="sceneLoiBake" position={[0, 0, 0]}>
        <primitive object={gltf.scene} />
      </e.group>
    </>
  );
}

useGLTF.preload(MODEL_PATH);
