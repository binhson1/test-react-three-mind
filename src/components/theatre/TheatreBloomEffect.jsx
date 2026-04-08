/* eslint-disable react/no-unknown-property -- three postprocessing classes */
import { useEffect, useMemo, useLayoutEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useCurrentSheet } from "@theatre/r3f";
import { types as t } from "@theatre/core";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

const BLOOM_THEATRE_KEY = "postproc_bloom";

export function TheatreBloomEffect() {
  const { gl, scene, camera, size } = useThree();
  const sheet = useCurrentSheet();

  const composer = useMemo(() => new EffectComposer(gl), [gl]);
  const renderPass = useMemo(() => new RenderPass(scene, camera), [scene, camera]);
  const bloomPass = useMemo(
    () => new UnrealBloomPass(new THREE.Vector2(size.width, size.height), 1, 0.3, 0.8),
    [size.width, size.height]
  );

  useLayoutEffect(() => {
    composer.addPass(renderPass);
    composer.addPass(bloomPass);
    return () => {
      composer.removePass(renderPass);
      composer.removePass(bloomPass);
    };
  }, [composer, renderPass, bloomPass]);

  useEffect(() => {
    composer.setSize(size.width, size.height);
    bloomPass.setSize(size.width, size.height);
  }, [composer, bloomPass, size.width, size.height]);

  useLayoutEffect(() => {
    if (!sheet) return undefined;

    const bloomObj = sheet.object(BLOOM_THEATRE_KEY, {
      enabled: t.boolean(true, { label: "Bloom enabled" }),
      strength: t.number(1.1, {
        label: "Bloom strength",
        range: [0, 3],
        nudgeMultiplier: 0.05,
      }),
      radius: t.number(0.3, {
        label: "Bloom radius",
        range: [0, 1.5],
        nudgeMultiplier: 0.02,
      }),
      threshold: t.number(0.8, {
        label: "Bloom threshold",
        range: [0, 2],
        nudgeMultiplier: 0.02,
      }),
    });

    const applyBloom = (v) => {
      bloomPass.enabled = v.enabled;
      bloomPass.strength = v.strength;
      bloomPass.radius = v.radius;
      bloomPass.threshold = v.threshold;
    };

    applyBloom(bloomObj.value);
    const unsub = bloomObj.onValuesChange(applyBloom);

    return () => {
      unsub();
      sheet.detachObject(BLOOM_THEATRE_KEY);
    };
  }, [sheet, bloomPass]);

  useFrame(() => {
    composer.render();
  }, 1);

  return null;
}
