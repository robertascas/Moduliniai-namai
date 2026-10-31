import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

const Q = new URLSearchParams(location.search);
const SCENE = Q.get("scene") || "hero";
const W = +(Q.get("w") || 1600), H = +(Q.get("h") || 1000);

// ---------- deterministinis atsitiktinumas ----------
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const rr = (a, b) => a + (b - a) * rnd();

// ---------- tekstūros ----------
function boards(base, opt = {}) {
  const { boardsPerM = 8, horizontal = false, gap = "rgba(0,0,0,.55)", grain = 0.10, vary = 0.10 } = opt;
  const S = 1024, c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d");
  const col = new THREE.Color(base);
  const bw = S / boardsPerM;
  for (let i = 0; i < boardsPerM; i++) {
    const k = 1 + rr(-vary, vary);
    const cc = col.clone().multiplyScalar(k);
    g.fillStyle = `#${cc.getHexString()}`;
    if (horizontal) g.fillRect(0, i * bw, S, bw); else g.fillRect(i * bw, 0, bw, S);
    // rievės
    for (let j = 0; j < 26; j++) {
      g.strokeStyle = `rgba(${rnd() > .5 ? "0,0,0" : "255,240,220"},${rr(0.02, grain)})`;
      g.lineWidth = rr(1, 3);
      g.beginPath();
      if (horizontal) {
        const y = i * bw + rr(2, bw - 2);
        g.moveTo(0, y);
        for (let x = 0; x <= S; x += 64) g.lineTo(x, y + Math.sin(x / rr(60, 160) + j) * rr(0.5, 3));
      } else {
        const x = i * bw + rr(2, bw - 2);
        g.moveTo(x, 0);
        for (let y = 0; y <= S; y += 64) g.lineTo(x + Math.sin(y / rr(60, 160) + j) * rr(0.5, 3), y);
      }
      g.stroke();
    }
    // šakos
    for (let j = 0; j < 2; j++) {
      if (rnd() < .5) continue;
      const cx = horizontal ? rr(0, S) : i * bw + rr(10, bw - 10), cy = horizontal ? i * bw + rr(10, bw - 10) : rr(0, S);
      g.fillStyle = `rgba(60,30,10,${rr(.15, .35)})`;
      g.beginPath(); g.ellipse(cx, cy, horizontal ? 9 : 5, horizontal ? 5 : 9, 0, 0, Math.PI * 2); g.fill();
    }
    g.fillStyle = gap;
    if (horizontal) g.fillRect(0, i * bw, S, 3); else g.fillRect(i * bw, 0, 3, S);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  return t;
}
function texMat(tex, rx, ry, extra = {}) {
  const t = tex.clone(); t.needsUpdate = true; t.repeat.set(rx, ry);
  return new THREE.MeshStandardMaterial({ map: t, roughness: 0.82, ...extra });
}
const std = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.85, ...extra });

// ---------- scena ----------
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(W, H);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, W / H, 0.1, 400);

function sky(top, mid, hor, glow = null) {
  const geo = new THREE.SphereGeometry(300, 48, 24);
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new THREE.Color(top) }, mid: { value: new THREE.Color(mid) }, hor: { value: new THREE.Color(hor) }, glow: { value: new THREE.Color(glow || hor) }, gdir: { value: new THREE.Vector3(-1, 0.05, -1).normalize() }, gs: { value: glow ? 1 : 0 } },
    vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
    fragmentShader: "uniform vec3 top,mid,hor,glow; uniform vec3 gdir; uniform float gs; varying vec3 vP; void main(){ float h = clamp(vP.y,0.0,1.0); vec3 c = mix(hor, mid, smoothstep(0.0,0.18,h)); c = mix(c, top, smoothstep(0.18,0.7,h)); float g = pow(max(dot(normalize(vec3(vP.x,0.0,vP.z)), normalize(vec3(gdir.x,0.0,gdir.z))),0.0),6.0)*(1.0-smoothstep(0.0,0.35,h)); c += glow*g*0.6*gs; gl_FragColor = vec4(c,1.0); }"
  });
  scene.add(new THREE.Mesh(geo, mat));
}

function ground(color = "#e9eff6", flatR = 9, amp = 0.35) {
  const g = new THREE.PlaneGeometry(260, 260, 220, 220);
  g.rotateX(-Math.PI / 2);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i), r = Math.hypot(x, z);
    const f = THREE.MathUtils.smoothstep(r, flatR, flatR + 8);
    const n = Math.sin(x * 0.35) * Math.cos(z * 0.28) * 0.6 + Math.sin(x * 0.9 + z * 0.7) * 0.25 + Math.sin(x * 2.1 - z * 1.7) * 0.08;
    p.setY(i, n * amp * f + Math.sin(x * 3.1) * Math.cos(z * 2.7) * 0.02);
  }
  g.computeVertexNormals();
  const m = new THREE.Mesh(g, std(color, { roughness: 0.95 }));
  m.receiveShadow = true;
  scene.add(m);
}

function spruce(x, z, h, snow = true) {
  const grp = new THREE.Group();
  const dark = std("#14231d"), white = std("#e8eef4", { roughness: 0.9 });
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(h * 0.015, h * 0.025, h * 0.25, 6), std("#2b211a"));
  trunk.position.y = h * 0.12; grp.add(trunk);
  const tiers = 7;
  for (let i = 0; i < tiers; i++) {
    const t = i / tiers;
    const r = h * 0.24 * (1 - t * 0.82) * rr(0.9, 1.1);
    const th = h * 0.26 * (1 - t * 0.35);
    const y = h * 0.15 + t * h * 0.76;
    const cone = new THREE.Mesh(new THREE.ConeGeometry(r, th, 14), dark);
    cone.position.y = y + th / 2; cone.rotation.y = rr(0, 6);
    cone.castShadow = true; grp.add(cone);
    if (snow) {
      const s = new THREE.Mesh(new THREE.ConeGeometry(r * 0.86, th * 0.42, 14), white);
      s.position.y = y + th * 0.62; s.rotation.y = rr(0, 6);
      grp.add(s);
    }
  }
  grp.position.set(x, 0, z);
  scene.add(grp);
  return grp;
}
function forest(n, test, hmin = 7, hmax = 16, R = 70, snow = true) {
  let k = 0, guard = 0;
  while (k < n && guard++ < n * 40) {
    const x = rr(-R, R), z = rr(-R, R);
    if (!test(x, z)) continue;
    spruce(x, z, rr(hmin, hmax), snow); k++;
  }
}
function mound(x, z, sx, sy, sz) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12), std("#edf2f8", { roughness: 0.95 }));
  m.scale.set(sx, sy, sz); m.position.set(x, 0, z); m.receiveShadow = true; scene.add(m);
}

// ---------- pastatas ----------
const WARM = "#ffb164";
function glassMat(glow, color = WARM, intensity = 1.0) {
  return glow
    ? new THREE.MeshStandardMaterial({ color: "#1a1206", emissive: color, emissiveIntensity: intensity * 0.55, roughness: 0.2 })
    : new THREE.MeshStandardMaterial({ color: "#0f1620", roughness: 0.08, metalness: 0.6 });
}
const at = (m, x, y, z) => { m.position.set(x, y, z); return m; };
function frameBox(w, h, d, mat) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.castShadow = true; return m; }

function opening(parent, { ww, wh, glow = false, frame = "#151515", mull = 0, door = false, doorMat = null, glowColor = WARM, glowI = 2.2, light = 1 }) {
  const g = new THREE.Group();
  const fm = std(frame, { roughness: 0.5 });
  const ft = 0.07;
  if (door && doorMat) {
    const panel = frameBox(ww, wh, 0.05, doorMat); g.add(panel);
  } else {
    const gl = new THREE.Mesh(new THREE.PlaneGeometry(ww, wh), glassMat(glow, glowColor, glowI)); gl.position.z = -0.01; g.add(gl);
  }
  g.add(at(frameBox(ww + ft * 2, ft, 0.1, fm), 0, wh / 2 + ft / 2, 0));
  g.add(at(frameBox(ww + ft * 2, ft, 0.1, fm), 0, -wh / 2 - ft / 2, 0));
  g.add(at(frameBox(ft, wh, 0.1, fm), -ww / 2 - ft / 2, 0, 0));
  g.add(at(frameBox(ft, wh, 0.1, fm), ww / 2 + ft / 2, 0, 0));
  for (let i = 1; i <= mull; i++) g.add(at(frameBox(0.05, wh, 0.08, fm), -ww / 2 + (ww / (mull + 1)) * i, 0, 0));
  if (glow && light) {
    const pl = new THREE.PointLight(glowColor, 1.1 * ww * wh * light, 7, 2);
    pl.position.set(0, 0, 0.7); g.add(pl);
  }
  parent.add(g);
  return g;
}

function gableBuilding({ w, d, h, pitch, oh = 0.45, front = 0, plinth = 0.45, clad, roof = "#2a2d31", snowRoof = true, ridgeDir = "z" }) {
  const grp = new THREE.Group();
  const rh = (w / 2) * Math.tan(pitch);
  const tex = clad;
  const mats = [texMat(tex, d, h), texMat(tex, d, h), std("#333"), std("#333"), texMat(tex, w, h), texMat(tex, w, h)];
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mats);
  body.position.y = plinth + h / 2; body.castShadow = body.receiveShadow = true; grp.add(body);
  const base = new THREE.Mesh(new THREE.BoxGeometry(w - 0.1, plinth, d - 0.1), std("#2b2c2e"));
  base.position.y = plinth / 2; base.castShadow = true; grp.add(base);
  // frontonai
  const shp = new THREE.Shape([new THREE.Vector2(-w / 2, 0), new THREE.Vector2(w / 2, 0), new THREE.Vector2(0, rh)]);
  const gm = texMat(tex, 1, 1); gm.side = THREE.DoubleSide;
  [1, -1].forEach((s) => {
    const m = new THREE.Mesh(new THREE.ShapeGeometry(shp), gm);
    m.position.set(0, plinth + h, s * (d / 2 + 0.002)); if (s < 0) m.rotation.y = Math.PI;
    m.castShadow = true; grp.add(m);
  });
  // stogas
  const yr = plinth + h + rh;
  const run = w / 2 + oh, L = run / Math.cos(pitch), t = 0.12;
  const rlen = d + oh * 2 + front;
  const rm = std(roof, { roughness: 0.55, metalness: 0.3 });
  const sm = std("#f1f5fa", { roughness: 0.92 });
  [1, -1].forEach((s) => {
    const slab = new THREE.Mesh(new THREE.BoxGeometry(L, t, rlen), rm);
    slab.rotation.z = -s * pitch;
    slab.position.set(s * run / 2, yr - (run / 2) * Math.tan(pitch) + t / 2, front / 2);
    slab.castShadow = true; grp.add(slab);
    if (snowRoof) {
      const sn = new THREE.Mesh(new THREE.BoxGeometry(L - 0.05, 0.2, rlen - 0.06), sm);
      sn.rotation.z = -s * pitch;
      const nx = Math.sin(pitch) * s, ny = Math.cos(pitch);
      sn.position.set(s * run / 2 + nx * 0.14, yr - (run / 2) * Math.tan(pitch) + t / 2 + ny * 0.14, front / 2);
      sn.castShadow = true; grp.add(sn);
    }
  });
  grp.userData = { w, d, h, plinth, rh, yr };
  scene.add(grp);
  return grp;
}
// angos ant fasadų: face 'front' (z+) arba 'right' (x+)
function place(b, face, u, y0, spec) {
  const { w, d, plinth } = b.userData;
  const o = opening(b, spec);
  if (face === "front") { o.position.set(u, plinth + y0 + spec.wh / 2, d / 2 + 0.05); }
  if (face === "right") { o.rotation.y = Math.PI / 2; o.position.set(w / 2 + 0.05, plinth + y0 + spec.wh / 2, -u); }
  if (face === "gable") { o.position.set(u, plinth + b.userData.h + y0 + spec.wh / 2, d / 2 + 0.05); }
  return o;
}

function composer(strength = 0.5, radius = 0.55, threshold = 0.82) {
  const c = new EffectComposer(renderer);
  c.addPass(new RenderPass(scene, camera));
  c.addPass(new UnrealBloomPass(new THREE.Vector2(W, H), strength, radius, threshold));
  c.addPass(new OutputPass());
  return c;
}
function moon(color, intensity, pos, size = 30) {
  const l = new THREE.DirectionalLight(color, intensity);
  l.position.copy(pos); l.castShadow = true;
  l.shadow.mapSize.set(4096, 4096);
  Object.assign(l.shadow.camera, { left: -size, right: size, top: size, bottom: -size, near: 1, far: 200 }); l.shadow.camera.updateProjectionMatrix();
  l.shadow.bias = -0.0004; l.shadow.normalBias = 0.02;
  scene.add(l); return l;
}
function lamp(x, z, h = 0.6) {
  const p = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, h, 12), std("#1b1b1b", { roughness: 0.4 }));
  p.position.set(x, h / 2, z); p.castShadow = true; scene.add(p);
  const g = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.1, 12), new THREE.MeshStandardMaterial({ color: "#000", emissive: WARM, emissiveIntensity: 1.6 }));
  g.position.set(x, h - 0.1, z); scene.add(g);
  const l = new THREE.PointLight(WARM, 0.5, 4, 2); l.position.set(x, h - 0.05, z + 0.05); scene.add(l);
}

// ---------- scenos ----------
const scenes = {
  hero() {
    sky("#07101e", "#1b2c4a", "#4f6386");
    scene.fog = new THREE.FogExp2("#3e4d68", 0.011);
    scene.add(new THREE.HemisphereLight("#7f9acb", "#1a212c", 0.55));
    moon("#b7c7e8", 1.5, new THREE.Vector3(-25, 30, -12), 22);
    ground();
    const honey = boards("#b07440", { boardsPerM: 7 });
    const b = gableBuilding({ w: 6.6, d: 11, h: 2.9, pitch: THREE.MathUtils.degToRad(30), clad: honey, oh: 0.5 });
    place(b, "front", -0.9, 0.05, { ww: 3.2, wh: 2.45, glow: true, mull: 2 });
    place(b, "front", 1.95, 0.05, { ww: 1.0, wh: 2.2, glow: true, glowI: 1.6, light: 0.6 });
    place(b, "gable", 0, 0.35, { ww: 1.6, wh: 1.1, glow: true, glowI: 1.4, light: 0.4 });
    place(b, "right", -3.6, 0.9, { ww: 1.3, wh: 1.4, glow: true, glowI: 1.7 });
    place(b, "right", -0.4, 0.05, { ww: 2.4, wh: 2.4, glow: true, mull: 1 });
    place(b, "right", 3.4, 0.9, { ww: 1.3, wh: 1.4, glow: false });
    // terasa
    const deck = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.14, 2.4), texMat(boards("#8a5e3a", { boardsPerM: 7, horizontal: false }), 2.4, 6.6));
    deck.rotation.y = Math.PI / 2; deck.position.set(0, 0.4, 6.7); deck.receiveShadow = true; deck.castShadow = true; scene.add(deck);
    mound(-4.6, 2, 1.8, 0.5, 4); mound(4.8, -2, 1.4, 0.45, 5); mound(-3.2, 9.5, 2.4, 0.6, 1.2); mound(5.5, 8.4, 2, 0.5, 1.4);
    lamp(3.9, 9.2); lamp(-1.6, 10.6); lamp(5.6, 12.4);
    forest(150, (x, z) => (z < -9 || Math.abs(x) > 12) && Math.hypot(x - 12, z - 18) > 12, 8, 19);
    camera.fov = 32; camera.updateProjectionMatrix();
    camera.position.set(10.5, 1.55, 17.5); camera.lookAt(-0.6, 2.9, 0);
    return composer(0.32, 0.45, 0.9);
  },
  sauna() {
    sky("#07101e", "#1b2c4a", "#4f6386");
    scene.fog = new THREE.FogExp2("#3e4d68", 0.014);
    scene.add(new THREE.HemisphereLight("#7f9acb", "#1a212c", 0.55));
    moon("#b7c7e8", 1.5, new THREE.Vector3(-18, 26, -14), 14);
    ground("#e9eff6", 7);
    const dark = boards("#5b3b26", { boardsPerM: 8 });
    const b = gableBuilding({ w: 3.6, d: 4.4, h: 2.4, pitch: THREE.MathUtils.degToRad(25), clad: dark, oh: 0.4, front: 2.0, plinth: 0.5 });
    place(b, "front", -0.85, 0.02, { ww: 0.85, wh: 1.95, glow: true, glowColor: "#ff9a45", glowI: 2.6, light: 1.3 });
    place(b, "front", 0.8, 0.95, { ww: 1.0, wh: 0.8, glow: true, glowColor: "#ff9a45", glowI: 2.2, light: 0.9 });
    place(b, "right", 0.6, 0.9, { ww: 0.6, wh: 0.6, glow: true, glowColor: "#ff9a45", glowI: 1.8, light: 0.5 });
    // terasa po stogu
    const deckTex = boards("#7b5435", { boardsPerM: 7 });
    const deck = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.12, 2.1), texMat(deckTex, 4.2, 2.1));
    deck.position.set(0, 0.46, 2.2 + 1.05); deck.receiveShadow = true; deck.castShadow = true; scene.add(deck);
    [-1.95, 1.95].forEach((x) => { const p = frameBox(0.12, 2.45, 0.12, std("#3a2618")); p.position.set(x, 0.5 + 1.22, 4.15); scene.add(p); });
    // turėklai
    const rail = std("#3a2618");
    const r1 = frameBox(0.06, 0.06, 2.0, rail); r1.position.set(1.95, 1.4, 3.2); scene.add(r1);
    for (let z = 2.4; z < 4.1; z += 0.18) { const s = frameBox(0.04, 0.9, 0.04, rail); s.position.set(1.95, 0.97, z); scene.add(s); }
    // kaminas
    const ch = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 1.5, 16), std("#121212", { roughness: 0.4, metalness: 0.6 }));
    ch.position.set(0.7, b.userData.yr + 0.25, -0.6); ch.castShadow = true; scene.add(ch);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.06, 16), std("#121212")); cap.position.set(0.7, b.userData.yr + 1.03, -0.6); scene.add(cap);
    // laipteliai
    for (let i = 0; i < 2; i++) { const st = frameBox(1.2, 0.14, 0.32, texMat(deckTex, 1.2, .3)); st.position.set(-0.85, 0.12 + i * 0.16, 4.62 - i * 0.3); st.receiveShadow = true; scene.add(st); }
    mound(-3.2, 1, 1.2, 0.45, 3.2); mound(3.4, -1, 1.2, 0.4, 3); mound(-2.4, 6, 1.6, 0.4, 1.0);
    lamp(1.2, 6.0, 0.5); lamp(-2.6, 7.4, 0.5);
    forest(130, (x, z) => (z < -6 || Math.abs(x) > 8) && Math.hypot(x - 6, z - 11) > 8, 7, 16);
    camera.fov = 34; camera.updateProjectionMatrix();
    camera.position.set(6.2, 1.5, 10.5); camera.lookAt(-0.2, 1.9, 0.6);
    return composer(0.32, 0.45, 0.9);
  },
  shed() {
    sky("#07101e", "#1b2c4a", "#4f6386");
    scene.fog = new THREE.FogExp2("#3e4d68", 0.015);
    scene.add(new THREE.HemisphereLight("#7f9acb", "#1a212c", 0.6));
    moon("#b7c7e8", 1.5, new THREE.Vector3(-18, 26, -10), 12);
    ground("#e9eff6", 6);
    const grey = boards("#9a9f95", { boardsPerM: 7, vary: .06 });
    const w = 2.8, d = 3.2, h = 2.2, pl = 0.25;
    const mats = [texMat(grey, d, h), texMat(grey, d, h), std("#333"), std("#333"), texMat(grey, w, h), texMat(grey, w, h)];
    const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mats); body.position.y = pl + h / 2; body.castShadow = body.receiveShadow = true; scene.add(body);
    const base = frameBox(w - .1, pl, d - .1, std("#2b2c2e")); base.position.y = pl / 2; scene.add(base);
    // vienšlaitis stogas: aukštesnis priekis
    const rise = 0.55, run = d + 0.7, ang = Math.atan2(rise, d);
    const slab = frameBox(w + 0.6, 0.12, run / Math.cos(ang), std("#24272b", { roughness: .55, metalness: .3 }));
    slab.rotation.x = ang; slab.position.set(0, pl + h + rise / 2 + 0.06, 0); scene.add(slab);
    const sn = frameBox(w + 0.55, 0.2, run / Math.cos(ang) - 0.05, std("#f1f5fa", { roughness: .92 }));
    sn.rotation.x = ang; sn.position.set(0, pl + h + rise / 2 + 0.22, -0.02); scene.add(sn);
    // trikampiai šonuose
    const tri = new THREE.Shape([new THREE.Vector2(-d / 2, 0), new THREE.Vector2(d / 2, 0), new THREE.Vector2(d / 2, rise)]);
    const tm = texMat(grey, 1, 1); tm.side = THREE.DoubleSide;
    [1, -1].forEach((s) => { const m = new THREE.Mesh(new THREE.ShapeGeometry(tri), tm); m.rotation.y = s * Math.PI / 2; m.position.set(s * (w / 2 + 0.002), pl + h, 0); scene.add(m); });
    // dvivėrės durys
    const doorTex = boards("#5f645d", { boardsPerM: 9, vary: .05 });
    const g = new THREE.Group(); scene.add(g);
    const fake = { userData: { w, d, plinth: pl, h } }; fake.add = (o) => g.add(o);
    [-0.45, 0.45].forEach((u) => { const o = opening(fake, { ww: 0.85, wh: 1.95, door: true, doorMat: texMat(doorTex, .85, 1.95), frame: "#1d1f1c" }); o.position.set(u, pl + 1.0, d / 2 + 0.05); });
    const win = opening(fake, { ww: 0.7, wh: 0.5, glow: true, glowI: 1.2, light: .5 }); win.rotation.y = -Math.PI / 2; win.position.set(-w / 2 - 0.05, pl + 1.6, 0.7);
    // šviestuvas
    const lg = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.22, 0.1), new THREE.MeshStandardMaterial({ color: "#000", emissive: WARM, emissiveIntensity: 1.6 }));
    lg.position.set(0, pl + 2.15, d / 2 + 0.1); scene.add(lg);
    const ll = new THREE.PointLight(WARM, 4.5, 7, 2); ll.position.set(0, pl + 2.1, d / 2 + 0.4); scene.add(ll);
    // malkų rietuvė
    const logEnd = std("#c79a64"), logBark = std("#4a3626");
    for (let row = 0; row < 7; row++) for (let i = 0; i < 9; i++) {
      const lg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.45, 10), [logBark, logEnd, logEnd]);
      lg2.rotation.x = Math.PI / 2;
      lg2.position.set(-w / 2 - 0.45 - (i % 2 ? 0.0 : 0.02), 0.08 + row * 0.15, -d / 2 + 0.2 + i * 0.16 + (row % 2) * 0.08);
      lg2.castShadow = true; scene.add(lg2);
    }
    const shelterRoof = frameBox(0.7, 0.06, 1.8, std("#24272b")); shelterRoof.position.set(-w / 2 - 0.45, 1.2, -d / 2 + 0.85); scene.add(shelterRoof);
    mound(2.6, -0.5, 1.0, 0.35, 2.5); mound(-3.6, 2.6, 1.0, 0.3, 0.9);
    forest(130, (x, z) => (z < -5 || Math.abs(x) > 7) && Math.hypot(x + 5, z - 9) > 7, 6, 15);
    camera.fov = 34; camera.updateProjectionMatrix();
    camera.position.set(-7.4, 1.6, 9.6); camera.lookAt(-0.5, 1.45, 0);
    return composer(0.3, 0.45, 0.9);
  },
  frame() {
    sky("#5f86b8", "#9db6d2", "#f0c9a0", "#ffb070");
    scene.fog = new THREE.FogExp2("#d7c3b0", 0.012);
    scene.add(new THREE.HemisphereLight("#cfe0f5", "#8a7c6a", 0.9));
    const sun = moon("#ffd2a0", 3.0, new THREE.Vector3(-14, 12, 26), 16);
    ground("#eef2f6", 9, 0.3);
    const pine = std("#d9b27a", { roughness: .78 });
    const pineTex = boards("#d4ac74", { boardsPerM: 1, gap: "rgba(0,0,0,0)", grain: .12, vary: .04 });
    const wood = texMat(pineTex, 1, 1);
    const W2 = 6, D2 = 9, Hh = 2.7, base = 0.55;
    const deck = frameBox(W2 + .2, 0.22, D2 + .2, std("#c8a46e")); deck.position.y = base - 0.11; deck.receiveShadow = true; scene.add(deck);
    for (let x = -W2 / 2; x <= W2 / 2 + .01; x += 1.5) for (let z = -D2 / 2; z <= D2 / 2 + .01; z += 1.5) { const p = frameBox(0.1, base - .2, 0.1, std("#3b3b3b", { metalness: .5, roughness: .4 })); p.position.set(x, (base - .2) / 2, z); scene.add(p); }
    const stud = (x, z, rotY, h = Hh) => { const s = frameBox(0.045, h, 0.145, wood); s.position.set(x, base + h / 2, z); s.rotation.y = rotY; s.receiveShadow = true; scene.add(s); };
    const plate = (x, y, z, len, rotY) => { const p = frameBox(len, 0.045, 0.145, wood); p.position.set(x, y, z); p.rotation.y = rotY; p.receiveShadow = true; scene.add(p); };
    const skipFront = (x) => (x > -2.3 && x < -0.5) || (x > 0.6 && x < 2.0);
    const skipSide = (z) => (z > -2.6 && z < -0.9) || (z > 1.2 && z < 3.4);
    for (let x = -W2 / 2; x <= W2 / 2 + .01; x += 0.6) { if (!skipFront(x)) stud(x, D2 / 2 - .07, 0); stud(x, -D2 / 2 + .07, 0); }
    for (let z = -D2 / 2; z <= D2 / 2 + .01; z += 0.6) { if (!skipSide(z)) stud(W2 / 2 - .07, z, Math.PI / 2); stud(-W2 / 2 + .07, z, Math.PI / 2); }
    // sąramos ir palangės
    [[-1.4, 1.8], [1.3, 1.4]].forEach(([cx, len]) => { plate(cx, base + 2.2, D2 / 2 - .07, len + .1, 0); plate(cx, base + 0.9, D2 / 2 - .07, len + .1, 0); });
    [[-1.75, 1.7], [2.3, 2.2]].forEach(([cz, len]) => { plate(W2 / 2 - .07, base + 2.2, cz, len + .1, Math.PI / 2); plate(W2 / 2 - .07, base + 0.9, cz, len + .1, Math.PI / 2); });
    [base + 0.02, base + Hh, base + Hh + 0.05].forEach((y) => { plate(0, y, D2 / 2 - .07, W2, 0); plate(0, y, -D2 / 2 + .07, W2, 0); plate(W2 / 2 - .07, y, 0, D2, Math.PI / 2); plate(-W2 / 2 + .07, y, 0, D2, Math.PI / 2); });
    // gegnės
    const pitch = THREE.MathUtils.degToRad(32), run = W2 / 2 + 0.35, L = run / Math.cos(pitch), yr = base + Hh + (W2 / 2) * Math.tan(pitch);
    for (let z = -D2 / 2; z <= D2 / 2 + .01; z += 0.6) {
      [1, -1].forEach((s) => { const r = frameBox(L, 0.195, 0.045, wood); r.rotation.z = -s * pitch; r.position.set(s * run / 2, yr - (run / 2) * Math.tan(pitch), z); scene.add(r); });
      if (Math.abs(z % 1.2) < 0.01) { const t = frameBox(W2 * 0.6, 0.145, 0.045, wood); t.position.set(0, yr - 0.95, z); scene.add(t); }
    }
    const ridge = frameBox(0.045, 0.22, D2 + 0.2, wood); ridge.position.set(0, yr - 0.02, 0); scene.add(ridge);
    // OSB dalis ant galinės sienos
    const osb = frameBox(W2, Hh, 0.012, std("#bf9a62", { roughness: .9 })); osb.position.set(0, base + Hh / 2, -D2 / 2 - .005); scene.add(osb);
    // medienos krūva
    for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) { const bd = frameBox(4.2, 0.045, 0.145, wood); bd.position.set(5.6, 0.1 + i * 0.05, 3 + j * 0.16); bd.rotation.y = Math.PI / 2 + 0.02; scene.add(bd); }
    forest(120, (x, z) => (z < -10 || Math.abs(x) > 13) && Math.hypot(x - 11, z - 16) > 11, 8, 18, 70, false);
    camera.fov = 32; camera.updateProjectionMatrix();
    camera.position.set(11.5, 2.2, 15.5); camera.lookAt(-0.2, 2.4, 0);
    return composer(0.25, 0.5, 0.92);
  },
  interior() {
    scene.background = new THREE.Color("#120c08");
    const lin = boards("#d8b68a", { boardsPerM: 10, horizontal: true, gap: "rgba(60,35,15,.5)", grain: .08, vary: .06 });
    const RW = 2.4, RD = 2.6, RH = 2.3;
    const room = new THREE.Group(); scene.add(room);
    const wall = (w, h, pos, rotY) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), texMat(lin, w, h)); m.position.copy(pos); m.rotation.y = rotY; m.receiveShadow = true; room.add(m); };
    wall(RW, RH, new THREE.Vector3(0, RH / 2, -RD / 2), 0);
    wall(RD, RH, new THREE.Vector3(-RW / 2, RH / 2, 0), Math.PI / 2);
    wall(RD, RH, new THREE.Vector3(RW / 2, RH / 2, 0), -Math.PI / 2);
    wall(RW, RH, new THREE.Vector3(0, RH / 2, RD / 2), Math.PI);
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(RW, RD), texMat(lin, RW, RD)); ceil.rotation.x = Math.PI / 2; ceil.position.y = RH; room.add(ceil);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(RW, RD), std("#5c5f60", { roughness: .6 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; room.add(floor);
    // gultai
    const slat = texMat(boards("#e2c08e", { boardsPerM: 1, gap: "rgba(0,0,0,0)", vary: .03 }), 1, 1);
    const bench = (y, depth, z0, len, x0, alongX = true) => {
      const n = Math.floor(depth / 0.1);
      for (let i = 0; i < n; i++) {
        const s = frameBox(alongX ? len : 0.085, 0.03, alongX ? 0.085 : len, slat);
        if (alongX) s.position.set(x0, y, z0 + i * 0.1); else s.position.set(x0 + i * 0.1, y, z0);
        s.receiveShadow = true; scene.add(s);
      }
      const front = frameBox(alongX ? len : 0.03, 0.16, alongX ? 0.03 : len, slat);
      if (alongX) front.position.set(x0, y - 0.1, z0 + depth - 0.06); else front.position.set(x0 + depth - 0.06, y - 0.1, z0);
      scene.add(front);
    };
    bench(1.05, 0.62, -RD / 2 + 0.02, RW - 0.02, 0);
    bench(0.62, 0.5, -RD / 2 + 0.62, RW - 0.9, 0.44);
    for (let i = 0; i < 4; i++) { const br = frameBox(RW - 0.1, 0.07, 0.025, slat); br.position.set(0, 1.35 + i * 0.12, -RD / 2 + 0.06); br.rotation.x = -0.15; scene.add(br); }
    // LED juosta po viršutiniu gultu
    const led = new THREE.Mesh(new THREE.BoxGeometry(RW - 0.1, 0.02, 0.02), new THREE.MeshStandardMaterial({ color: "#000", emissive: "#ff9a4a", emissiveIntensity: 1.3 }));
    led.position.set(0, 0.92, -RD / 2 + 0.6); scene.add(led);
    const ledL = new THREE.PointLight("#ff9a4a", 0.5, 2.5, 2); ledL.position.set(0, 0.7, -RD / 2 + 0.8); scene.add(ledL);
    const ledL2 = new THREE.PointLight("#ff9a4a", 0.35, 2.5, 2); ledL2.position.set(-0.8, 0.7, -RD / 2 + 0.8); scene.add(ledL2);
    // krosnelė
    const st = frameBox(0.45, 0.75, 0.45, std("#151515", { roughness: .5, metalness: .4 })); st.position.set(-RW / 2 + 0.3, 0.375, 0.55); scene.add(st);
    const fire = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.16), new THREE.MeshStandardMaterial({ color: "#000", emissive: "#ff6a1a", emissiveIntensity: 2.2 }));
    fire.rotation.y = Math.PI / 2; fire.position.set(-RW / 2 + 0.3 + 0.23, 0.3, 0.55); scene.add(fire);
    const fireL = new THREE.PointLight("#ff7a2a", 0.6, 2.5, 2); fireL.position.set(-RW / 2 + 0.8, 0.35, 0.55); scene.add(fireL);
    const stoneM = std("#6b6863", { roughness: .95 });
    for (let i = 0; i < 40; i++) { const s = new THREE.Mesh(new THREE.DodecahedronGeometry(rr(0.04, 0.07), 0), stoneM); s.position.set(-RW / 2 + 0.3 + rr(-0.18, 0.18), 0.8 + rr(0, 0.18), 0.55 + rr(-0.18, 0.18)); s.rotation.set(rr(0, 3), rr(0, 3), 0); s.castShadow = true; scene.add(s); }
    // langas
    const win = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.5), new THREE.MeshStandardMaterial({ color: "#000", emissive: "#3b5a8c", emissiveIntensity: 1.4 }));
    win.rotation.y = -Math.PI / 2; win.position.set(RW / 2 - 0.005, 1.65, 0.35); scene.add(win);
    const fr = std("#9b7a52");
    [[0, .27, .78, .04], [0, -.27, .78, .04]].forEach(([dz, dy, len]) => { const f = frameBox(0.04, 0.04, len, fr); f.position.set(RW / 2 - .02, 1.65 + dy, 0.35 + dz); scene.add(f); });
    // lubų šviesa
    const top = new THREE.PointLight("#ffd2a0", 1.4, 6, 2); top.position.set(0, RH - 0.2, 0.3); top.castShadow = true; top.shadow.mapSize.set(2048, 2048); scene.add(top);
    scene.add(new THREE.HemisphereLight("#ffe1bf", "#3a2a1d", 0.25));
    camera.fov = 62; camera.updateProjectionMatrix();
    camera.position.set(0.85, 1.45, RD / 2 - 0.08); camera.lookAt(-0.75, 0.8, -0.5);
    renderer.toneMappingExposure = 1.0;
    return composer(0.25, 0.4, 0.93);
  },
};

scenes.house2 = () => { const c = scenes.hero(); camera.position.set(-6.5, 1.7, 22); camera.lookAt(0.6, 2.5, 0); return c; };
const comp = scenes[SCENE]();
comp.render();
window.done = true;
