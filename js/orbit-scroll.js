const WHEEL_COOLDOWN_MS = 650;
const SWIPE_THRESHOLD = 50;

export function bindOrbitControls({
  onNext,
  onPrev,
  onJump,
  navElement,
  ringElement,
}) {
  let touchStartY = 0;

  window.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();

      const now = Date.now();
      const last = Number(document.body.dataset.lastWheelAt || 0);

      if (now - last < WHEEL_COOLDOWN_MS) return;

      document.body.dataset.lastWheelAt = String(now);

      if (event.deltaY > 0) {
        onNext();
      } else {
        onPrev();
      }
    },
    { passive: false }
  );

  window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "PageDown") {
      event.preventDefault();
      onNext();
    }

    if (event.key === "ArrowUp" || event.key === "PageUp") {
      event.preventDefault();
      onPrev();
    }

    if (event.key === "Home") {
      event.preventDefault();
      onJump(0);
    }
  });

  window.addEventListener(
    "touchstart",
    (event) => {
      touchStartY = event.touches[0].clientY;
    },
    { passive: true }
  );

  window.addEventListener(
    "touchend",
    (event) => {
      const touchEndY = event.changedTouches[0].clientY;
      const delta = touchStartY - touchEndY;

      if (Math.abs(delta) < SWIPE_THRESHOLD) return;

      if (delta > 0) onNext();
      else onPrev();
    },
    { passive: true }
  );

  navElement.addEventListener("click", (event) => {
    const button = event.target.closest(".orbit-nav__button");
    if (!button) return;
    onJump(Number(button.dataset.index));
  });

  ringElement.addEventListener("click", (event) => {
    const ctaButton = event.target.closest(".section-cta");
    if (!ctaButton) return;

    const targetId = ctaButton.dataset.target;
    const targetPanel = ringElement.querySelector(
      `[data-section-id="${targetId}"]`
    );

    if (!targetPanel) return;

    onJump(Number(targetPanel.dataset.sectionIndex));
  });
}
