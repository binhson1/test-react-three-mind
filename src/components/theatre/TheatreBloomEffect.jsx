/* eslint-disable react/no-unknown-property -- postprocessing components */
import { useLayoutEffect, useMemo, useState } from "react";
import { useCurrentSheet } from "@theatre/r3f";
import { types as t } from "@theatre/core";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

const BLOOM_THEATRE_KEY = "postproc_bloom";

export function TheatreBloomEffect({ ar = false }) {
  const sheet = useCurrentSheet();
  const [bloomState, setBloomState] = useState({
    enabled: true,
    intensity: 1.1,
    luminanceThreshold: 1,
    luminanceSmoothing: 0.08,
    mipmapBlur: true,
  });

  useLayoutEffect(() => {
    if (!sheet) return undefined;

    const bloomObj = sheet.object(BLOOM_THEATRE_KEY, {
      enabled: t.boolean(true, { label: "Bloom enabled" }),
      intensity: t.number(1.1, {
        label: "Bloom intensity",
        range: [0, 5],
        nudgeMultiplier: 0.05,
      }),
      threshold: t.number(1, {
        label: "Luminance threshold",
        range: [0, 2],
        nudgeMultiplier: 0.02,
      }),
      smoothing: t.number(0.08, {
        label: "Luminance smoothing",
        range: [0, 1],
        nudgeMultiplier: 0.02,
      }),
      mipmapBlur: t.boolean(true, { label: "Mipmap blur" }),
    });

    const applyBloom = (v) => {
      setBloomState({
        enabled: v.enabled,
        intensity: v.intensity,
        luminanceThreshold: v.threshold,
        luminanceSmoothing: v.smoothing,
        mipmapBlur: v.mipmapBlur,
      });
    };

    applyBloom(bloomObj.value);
    const unsub = bloomObj.onValuesChange(applyBloom);

    return () => {
      unsub();
      sheet.detachObject(BLOOM_THEATRE_KEY);
    };
  }, [sheet]);

  const multisampling = useMemo(() => (ar ? 0 : 4), [ar]);

  return (
    <EffectComposer
      enabled={bloomState.enabled}
      multisampling={multisampling}
      disableNormalPass
    >
      <Bloom
        intensity={bloomState.intensity}
        luminanceThreshold={bloomState.luminanceThreshold}
        luminanceSmoothing={bloomState.luminanceSmoothing}
        mipmapBlur={bloomState.mipmapBlur}
      />
    </EffectComposer>
  );
}
