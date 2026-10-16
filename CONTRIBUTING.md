# Contributing an effect

Effects made with an AI agent are welcome, as long as they pass the checks and the review.

## What an effect must do

- Run from a seekable timeline: GSAP on the composition timeline, Lottie, Three.js or WebGL
  driven by the timeline time. The renderer draws frame by frame and seeks back and forth;
  anything driven by `requestAnimationFrame`, `Date.now()` or `Math.random()` breaks.
- Work offline: no `fetch`, `XMLHttpRequest`, `WebSocket`, `import()` of remote code, `eval`
  or `new Function`. Libraries load from the pinned CDN URLs already used in this repository
  (GSAP, Three.js, Lottie).
- Pass `lint`, the layout check and the motion check, and render without errors.
- Contain no brand, logo, product or person you do not own.

## What to send

One folder under `components/<name>/` with `registry-item.json` and its files, in the
HyperFrames registry format. `license` must name the license of the code (SPDX id). Code you
did not write needs a license that allows redistribution, and its original author and
license stay in the file header.

## Review

Every pull request is checked automatically (static checks, lint, render) and then reviewed.
A maintainer merges it; nothing is merged by the robot alone.

## Rights in your contribution

By opening a pull request you confirm that you wrote the contribution or have the right to
submit it under its stated license, and you grant Soflution Ltd a perpetual, worldwide,
non-exclusive, royalty-free, irrevocable license to use, copy, modify, distribute,
sublicense and use commercially your contribution, as part of this repository or separately.
Third-party code you include keeps its own license.
