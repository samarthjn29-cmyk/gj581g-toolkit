// VIS-021 RayParticles: small points of light travelling along a path, one dot per "ray", for the beats where
// light physically travels (Sam, 22 Nov 2026). Deterministic: every particle's position comes from the frame,
// so stills and renders agree. Particles leave the source one after another (nothing appears mid-path), drift a
// little sideways (seeded), and fade in at the source and out at the end. Calm limit: 40 on screen at most.
export type RaySpec = {
  count?: number; // particles in flight at once (<= 40)
  speed: number; // path units per second
  atSec: number; // first particle leaves the source
  untilSec?: number; // no new particles after this; those in flight finish
  size?: number; // dot radius in px at scale 1
  jitter?: number; // sideways drift in path units
  seed?: number;
  colors?: string[]; // one colour per particle, cycled
  // absorb (WCL-E01 act 3 shot C, Dalton's blue jelly): from atSec, dots of these colours fade to `keep` alpha between
  // path fractions `from` and `to` (the jelly soaks them up); other colours pass at full strength
  absorb?: { atSec: number; colors: string[]; from: number; to: number; keep: number };
};
export type Particle = {
  u: number;
  side: number;
  alpha: number;
  color?: string;
  k: number;
};

const rand = (i: number, seed: number) => {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// Positions along a path of length `len` (any units). u = 0..1 along the path.
export function particles(
  spec: RaySpec,
  len: number,
  timeSec: number,
): Particle[] {
  const n = spec.count ?? 16;
  if (n > 40)
    throw new Error(
      "RayParticles: at most 40 particles on screen (calm limit)",
    );
  const travel = len / spec.speed; // seconds from source to end
  const gap = travel / n; // one particle leaves every `gap` seconds
  const t = timeSec - spec.atSec;
  if (t < 0) return [];
  const stop =
    spec.untilSec !== undefined ? spec.untilSec - spec.atSec : Infinity;
  const out: Particle[] = [];
  const first = Math.max(0, Math.floor((t - travel) / gap));
  const last = Math.floor(Math.min(t, stop) / gap);
  for (let k = first; k <= last; k++) {
    const born = k * gap;
    const age = t - born;
    if (age < 0 || age > travel) continue;
    const u = age / travel;
    const alpha = Math.min(1, u / 0.08, (1 - u) / 0.12);
    const side = (rand(k, spec.seed ?? 1) - 0.5) * 2 * (spec.jitter ?? 0);
    const c =
      spec.colors && spec.colors.length
        ? spec.colors[k % spec.colors.length]
        : undefined;
    let a = Math.max(0, alpha);
    const ab = spec.absorb;
    if (ab && c && ab.colors.includes(c) && born + spec.atSec + (ab.from * travel) >= ab.atSec) {
      const f = Math.min(1, Math.max(0, (u - ab.from) / Math.max(1e-6, ab.to - ab.from)));
      a *= 1 - (1 - ab.keep) * f;
    }
    out.push({ u, side, alpha: a, color: c, k });
  }
  return out;
}
