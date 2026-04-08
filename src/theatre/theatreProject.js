import { getProject } from "@theatre/core";
import projectState from "./theatre-project-state.json";

/** ID project — dùng khi export state JSON trong Studio */
export const THEATRE_PROJECT_ID = "react-three-mind-scene";

/** Sheet chứa toàn bộ object R3F editable + sprite frame */
export const MAIN_SHEET_ID = "Main Scene";

export const theatreProject = getProject(THEATRE_PROJECT_ID, {
  state: projectState,
});

export const mainSheet = theatreProject.sheet(MAIN_SHEET_ID);
