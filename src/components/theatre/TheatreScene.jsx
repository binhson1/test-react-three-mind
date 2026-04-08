/* eslint-disable react/no-unknown-property -- @react-three/fiber elements */
import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import { editable as e, RefreshSnapshot } from "@theatre/r3f";
import { SpriteOngDong } from "../sprite/SpriteOngDong";
import { SceneLoiModel } from "../models/SceneLoiModel";
import { TheatreAutoplay } from "./TheatreAutoplay";
import { TheatreBloomEffect } from "./TheatreBloomEffect";

export function TheatreScene({ ar = false }) {
  return (
    <>
      <RefreshSnapshot />
      {!ar && <color attach="background" args={["lightblue"]} />}
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 8, 4]} intensity={1.2} />

      <TheatreAutoplay />
      <TheatreBloomEffect ar={ar} />

      <Suspense fallback={null}>
        <e.group theatreKey="spriteOngDong" position={[-1.2, 0.8, 0]}>
          <SpriteOngDong planeArgs={[1.2, 1.2]} />
        </e.group>
      </Suspense>

      <Suspense fallback={null}>
        <SceneLoiModel />
      </Suspense>
      {/* <Suspense fallback={null}>
        <mesh
          name="plane red"
          rotation={[0, 1, 0]}
          position={[0, 0, -2]}
          scale={0.5}
        >
          <planeGeometry args={[1.2, 1.2, 1]} />
          <meshBasicMaterial wireframe color="red" />
        </mesh>
      </Suspense> */}

      {!ar && <OrbitControls makeDefault />}
    </>
  );
}
