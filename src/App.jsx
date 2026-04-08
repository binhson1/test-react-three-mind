import { lazy, Suspense, useState } from "react";
import "./App.css";

const TheatreCanvas = lazy(() =>
  import("./components/theatre/TheatreCanvas").then((m) => ({
    default: m.TheatreCanvas,
  })),
);

const TheatreArView = lazy(() =>
  import("./components/theatre/TheatreArView").then((m) => ({
    default: m.TheatreArView,
  })),
);

function SceneFallback() {
  return (
    <div className="app-scene-fallback" aria-busy="true" aria-live="polite">
      Đang tải…
    </div>
  );
}

function App() {
  const [mode, setMode] = useState("ar");

  return (
    <div className="app-canvas-root">
      <div className="app-mode-bar" role="toolbar" aria-label="Chế độ xem">
        <button
          type="button"
          className={mode === "theatre" ? "active" : undefined}
          onClick={() => setMode("theatre")}
        >
          3D / Theatre
        </button>
        <button
          type="button"
          className={mode === "ar" ? "active" : undefined}
          onClick={() => setMode("ar")}
        >
          AR (MindAR)
        </button>
      </div>
      <Suspense fallback={<SceneFallback />}>
        {mode === "theatre" ? <TheatreCanvas /> : <TheatreArView />}
      </Suspense>
    </div>
  );
}

export default App;
