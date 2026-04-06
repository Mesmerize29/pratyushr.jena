import { mixColor } from "./utils.js";

const TECH = {
  bgA: "#07111e",
  bgB: "#0e1b2f",
  accent: "#72b8ff",
};

const NATURE = {
  bgA: "#0c1a16",
  bgB: "#193228",
  accent: "#8cd4a3",
};

export function initializeScene() {
  window.addEventListener("pointermove", (event) => {
    const x = event.clientX / window.innerWidth;
    const y = event.clientY / window.innerHeight;

    document.documentElement.style.setProperty("--pointer-x", x.toFixed(4));
    document.documentElement.style.setProperty("--pointer-y", y.toFixed(4));
  });
}

export function updateSceneTheme(progress) {
  const bgA = mixColor(TECH.bgA, NATURE.bgA, progress);
  const bgB = mixColor(TECH.bgB, NATURE.bgB, progress);
  const accent = mixColor(TECH.accent, NATURE.accent, progress);

  document.documentElement.style.setProperty("--bg-a", bgA);
  document.documentElement.style.setProperty("--bg-b", bgB);
  document.documentElement.style.setProperty("--accent", accent);
}
