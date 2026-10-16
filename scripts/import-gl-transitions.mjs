#!/usr/bin/env node
// Converts the GL Transitions collection (https://github.com/gl-transitions/gl-transitions)
// into shaders for HyperShader.registerShader, plus a manifest of authors and licenses.
//
//   node scripts/import-gl-transitions.mjs <path to gl-transitions/transitions>
//
// GL Transitions work in GL coordinates (y up) and call getFromColor/getToColor;
// HyperShader samples images with y down. The wrapper flips both ways so every
// transition keeps its original direction.

import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";

const PERMISSIVE = /^(MIT|BSD[ -]?[23][ -]?Clause|Apache[ -]?2(\.0)?|CC0|Unlicense|ISC)$/i;
const NEEDS_TEXTURE = /uniform\s+sampler2D/;

const source = process.argv[2];
if (!source) {
  console.error("usage: import-gl-transitions.mjs <gl-transitions/transitions>");
  process.exit(1);
}

const root = resolve(import.meta.dirname, "..");
const outDir = join(root, "transitions", "gl");

const kebab = (name) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const header = (text, key) => {
  const match = text.match(new RegExp(`^//\\s*${key}\\s*:\\s*(.+)$`, "im"));
  return match ? match[1].trim() : null;
};

// float uniforms whose default is written as an integer ("= 30") need "30.0";
// GLSL ES has no implicit int -> float conversion.
function constantFor(type, value) {
  const trimmed = value.trim().replace(/;$/, "");
  if (type === "float" && /^-?\d+$/.test(trimmed)) return `${trimmed}.0`;
  if (type === "int" && /^-?\d+\.0*$/.test(trimmed)) return trimmed.replace(/\.0*$/, "");
  return trimmed;
}

const UNIFORM =
  /^\s*uniform\s+(bool|int|float|vec[234]|ivec[234]|bvec[234])\s+([A-Za-z_]\w*)\s*(?:;\s*\/\/\s*=\s*(.+?)\s*$|\/\*\s*=\s*(.+?)\s*\*\/\s*;?\s*$|;\s*$)/;

function convert(text) {
  const params = [];
  const lines = text.split("\n").map((line) => {
    const match = line.match(UNIFORM);
    if (!match) return line;
    const [, type, name, slashDefault, blockDefault] = match;
    const value = slashDefault ?? blockDefault;
    if (value === undefined) throw new Error(`uniform ${name} has no default`);
    const constant = constantFor(type, value);
    params.push({ name, type, default: constant });
    return `const ${type} ${name} = ${constant};`;
  });
  const body = [
    "float progress;",
    "float ratio;",
    "vec4 getFromColor(vec2 p){return texture2D(u_from,vec2(p.x,1.0-p.y));}",
    "vec4 getToColor(vec2 p){return texture2D(u_to,vec2(p.x,1.0-p.y));}",
    ...lines,
    "void main(){",
    "  progress=u_progress;",
    "  ratio=u_resolution.x/u_resolution.y;",
    "  gl_FragColor=transition(vec2(v_uv.x,1.0-v_uv.y));",
    "}",
  ].join("\n");
  return { body, params };
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const manifest = [];
const skipped = [];
for (const file of readdirSync(source).filter((f) => f.endsWith(".glsl")).sort()) {
  const text = readFileSync(join(source, file), "utf8");
  const original = basename(file, ".glsl");
  const license = header(text, "License") ?? "MIT";
  if (!PERMISSIVE.test(license)) {
    skipped.push({ file, reason: `license ${license}` });
    continue;
  }
  if (NEEDS_TEXTURE.test(text)) {
    skipped.push({ file, reason: "needs an extra texture" });
    continue;
  }
  let converted;
  try {
    converted = convert(text);
  } catch (error) {
    skipped.push({ file, reason: error.message });
    continue;
  }
  const name = `gl-${kebab(original)}`;
  const author = header(text, "Author") ?? "gl-transitions contributors";
  const description = header(text, "Description");
  const tags = (header(text, "Tags") ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const attribution = `// ${name}, from GL Transitions "${original}" by ${author} (${license}).\n`;
  writeFileSync(join(outDir, `${name}.glsl`), attribution + converted.body + "\n");
  manifest.push({ name, original, author, license, description, tags, params: converted.params });
}

writeFileSync(join(outDir, "manifest.json"), JSON.stringify({ transitions: manifest, skipped }, null, 2) + "\n");
console.log(`${manifest.length} transitions converted, ${skipped.length} skipped`);
for (const s of skipped) console.log(`  skipped ${s.file}: ${s.reason}`);
