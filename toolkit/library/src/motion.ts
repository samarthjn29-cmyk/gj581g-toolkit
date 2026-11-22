import { Easing, interpolate, spring } from "remotion";

// Calm-version motion (Sam, 22 Nov 2026). Times are in seconds; frames come from Math.round(seconds * fps).
export const sec = (s: number, fps: number) => Math.round(s * fps);
export const SLOW_OUT = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// MOT-001 SpringCameraDrift (#drift): one slow move per shot, 1.00 -> 1 + amount, amount 0.03 at most.
export function drift(frame: number, durationInFrames: number, amount = 0.03): number {
  if (amount > 0.03) throw new Error(`drift ${amount} is above the calm limit (0.03).`);
  return interpolate(frame, [0, Math.max(1, durationInFrames)], [1, 1 + amount], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });
}

// Same easing as drift, for slow sideways moves in px.
export function slide(frame: number, durationInFrames: number, px: number): number {
  return interpolate(frame, [0, Math.max(1, durationInFrames)], [0, px], { ...clamp, easing: Easing.inOut(Easing.sin) });
}

// MOT-002 SpringEditorialReveal (#reveal): entrances 0.6-0.9 s, slow-out, no overshoot. Returns 0..1.
export function reveal(frame: number, fps: number, startSec: number, enterSec = 0.75): number {
  if (enterSec < 0.6 || enterSec > 0.9) throw new Error(`entrance ${enterSec}s is outside the calm range 0.6-0.9 s.`);
  const a = sec(startSec, fps);
  return interpolate(frame, [a, a + sec(enterSec, fps)], [0, 1], { ...clamp, easing: SLOW_OUT });
}

// Exits may run 1.35x faster than the entrance.
export function exit(frame: number, fps: number, startSec: number, enterSec = 0.75): number {
  const a = sec(startSec, fps);
  return interpolate(frame, [a, a + Math.max(1, sec(enterSec / 1.35, fps))], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) });
}

// MOT-003 SpringSnappyLock (#lock): a firmer spring for brackets, cards and highlights; damping 200, no overshoot.
export function lock(frame: number, fps: number, startSec: number): number {
  return spring({ frame: frame - sec(startSec, fps), fps, config: { damping: 200, stiffness: 140, mass: 0.9 } });
}

// Entrance style: two properties together (opacity with a small rise), never a fade alone.
export const rise = (p: number, px = 28): { opacity: number; transform: string } => ({
  opacity: p,
  transform: `translateY(${((1 - p) * px).toFixed(2)}px)`,
});

// The canvas colour behind an incoming shot, faded out over `frames` after its move ends (independent review,
// act 1 v12: switching the canvas off in one frame made OpticalStack's corner light snap on, 31-43% of pixels changing).
export function canvasAfterMove(hex: string, frame: number, endFrame: number, frames = 10): string | undefined {
  if (frame >= endFrame + frames) return undefined;
  const a = frame < endFrame ? 1 : 1 - (frame - endFrame) / frames;
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return `rgba(${r},${g},${b},${a.toFixed(3)})`;
}
