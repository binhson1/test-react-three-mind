/* eslint-disable react/no-unknown-property -- @react-three/fiber */
import * as THREE from "three";
import { ARView, ARAnchor } from "react-three-mind";
import { SheetProvider } from "@theatre/r3f";
import { getProject } from "@theatre/core";
import demoProjectState from "../../theatre/theatre-project-state.json";
import { TheatreScene } from "./TheatreScene";

const mainSheet = getProject("react-three-mind-scene", {
  state: demoProjectState,
}).sheet("Main Scene");

/** Target mẫu MindAR — in ảnh marker từ tài liệu MindAR để quét */
const SAMPLE_IMAGE_TARGET = "targets\\AW Vachs Monozukuri 02-02.mind";

export function TheatreArView() {
  return (
    <ARView
      autoplay
      imageTargets={[SAMPLE_IMAGE_TARGET]}
      filterMinCF={0.001}
      filterBeta={1000}
      missTolerance={3}
      warmupTolerance={2}
      flipUserCamera={false}
    >
      <SheetProvider sheet={mainSheet}>
        <ARAnchor target={0} position={[0, 0, 0]}>
          {/* <group position={[0, 0, 0]} rotation={[0, 2.2, 0]} scale={1}>
            <arrowHelper
              args={[
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(0, 0, 0),
                0.5,
                0x0000ff,
              ]}
            />
            <arrowHelper
              args={[
                new THREE.Vector3(0, 1, 0),
                new THREE.Vector3(0, 0, 0),
                0.5,
                0x00ff00,
              ]}
            />
            <arrowHelper
              args={[
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, 0),
                0.5,
                0xff0000,
              ]}
            />
          </group> */}

          {/* <axesHelper args={[0.5]} rotation={[0, -0.5, 0]} />
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1, 0.7]} />{" "}
            <meshBasicMaterial wireframe color="blue" />
          </mesh> */}
          <TheatreScene ar />
        </ARAnchor>
      </SheetProvider>
    </ARView>
  );
}
