#!/usr/bin/env node
// Builds the installable catalog (registry.json + components/*) from the sources:
//   transitions/gl/*.glsl + manifest.json   (scripts/import-gl-transitions.mjs)
//   vendor/hyper-shader/hyper-shader.js     (scripts/vendor-hyper-shader.sh)
//
//   node scripts/build-registry.mjs

import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const componentsDir = join(root, "components");
const SCHEMA_ITEM = "https://hyperframes.heygen.com/schema/registry-item.json";
const SHADER_RUNTIME = "hyper-shader";
const RUNTIME_TARGET = "vendor/glintmotion/hyper-shader.js";

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
const writeJson = (path, value) => writeFileSync(path, JSON.stringify(value, null, 2) + "\n");

function writeItem(item, files) {
  const dir = join(componentsDir, item.name);
  mkdirSync(dir, { recursive: true });
  for (const [name, contents] of Object.entries(files)) {
    if (contents instanceof URL) copyFileSync(contents, join(dir, name));
    else writeFileSync(join(dir, name), contents);
  }
  writeJson(join(dir, "registry-item.json"), { $schema: SCHEMA_ITEM, ...item });
}

const registerScript = (shaders) =>
  [
    "(function () {",
    "  var S = window.HyperShader;",
    '  if (!S || typeof S.registerShader !== "function") {',
    `    throw new Error("Load ${RUNTIME_TARGET} before this file: it adds shaders to that build of HyperShader.");`,
    "  }",
    ...shaders.map(({ name, body }) => `  S.registerShader(${JSON.stringify(name)}, ${JSON.stringify(body)});`),
    "})();",
    "",
  ].join("\n");

const usage = (names) =>
  `Load ${RUNTIME_TARGET}, then this file, then call HyperShader.init({ transitions: [{ time, shader: "${names[0]}", duration }] }).`;

rmSync(componentsDir, { recursive: true, force: true });
mkdirSync(componentsDir, { recursive: true });
const entries = [];

const runtime = join(root, "vendor", "hyper-shader", "hyper-shader.js");
if (!existsSync(runtime)) throw new Error("vendor/hyper-shader/hyper-shader.js is missing: run scripts/vendor-hyper-shader.sh");
writeItem(
  {
    name: SHADER_RUNTIME,
    type: "hyperframes:component",
    title: "HyperShader with registerShader",
    description:
      "The HyperShader transition runtime built from the Glintmotion fork: the 14 built-in shaders plus registerShader(name, glsl) for every transition in this catalog. Replaces the CDN script.",
    tags: ["transition", "shader", "webgl", "runtime"],
    author: "HeyGen HyperFrames contributors, Glintmotion",
    license: "Apache-2.0",
    files: [{ path: "hyper-shader.js", target: RUNTIME_TARGET, type: "hyperframes:asset" }],
  },
  { "hyper-shader.js": new URL(`file://${runtime}`) },
);
entries.push({ name: SHADER_RUNTIME, type: "hyperframes:component" });

const { transitions } = readJson(join(root, "transitions", "gl", "manifest.json"));
const shaders = transitions.map((t) => ({
  ...t,
  body: readFileSync(join(root, "transitions", "gl", `${t.name}.glsl`), "utf8"),
}));

const sentence = (text) => (/[.!?]$/.test(text) ? text : `${text}.`);
const titleCase = (text) => text.charAt(0).toUpperCase() + text.slice(1);

for (const t of shaders) {
  const file = `${t.name}.js`;
  writeItem(
    {
      name: t.name,
      type: "hyperframes:component",
      title: `${titleCase(t.original)} transition`,
      description: `${sentence(t.description ?? `GL Transitions "${t.original}"`)} ${usage([t.name])}`,
      tags: [...new Set(["transition", "shader", "webgl", "gl-transitions", ...t.tags.map((tag) => tag.toLowerCase())])],
      author: t.author,
      authorUrl: "https://gl-transitions.com",
      license: t.license.replace(/^BSD ([23]) Clause$/i, "BSD-$1-Clause"),
      registryDependencies: [SHADER_RUNTIME],
      files: [{ path: file, target: `vendor/glintmotion/transitions/${file}`, type: "hyperframes:asset" }],
    },
    { [file]: registerScript([t]) },
  );
  entries.push({ name: t.name, type: "hyperframes:component" });
}

writeItem(
  {
    name: "gl-transitions",
    type: "hyperframes:component",
    title: `All ${shaders.length} GL Transitions`,
    description: `Every GL Transitions shader in one file (${shaders.map((s) => s.name).join(", ")}). ${usage(["gl-cube"])}`,
    tags: ["transition", "shader", "webgl", "gl-transitions", "pack"],
    author: "gl-transitions contributors",
    authorUrl: "https://gl-transitions.com",
    license: "MIT",
    registryDependencies: [SHADER_RUNTIME],
    files: [{ path: "gl-transitions.js", target: "vendor/glintmotion/gl-transitions.js", type: "hyperframes:asset" }],
  },
  { "gl-transitions.js": registerScript(shaders) },
);
entries.push({ name: "gl-transitions", type: "hyperframes:component" });

const catalog = entries.map(({ name }) => {
  const item = readJson(join(componentsDir, name, "registry-item.json"));
  return {
    name,
    title: item.title,
    description: item.description,
    tags: item.tags ?? [],
    license: item.license,
    author: item.author,
  };
});
writeJson(join(root, "catalog.json"), { generated: "scripts/build-registry.mjs", items: catalog });

writeJson(join(root, "registry.json"), {
  $schema: "https://hyperframes.heygen.com/schema/registry.json",
  name: "glintmotion-effects",
  homepage: "https://github.com/Soflutionltd/glintmotion-effects",
  items: entries,
});

const count = readdirSync(componentsDir).length;
console.log(`registry.json: ${entries.length} items, ${count} component folders`);
