import { siteContent } from "../data/content.js";
import { wrapIndex } from "./utils.js";

export const state = {
  activeIndex: 0,
  total: siteContent.sections.length,
  lastInteractionAt: 0,
  locked: false,
};

export function getAngleStep() {
  return 360 / state.total;
}

export function setActiveIndex(nextIndex) {
  state.activeIndex = wrapIndex(nextIndex, state.total);
  return state.activeIndex;
}

export function goNext() {
  return setActiveIndex(state.activeIndex + 1);
}

export function goPrev() {
  return setActiveIndex(state.activeIndex - 1);
}
