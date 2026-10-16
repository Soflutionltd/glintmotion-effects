# Contributing an effect

Effects made with an AI agent are welcome, as long as they pass the checks and the review.

## What an effect must do

- Run from a seekable timeline: GSAP on the composition timeline, Lottie, Three.js or WebGL
  driven by the timeline time. The renderer draws frame by frame and seeks back and forth;
  anything driven by `requestAnimationFrame`, `Date.now()` or `Math.random()` breaks.
- Work offline: no `fetch`, `XMLHttpRequest`, `WebSocket`, `import()` of remote code, `eval`
  or `new Function`, no storage, no timers. Scripts load only from the pinned CDN URLs
  (`cdn.jsdelivr.net/npm/gsap@3.x.y/dist/*.min.js`, `three@0.x.y/build/three.module.min.js`);
  any other file ships inside the effect.
- Pass `lint`, the layout check and the motion check, and render without errors.
- Contain no brand, logo, product or person you do not own.

## What to send

One folder `effects/<name>/` (kebab-case), with only `.html`, `.json` and `.md` files of at
most 200 KB each:

- `<name>.html`: a HyperFrames component in a `<template>`, with
  `data-composition-id="<name>"`, `data-composition-duration` and
  `data-composition-variables` (a JSON array, `[]` for none), registering its paused
  timeline as `window.__timelines["<name>"]`. The effects already in `effects/` are the
  reference.
- `effect.json`: `title`, `description`, kebab-case `tags`, and for work you did not write,
  `author`, `authorUrl` and `license` (SPDX id: MIT, Apache-2.0, BSD-2-Clause,
  BSD-3-Clause, ISC, CC0-1.0, CC-BY-4.0). Without `license`, the effect is your original
  work under the repository license.

Then run, and commit what they generate:

```sh
node scripts/check-contribution.mjs <name>
node scripts/build-registry.mjs
node scripts/build-effects-gallery.mjs /tmp/fx --only <name>   # render /tmp/fx and look at it
```

## Review

Every pull request runs `Check effects` (static checks, generated catalog up to date, lint,
a real render of every effect, attached to the run) and `AI review`, which comments on
security, determinism, licence and quality. Both are advisory to a maintainer, who watches
the render and merges; nothing is merged by a robot.

## Rights in your contribution

By opening a pull request you confirm that you wrote the contribution or have the right to
submit it under its stated license, and you grant Soflution Ltd a perpetual, worldwide,
non-exclusive, royalty-free, irrevocable license to use, copy, modify, distribute,
sublicense and use commercially your contribution, as part of this repository or separately.
Third-party code you include keeps its own license.
