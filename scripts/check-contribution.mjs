#!/usr/bin/env node
// Static checks every effect must pass before a render is even tried: layout of
// the folder, metadata, licence, and code that must not reach the network,
// run arbitrary code or depend on the wall clock (renders seek the timeline,
// so anything outside it differs between frames and between machines).
//
//   node scripts/check-contribution.mjs            # every effect
//   node scripts/check-contribution.mjs a b        # only these effects

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const effectsDir = join(root, "effects");
const NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_BYTES = 200 * 1024;
const LICENSES = new Set([
  "PolyForm-Noncommercial-1.0.0",
  "MIT",
  "Apache-2.0",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "ISC",
  "CC0-1.0",
  "CC-BY-4.0",
]);
const ALLOWED_FILES = /\.(html|json|md)$/;
const SCRIPT_SOURCES = [
  /^https:\/\/cdn\.jsdelivr\.net\/npm\/gsap@3\.\d+\.\d+\/dist\/[A-Za-z0-9]+\.min\.js$/,
  /^https:\/\/cdn\.jsdelivr\.net\/npm\/three@0\.\d+\.\d+\/build\/three\.module\.min\.js$/,
];
const FORBIDDEN = [
  [/\bfetch\s*\(/, "fetch(): effects must not reach the network"],
  [/\bXMLHttpRequest\b/, "XMLHttpRequest: effects must not reach the network"],
  [/\b(WebSocket|EventSource|RTCPeerConnection)\b/, "network connection API"],
  [/\bsendBeacon\b/, "navigator.sendBeacon: effects must not reach the network"],
  [/\beval\s*\(/, "eval(): no code from strings"],
  [/\bnew\s+Function\b/, "new Function: no code from strings"],
  [/\bimport\s*\(/, "dynamic import(): only the allowed CDN scripts may load"],
  [/\b(importScripts|Worker|SharedWorker|serviceWorker)\b/, "workers are not allowed"],
  [/\b(localStorage|sessionStorage|indexedDB)\b|document\.cookie/, "storage is not allowed"],
  [/\bwindow\.open\b|\bpostMessage\b/, "no other windows"],
  [/navigator\.(geolocation|mediaDevices|clipboard|credentials)/, "device API"],
  [/<\s*(iframe|object|embed|base)\b/i, "<iframe>, <object>, <embed> and <base> are not allowed"],
  [/\bon[a-z]+\s*=\s*["']/i, "inline event handler attribute"],
  [/\bjavascript:/i, "javascript: URL"],
  [/\bMath\.random\b/, "Math.random: use a fixed-seed generator so every render is identical"],
  [/\b(Date\.now|performance\.now|new\s+Date)\b/, "wall clock: take time from the timeline"],
  [/\b(setTimeout|setInterval|requestAnimationFrame)\b/, "timers: animate on the paused timeline only"],
];

const errors = [];
const fail = (name, message) => errors.push(`effects/${name}: ${message}`);

function checkEffect(name) {
  const dir = join(effectsDir, name);
  if (!NAME.test(name)) return fail(name, "folder name must be kebab-case (a-z, 0-9, -)");
  for (const file of readdirSync(dir)) {
    const path = join(dir, file);
    if (statSync(path).isDirectory()) fail(name, `${file}/: sub-folders are not allowed`);
    else if (!ALLOWED_FILES.test(file)) fail(name, `${file}: only .html, .json and .md files`);
    else if (statSync(path).size > MAX_BYTES) fail(name, `${file}: larger than ${MAX_BYTES / 1024} KB`);
  }

  const htmlPath = join(dir, `${name}.html`);
  const metaPath = join(dir, "effect.json");
  if (!existsSync(htmlPath)) fail(name, `${name}.html is missing`);
  if (!existsSync(metaPath)) fail(name, "effect.json is missing");
  if (!existsSync(htmlPath) || !existsSync(metaPath)) return;

  let meta;
  try {
    meta = JSON.parse(readFileSync(metaPath, "utf8"));
  } catch (error) {
    return fail(name, `effect.json is not valid JSON: ${error.message}`);
  }
  for (const field of ["title", "description"]) {
    if (typeof meta[field] !== "string" || meta[field].trim().length < 3) fail(name, `effect.json needs a ${field}`);
  }
  if (!Array.isArray(meta.tags) || meta.tags.length === 0 || !meta.tags.every((t) => typeof t === "string" && NAME.test(t))) {
    fail(name, "effect.json needs kebab-case tags");
  }
  if (meta.license !== undefined && !LICENSES.has(meta.license)) {
    fail(name, `license "${meta.license}" is not accepted (${[...LICENSES].join(", ")})`);
  }
  if (meta.license && meta.license !== "PolyForm-Noncommercial-1.0.0" && typeof meta.author !== "string") {
    fail(name, "third-party work needs an author in effect.json");
  }

  const html = readFileSync(htmlPath, "utf8");
  if (!html.includes(`data-composition-id="${name}"`)) fail(name, `the composition id must be "${name}"`);
  if (!/<template>/.test(html)) fail(name, "the component must live in a <template>");
  if (!/data-composition-duration="\d+(\.\d+)?"/.test(html)) fail(name, "data-composition-duration is required");
  const variables = html.match(/data-composition-variables='([^']*)'/)?.[1];
  if (!variables) fail(name, "data-composition-variables is required (use [] for none)");
  else {
    try {
      if (!Array.isArray(JSON.parse(variables))) throw new Error("not an array");
    } catch (error) {
      fail(name, `data-composition-variables is not a JSON array: ${error.message}`);
    }
  }
  if (!html.includes(`window.__timelines["${name}"]`)) {
    fail(name, `register the paused timeline as window.__timelines["${name}"]`);
  }

  for (const [, src] of html.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi)) {
    if (!SCRIPT_SOURCES.some((allowed) => allowed.test(src))) fail(name, `script ${src} is not on the allowed CDN list`);
  }
  const code = html.replace(/<!--[\s\S]*?-->/g, "");
  for (const [, url] of code.matchAll(/(?:href|src|url\()\s*=?\s*["']?(https?:\/\/[^"')\s]+)/gi)) {
    if (!SCRIPT_SOURCES.some((allowed) => allowed.test(url))) fail(name, `external resource ${url}: ship it in the effect instead`);
  }
  for (const [pattern, why] of FORBIDDEN) {
    if (pattern.test(code)) fail(name, why);
  }
}

const requested = process.argv.slice(2);
const names = requested.length > 0 ? requested : readdirSync(effectsDir).sort();
for (const name of names) {
  if (!existsSync(join(effectsDir, name))) fail(name, "no such effect");
  else checkEffect(name);
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  console.error(`\n${errors.length} problem(s). See CONTRIBUTING.md.`);
  process.exit(1);
}
console.log(`${names.length} effect(s) pass the static checks.`);
