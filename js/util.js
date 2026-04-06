export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function wrapIndex(index, length) {
  if (length <= 0) return 0;
  return ((index % length) + length) % length;
}

export function padNumber(value) {
  return String(value).padStart(2, "0");
}

export function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  const safe =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized;

  const intValue = parseInt(safe, 16);

  return {
    r: (intValue >> 16) & 255,
    g: (intValue >> 8) & 255,
    b: intValue & 255,
  };
}

export function rgbToHex({ r, g, b }) {
  const toHex = (value) => value.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function mixColor(colorA, colorB, progress) {
  const a = hexToRgb(colorA);
  const b = hexToRgb(colorB);

  return rgbToHex({
    r: Math.round(a.r + (b.r - a.r) * progress),
    g: Math.round(a.g + (b.g - a.g) * progress),
    b: Math.round(a.b + (b.b - a.b) * progress),
  });
}
