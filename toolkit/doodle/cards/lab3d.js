// lab3d.js: the shared 3D look for the Colour_v1 science shots (from 20 Nov 2026).
// Built on the scottstts Three.js graphics skills (MIT): threejs-image-pipeline (one signal order, tone-map once),
// threejs-bloom (bloom in HDR, before tone mapping; one emissive hierarchy), threejs-exposure-color-grading (grade with a
// generated 32-cube LUT after tone mapping), threejs-screen-space-ambient-occlusion (GTAO contact shadows),
// threejs-procedural-vfx (Fresnel rim shells, additive glare) and threejs-procedural-materials (tissue = transmission + Beer-Lambert tint).
//
// Signal order:  scene HDR -> GTAO -> depth of field -> bloom -> tone map (OutputPass, once) -> LUT grade -> lens (fringe, vignette, grain)
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { LUTPass } from 'three/addons/postprocessing/LUTPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export const W = 1920, H = 1080;
export const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), lerp = (a, b, u) => a + (b - a) * u;
export function bez(p1x, p1y, p2x, p2y) { return x => { x = clamp(x); let lo = 0, hi = 1, t = x; for (let i = 0; i < 24; i++) { const cx = 3 * t * (1 - t) ** 2 * p1x + 3 * t * t * (1 - t) * p2x + t ** 3; if (cx < x) lo = t; else hi = t; t = (lo + hi) / 2; } return 3 * t * (1 - t) ** 2 * p1y + 3 * t * t * (1 - t) * p2y + t ** 3; }; }
export const SIG = bez(0.4, 0, 0.2, 1), IN = bez(0.05, 0.7, 0.1, 1), OUT = bez(0.3, 0, 1, 1), SMOOTH = bez(0.65, 0, 0.35, 1);
export const at = (t, a, d, f = SIG) => f((t - a) / d);
export const CREAM = '#EFE6D2', DIM = '#8C96B0', HEX = {L: '#FF5A48', M: '#4FE27E', S: '#5F86FF'};
// one emissive hierarchy for every shot (threejs-bloom: never one arbitrary multiplier for all bright things), in HDR units
export const EMIT = {hit: 6.0, beam: 3.2, flare: 2.6, core: 0.55, label: 1.0};

// a generated 32-cube grade, applied after tone mapping (display domain): cool lift in the shadows, warm highlights,
// a gentle S-curve and +8% saturation, the look of the opening
export function makeLUT(size = 32) {
  const data = new Uint8Array(size * size * size * 4);
  const s = x => x * x * (3 - 2 * x);
  for (let b = 0; b < size; b++) for (let g = 0; g < size; g++) for (let r = 0; r < size; r++) {
    let c = [r / (size - 1), g / (size - 1), b / (size - 1)];
    const l = 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];
    c = c.map(v => lerp(v, s(v), 0.25));                                   // S-curve
    c = c.map((v, i) => v + [-0.006, 0.004, 0.022][i] * (1 - l) * (1 - l)); // cool shadows
    c = c.map((v, i) => v * [1.035, 1.0, 0.955][i] ** l);                    // warm highlights
    const l2 = 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]; c = c.map(v => l2 + (v - l2) * 1.08);
    const k = 4 * (r + g * size + b * size * size); c.forEach((v, i) => data[k + i] = Math.round(clamp(v) * 255)); data[k + 3] = 255;
  }
  const t = new THREE.Data3DTexture(data, size, size, size); t.format = THREE.RGBAFormat; t.type = THREE.UnsignedByteType;
  t.minFilter = t.magFilter = THREE.LinearFilter; t.wrapS = t.wrapT = t.wrapR = THREE.ClampToEdgeWrapping; t.needsUpdate = true; return t;
}

export function makeStage({bg = '#05070F', fog = 0.02, ao = true, envIntensity = 0.45} = {}) {
  const gl = document.createElement('canvas'); gl.width = W; gl.height = H;
  const renderer = new THREE.WebGLRenderer({canvas: gl, antialias: true, preserveDrawingBuffer: true});
  renderer.setSize(W, H, false); renderer.setPixelRatio(1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;   // applied once, by OutputPass
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.localClippingEnabled = true;
  const scene = new THREE.Scene(); scene.background = new THREE.Color(bg); if (fog) scene.fog = new THREE.FogExp2(bg, fog);
  const pmrem = new THREE.PMREMGenerator(renderer); scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = envIntensity;
  const cam = new THREE.PerspectiveCamera(32, W / H, 0.1, 300); cam.up.set(0, 1, 0);
  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(W, H, {type: THREE.HalfFloatType})); composer.setPixelRatio(1); composer.setSize(W, H);
  composer.addPass(new RenderPass(scene, cam));
  let gtao = null; if (ao) { gtao = new GTAOPass(scene, cam, W, H); gtao.blendIntensity = 0.85; gtao.updateGtaoMaterial({radius: 0.35, distanceExponent: 1.5, thickness: 1.0, scale: 1.0, samples: 12}); composer.addPass(gtao);
    // additive glows, rays and sprites are not surfaces: hide them while GTAO renders its normals (it composites onto the colour already rendered)
    const r0 = gtao.render.bind(gtao); gtao.render = (...a) => { const hide = []; scene.traverse(o => { if (o.visible && (o.isSprite || o.material?.blending === THREE.AdditiveBlending)) hide.push(o); }); hide.forEach(o => o.visible = false); r0(...a); hide.forEach(o => o.visible = true); }; }
  const bokeh = new BokehPass(scene, cam, {focus: 10, aperture: 0.0008, maxblur: 0.01}); composer.addPass(bokeh);
  const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), 0.55, 0.55, 1.0); composer.addPass(bloom);   // threshold 1.0 in HDR: only emissive above white blooms
  composer.addPass(new OutputPass());
  const lut = new LUTPass({lut: makeLUT(), intensity: 1.0}); composer.addPass(lut);
  const lens = new ShaderPass({uniforms: {tDiffuse: {value: null}, uTime: {value: 0}, uVig: {value: 1.0}},
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: `uniform sampler2D tDiffuse; uniform float uTime; uniform float uVig; varying vec2 vUv;
      float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)) + uTime*37.0) * 43758.5453); }
      void main(){ vec2 d = vUv - 0.5; float r = dot(d,d);
        vec3 c; c.r = texture2D(tDiffuse, vUv + d*0.0028).r; c.g = texture2D(tDiffuse, vUv).g; c.b = texture2D(tDiffuse, vUv - d*0.0028).b;
        c *= 1.0 - uVig * 1.0 * r; c += (h(vUv * 1000.0) - 0.5) * 0.035; gl_FragColor = vec4(c, 1.0); }`});
  composer.addPass(lens);
  return {gl, renderer, scene, cam, composer, gtao, bokeh, bloom, lut, lens};
}

// Fresnel rim shell (threejs-procedural-vfx): an additive back-face-culled shell that glows at grazing angles
export function rimShell(geometry, color = '#9FC7FF', power = 3.0, strength = 0.6) {
  return new THREE.Mesh(geometry, new THREE.ShaderMaterial({transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: {uC: {value: new THREE.Color(color)}, uP: {value: power}, uS: {value: strength}},
    vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
    fragmentShader: 'uniform vec3 uC; uniform float uP; uniform float uS; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1.0 - abs(dot(vN, vV)), uP); gl_FragColor = vec4(uC * f * uS, 1.0); }'}));
}

// a soft additive glow sprite (for hits and light sources)
export function glowSprite(color = '#CFFFF6') {
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'), gr = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.22, 'rgba(255,255,255,0.5)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = gr; x.fillRect(0, 0, 128, 128);
  return new THREE.Sprite(new THREE.SpriteMaterial({map: new THREE.CanvasTexture(c), color, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false}));
}

// a light ray as a thin emissive tube from a to b, drawn up to fraction u
export function ray(scene, color, radius = 0.014) {
  const mat = new THREE.MeshBasicMaterial({color: new THREE.Color(color).multiplyScalar(EMIT.beam), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false});
  const m = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 1, 12, 1, true), mat); scene.add(m);
  return {m, mat, set(a, b, u, op = 1) { u = clamp(u); m.visible = u > 0.001 && op > 0.001; if (!m.visible) return; const e = a.clone().lerp(b, u);
    m.position.copy(a.clone().add(e).multiplyScalar(0.5)); m.scale.set(1, Math.max(0.001, a.distanceTo(e)), 1); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize()); mat.opacity = op; }};
}

// 2D overlay: the chips used across the chapter
export function overlayKit(g, cam) {
  const chip = (x, y, w, h, a = 0.78) => { g.fillStyle = `rgba(7,11,23,${a})`; g.beginPath(); g.roundRect(x, y, w, h, 8); g.fill(); };
  const label = (s, y, a, color = CREAM, size = 22) => { if (a <= 0.001) return; g.save(); g.globalAlpha = a; g.font = `500 ${size}px "JetBrains Mono"`; g.textAlign = 'center';
    const w = g.measureText(s).width + 36, yy = y + (1 - a) * 10; chip(W / 2 - w / 2, yy - size - 6, w, size + 20); g.fillStyle = color; g.fillText(s, W / 2, yy); g.restore(); };
  const tag = (lines, a) => { if (a <= 0.001) return; g.save(); g.globalAlpha = a; g.font = '500 20px "JetBrains Mono"';
    const w = Math.max(...lines.map(([s]) => g.measureText(s).width)) + 32; chip(104, 66, w, 18 + 30 * lines.length, 0.72);
    lines.forEach(([s, c], i) => { g.fillStyle = c; g.fillText(s, 120, 96 + i * 30); }); g.restore(); };
  const callout = (p3, s, a, color = CREAM, dx = 90, dy = -70) => { if (a <= 0.001) return; const p = p3.clone().project(cam), x = (p.x + 1) / 2 * W, y = (1 - p.y) / 2 * H, lx = x + dx, ly = y + dy;
    g.save(); g.globalAlpha = a; g.strokeStyle = color; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y); g.lineTo(lerp(x, lx, a), lerp(y, ly, a)); g.stroke();
    g.fillStyle = color; g.beginPath(); g.arc(x, y, 4, 0, 7); g.fill();
    g.font = '500 20px "JetBrains Mono"'; const w = g.measureText(s).width + 24, bx = dx > 0 ? lx : lx - w; chip(bx, ly - 30, w, 38); g.fillStyle = color; g.fillText(s, bx + 12, ly - 4); g.restore(); };
  return {chip, label, tag, callout};
}

// the render loop shared by every shot: SUB sub-frames over a half-frame shutter (motion blur), then the 2D overlay
export function installRender({stage, g, update, overlay, P = 0, SUB = 8}) {
  window.render = function (T) {
    const t = T - P; stage.lens.uniforms.uTime.value = Math.floor(T * 30);
    for (let k = 0; k < SUB; k++) { const ts = t + (SUB > 1 ? (k / (SUB - 1) - 0.5) * 0.5 / 30 : 0); update(ts); stage.composer.render(); g.globalAlpha = 1 / (k + 1); g.drawImage(stage.gl, 0, 0); }
    g.globalAlpha = 1; update(t); overlay(t);
  };
}
