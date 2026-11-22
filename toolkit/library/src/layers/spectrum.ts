// Approximate display colour of visible light by wavelength (380-700 nm), after Dan Bruton's widely used
// approximation. A physical mapping, not a theme colour: it is the same in every theme.
export function wavelengthRGB(nm: number): string {
  let r = 0, g = 0, b = 0;
  if (nm >= 380 && nm < 440) { r = -(nm - 440) / 60; b = 1; }
  else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
  else if (nm < 510) { g = 1; b = -(nm - 510) / 20; }
  else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
  else if (nm < 645) { r = 1; g = -(nm - 645) / 65; }
  else if (nm <= 700) { r = 1; }
  // dim the far ends, where the eye is less sensitive
  const f = nm < 420 ? 0.3 + (0.7 * (nm - 380)) / 40 : nm > 680 ? 0.3 + (0.7 * (700 - nm)) / 20 : 1;
  const c = (v: number) => Math.round(255 * Math.pow(Math.max(0, v) * f, 0.8));
  return `rgb(${c(r)},${c(g)},${c(b)})`;
}

export function spectrumGradient(from = 380, to = 700, steps = 32): string {
  const stops = Array.from({ length: steps + 1 }, (_, i) => {
    const nm = from + ((to - from) * i) / steps;
    return `${wavelengthRGB(nm)} ${((i / steps) * 100).toFixed(1)}%`;
  });
  return `linear-gradient(90deg, ${stops.join(", ")})`;
}
