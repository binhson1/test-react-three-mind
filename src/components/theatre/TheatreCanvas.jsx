import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { SheetProvider } from "@theatre/r3f";
// import { mainSheet } from "../../theatre/theatreProject";
import { TheatreScene } from "./TheatreScene";
import demoProjectState from "../../theatre/theatre-project-state.json";
import { getProject } from "@theatre/core";

const mainSheet = getProject("react-three-mind-scene", {
  state: demoProjectState,
}).sheet("Main Scene");

export function TheatreCanvas() {
  return (
    <Canvas
      camera={{ position: [3, 2, 5], fov: 50 }}
      gl={{ antialias: true }}
      dpr={[1, 2]}
      onCreated={({ gl }) => {
        gl.outputEncoding = THREE.sRGBEncoding;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1;
        gl.physicallyCorrectLights = true;
      }}
    >
      <SheetProvider sheet={mainSheet}>
        <TheatreScene />
      </SheetProvider>
    </Canvas>
  );
}
