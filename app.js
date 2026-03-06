import { ProgressCore } from "./progress/ProgressCore.js";
import { DomSvgRenderer } from "./progress/DomSvgRenderer.js";

const host = document.getElementById("progressHost");
const valueInput = document.getElementById("valueInput");
const animateToggle = document.getElementById("animateToggle");
const hideToggle = document.getElementById("hideToggle");

const renderer = new DomSvgRenderer(host, {
  size: 180,
  strokeWidth: 10,
  animationDuration: 1200,

  progressColor: "#005BFF",   // синий как у Ozon
  trackColor: "#E6EAF2",      // светлый фон круга
  backgroundColor: "white"
});

const progress = new ProgressCore(renderer, {
  value: parseValue(valueInput.value),
  animated: animateToggle.checked,
  hidden: hideToggle.checked,
});

progress.mount();
syncControlsFromState();

valueInput.addEventListener("input", handleValueInput);
valueInput.addEventListener("blur", handleValueCommit);
valueInput.addEventListener("keydown", handleValueKeydown);

animateToggle.addEventListener("change", () => {
  progress.setAnimated(animateToggle.checked);
  syncControlsFromState();
});

hideToggle.addEventListener("change", () => {
  progress.setHidden(hideToggle.checked);
  syncControlsFromState();
});

window.__progress = progress;

function handleValueInput() {
  const rawValue = valueInput.value.trim();

  // даём пользователю временно очистить поле во время ввода
  if (rawValue === "") {
    setInputValidityState(false);
    return;
  }

  const parsedValue = Number(rawValue);

  if (!Number.isFinite(parsedValue)) {
    setInputValidityState(false);
    return;
  }

  progress.setValue(parsedValue);
  syncControlsFromState();
  setInputValidityState(true);
}

function handleValueCommit() {
  const parsedValue = parseValue(valueInput.value);
  progress.setValue(parsedValue);
  syncControlsFromState();
  setInputValidityState(true);
}

function handleValueKeydown(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    valueInput.blur();
  }
}

function syncControlsFromState() {
  const state = progress.getState();

  valueInput.value = String(Math.round(state.value));
  animateToggle.checked = state.animated;
  hideToggle.checked = state.hidden;
}

function parseValue(rawValue) {
  const parsedValue = Number(rawValue);

  if (!Number.isFinite(parsedValue)) {
    return 0;
  }

  return clamp(parsedValue, 0, 100);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function setInputValidityState(isValid) {
  valueInput.classList.toggle("field__input--invalid", !isValid);
}