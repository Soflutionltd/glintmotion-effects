#!/usr/bin/env node
// Writes a renderable project that plays every hand-written effect in turn,
// some with several variable sets: the render, lint and motion check of this
// project are the acceptance test of effects/.
//
//   node scripts/build-effects-gallery.mjs <out dir> [--only split-headline,morph-icons] [--width 1080 --height 1920]

import { copyFileSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    only: { type: "string" },
    width: { type: "string", default: "1080" },
    height: { type: "string", default: "1920" },
  },
});
const out = positionals[0];
if (!out) {
  console.error("usage: build-effects-gallery.mjs <out dir> [--only a,b] [--width W --height H]");
  process.exit(1);
}

const VARIANTS = {
  "split-headline": [
    {},
    { split: "chars", align: "center", kicker: "", text: "Motion, made by hand." },
    { split: "lines", exit: "fade", text: "Lines are measured once the clip is on screen." },
  ],
  "morph-icons": [{}, { shapes: "play,chat,bell", labels: "", exit: "fade" }],
  "wiggle-badge": [{}, { glyph: "cart", count: 3, label: "3 items left" }],
};

const root = resolve(import.meta.dirname, "..");
const effectsDir = join(root, "effects");
const only = values.only ? new Set(values.only.split(",")) : null;
const names = readdirSync(effectsDir)
  .sort()
  .filter((name) => !only || only.has(name));
if (names.length === 0) throw new Error("no effect matches --only");

const W = Number(values.width);
const H = Number(values.height);
mkdirSync(join(out, "compositions", "components"), { recursive: true });

const clips = [];
const timings = [];
let time = 0;
for (const name of names) {
  const source = join(effectsDir, name, `${name}.html`);
  copyFileSync(source, join(out, "compositions", "components", `${name}.html`));
  const duration = Number(readFileSync(source, "utf8").match(/data-composition-duration="([^"]+)"/)[1]);
  for (const variables of VARIANTS[name] ?? [{}]) {
    const values = JSON.stringify(variables).replace(/'/g, "&#39;");
    clips.push(
      `      <div id="clip-${clips.length}" class="clip" data-composition-id="${name}" data-composition-src="compositions/components/${name}.html" data-variable-values='${values}' data-start="${time}" data-duration="${duration}" data-track-index="${clips.length % 2}"></div>`,
    );
    timings.push({ name, variables, start: time, end: time + duration });
    time = Number((time + duration).toFixed(3));
  }
}

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      html, body { margin: 0; background-color: #0c0d0f; }
      #root { position: relative; width: ${W}px; height: ${H}px; overflow: hidden; }
      #root > .clip { position: absolute; inset: 0; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${time}" data-width="${W}" data-height="${H}">
${clips.join("\n")}
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`;
writeFileSync(join(out, "index.html"), html);
writeFileSync(join(out, "timings.json"), JSON.stringify(timings, null, 2) + "\n");
console.log(`${out}/index.html: ${timings.length} clips, ${time}s`);
