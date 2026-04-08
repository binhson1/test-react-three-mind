import { useEffect } from "react";
import { getProject } from "@theatre/core";
import demoProjectState from "../../theatre/theatre-project-state.json";

// 1. Khởi tạo project
const project = getProject("react-three-mind-scene", {
  state: demoProjectState,
});

// 2. Lấy sheet từ project đó
const sheet = project.sheet("Main Scene");

export function TheatreAutoplay({ iterationCount = Infinity }) {
  useEffect(() => {
    let cancelled = false;

    // SỬA TẠI ĐÂY: Gọi trực tiếp project.ready()
    project.ready.then(() => {
      if (cancelled) return;
      sheet.sequence.play({ iterationCount, range: [0, 6], rate: 0.75 });
    });

    return () => {
      cancelled = true;
      sheet.sequence.pause();
    };
  }, [iterationCount]);

  return null;
}
