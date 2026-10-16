#!/bin/sh
# Rebuilds vendor/hyper-shader/hyper-shader.js from a Glintmotion checkout.
#   scripts/vendor-hyper-shader.sh <path to the glintmotion repository>
set -eu

repo="${1:?usage: vendor-hyper-shader.sh <glintmotion repository>}"
here="$(cd "$(dirname "$0")/.." && pwd)"
out="$(mktemp -d)"
trap 'rm -rf "$out"' EXIT

(cd "$repo/packages/shader-transitions" && npx tsup --format iife --out-dir "$out" --no-dts --no-clean >/dev/null)
mkdir -p "$here/vendor/hyper-shader"
cp "$out/index.global.js" "$here/vendor/hyper-shader/hyper-shader.js"
version="$(node -p "require('$repo/packages/shader-transitions/package.json').version")"
commit="$(git -C "$repo" rev-parse --short HEAD)"
printf '{ "package": "@hyperframes/shader-transitions", "version": "%s", "glintmotion": "%s" }\n' "$version" "$commit" \
  > "$here/vendor/hyper-shader/source.json"
echo "vendored hyper-shader $version ($commit)"
