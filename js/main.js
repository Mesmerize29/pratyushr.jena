import { siteContent } from "../data/content.js";
import { state, getAngleStep, setActiveIndex, goNext, goPrev } from "./state.js";
import { padNumber } from "./utils.js";
import { renderSections } from "./render-sections.js";
import { bindOrbitControls } from "./orbit-scroll.js";
import { initializeScene, updateSceneTheme } from "./scene.js";

const ringElement = document.getElementById("orbitRing");
const navElement = document.getElementById("orbitNav");
const counterElement = document.getElementById("sectionCounter");
const activeLabelElement = document.getElementById("activeLabel");

function applyUI() {
  const angleStep = getAngleStep();
  const rotation = -(state.activeIndex * angleStep);
  const progress =
    state.total > 1 ? state.activeIndex / (state.total - 1) : 0;

  document.documentElement.style.setProperty("--angle-step", `${angleStep}deg`);
  document.documentElement.style.setProperty(
    "--orbit-rotation",
    `${rotation}deg`
  );

  const panels = [...ringElement.querySelectorAll(".orbit-panel")];
  const navButtons = [...navElement.querySelectorAll(".orbit-nav__button")];

  panels.forEach((panel, index) => {
    const isActive = index === state.activeIndex;
    const isNeighbor =
      index === (state.activeIndex + 1) % state.total ||
      index === (state.activeIndex - 1 + state.total) % state.total;

    panel.classList.toggle("is-active", isActive);
    panel.classList.toggle("is-neighbor", !isActive && isNeighbor);
    panel.setAttribute("aria-hidden", isActive ? "false" : "true");
  });

  navButtons.forEach((button, index) => {
    button.classList.toggle("is-active", index === state.activeIndex);
  });

  counterElement.textContent = `${padNumber(state.activeIndex + 1)} / ${padNumber(state.total)}`;
  activeLabelElement.textContent = siteContent.sections[state.activeIndex].navLabel;

  updateSceneTheme(progress);
}

function jumpTo(index) {
  setActiveIndex(index);
  applyUI();
}

function next() {
  goNext();
  applyUI();
}

function prev() {
  goPrev();
  applyUI();
}

function initialize() {
  renderSections(ringElement, navElement);
  initializeScene();
  applyUI();

  bindOrbitControls({
    onNext: next,
    onPrev: prev,
    onJump: jumpTo,
    navElement,
    ringElement,
  });
}

initialize();
