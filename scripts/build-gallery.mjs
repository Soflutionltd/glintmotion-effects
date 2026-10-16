#!/usr/bin/env node
// Writes a renderable project that plays every catalog transition in turn: the
// render is both the compile check (a shader that fails logs "Failed to compile")
// and the preview reel.
//
//   node scripts/build-gallery.mjs <out dir> [--only gl-cube,gl-wind] [--width 540 --height 960]

import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    only: { type: "string" },
    width: { type: "string", default: "540" },
    height: { type: "string", default: "960" },
  },
});
const out = positionals[0];
if (!out) {
  console.error("usage: build-gallery.mjs <out dir> [--only a,b] [--width W --height H]");
  process.exit(1);
}

const root = resolve(import.meta.dirname, "..");
const { transitions } = JSON.parse(readFileSync(join(root, "transitions", "gl", "manifest.json"), "utf8"));
const only = values.only ? new Set(values.only.split(",")) : null;
const picked = transitions.filter((t) => !only || only.has(t.name));
if (picked.length === 0) throw new Error("no transition matches --only");

const W = Number(values.width);
const H = Number(values.height);
const HOLD = 0.45;
const TRANSITION = 0.6;
const STEP = HOLD + TRANSITION;
const duration = Number((HOLD + picked.length * STEP + HOLD).toFixed(2));
const PALETTE = [
  ["#0f3d3e", "#e2b44b"],
  ["#2b1d4a", "#ff7a59"],
  ["#13293d", "#7ee0c3"],
  ["#3d0f2a", "#f4d35e"],
  ["#1e3a1e", "#f08a5d"],
  ["#262626", "#5ec8ff"],
];

const scene = (index, label, caption) => {
  const [bg, accent] = PALETTE[index % PALETTE.length];
  return `    <section class="scene" id="s${index}" style="background-color:${bg}">
      <div class="grid" style="background-image:linear-gradient(135deg, ${accent} 0%, rgba(0,0,0,0) 55%)"></div>
      <div class="num" style="color:${accent}">${String(index).padStart(3, "0")}</div>
      <div class="name">${label}</div>
      <div class="by">${caption}</div>
    </section>`;
};

const scenes = [scene(0, "GL Transitions", `${picked.length} transitions`)];
picked.forEach((t, i) => scenes.push(scene(i + 1, t.name, `${t.original} · ${t.author} · ${t.license}`)));

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <script src="vendor/glintmotion/hyper-shader.js"></script>
    <script src="vendor/glintmotion/gl-transitions.js"></script>
    <style>
      html, body { margin: 0; background-color: #000000; }
      #root { position: relative; width: ${W}px; height: ${H}px; overflow: hidden; font-family: Helvetica, Arial, sans-serif; }
      .scene { position: absolute; inset: 0; overflow: hidden; }
      .grid { position: absolute; inset: 0; opacity: 0.55; }
      .num { position: absolute; left: ${Math.round(W * 0.08)}px; top: ${Math.round(H * 0.1)}px; font-size: ${Math.round(W * 0.42)}px; font-weight: 800; letter-spacing: -0.05em; line-height: 1; }
      .name { position: absolute; left: ${Math.round(W * 0.08)}px; right: ${Math.round(W * 0.08)}px; top: ${Math.round(H * 0.62)}px; color: #f5f5f0; font-size: ${Math.round(W * 0.075)}px; font-weight: 700; }
      .by { position: absolute; left: ${Math.round(W * 0.08)}px; right: ${Math.round(W * 0.08)}px; top: ${Math.round(H * 0.7)}px; color: #d8d8d0; font-size: ${Math.round(W * 0.04)}px; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${duration}" data-width="${W}" data-height="${H}">
${scenes.join("\n")}
    </div>
    <script>
      const tl = HyperShader.init({
        bgColor: "#000000",
        accentColor: "#5ec8ff",
        scenes: ${JSON.stringify(scenes.map((_, i) => `s${i}`))},
        transitions: ${JSON.stringify(
          picked.map((t, i) => ({ time: Number((HOLD + i * STEP).toFixed(2)), shader: t.name, duration: TRANSITION, ease: "power1.inOut" })),
        )},
      });
      tl.fromTo(".num", { opacity: 0.85 }, { opacity: 1, duration: ${duration}, ease: "none" }, 0);
      window.__timelines = window.__timelines || {};
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
`;

mkdirSync(join(out, "vendor", "glintmotion"), { recursive: true });
copyFileSync(join(root, "components", "hyper-shader", "hyper-shader.js"), join(out, "vendor", "glintmotion", "hyper-shader.js"));
copyFileSync(join(root, "components", "gl-transitions", "gl-transitions.js"), join(out, "vendor", "glintmotion", "gl-transitions.js"));
writeFileSync(join(out, "index.html"), html);
writeFileSync(
  join(out, "timings.json"),
  JSON.stringify(picked.map((t, i) => ({ name: t.name, mid: Number((HOLD + i * STEP + TRANSITION / 2).toFixed(3)) })), null, 2) + "\n",
);
console.log(`${out}: ${picked.length} transitions, ${duration}s at ${W}x${H}`);
