(function () {
  var S = window.HyperShader;
  if (!S || typeof S.registerShader !== "function") {
    throw new Error("Load vendor/glintmotion/hyper-shader.js before this file: it adds shaders to that build of HyperShader.");
  }
  S.registerShader("gl-fold", "// gl-fold, from GL Transitions \"Fold\" by nwoeanhinnogaehr (MIT).\nfloat progress;\nfloat ratio;\nvec4 getFromColor(vec2 p){return texture2D(u_from,vec2(p.x,1.0-p.y));}\nvec4 getToColor(vec2 p){return texture2D(u_to,vec2(p.x,1.0-p.y));}\n// Author: nwoeanhinnogaehr\n// License: MIT\n// Description: The incoming image unfolds from the left while the outgoing one folds away to the right\n// Tags: fold, slide, horizontal\n// Ported from https://gist.github.com/nwoeanhinnogaehr/f6fc39f4cfcbb97f96a6\n\nvec4 transition(vec2 uv) {\n  // Only sample the visible side: the other one divides by zero at progress 0 and 1.\n  if (progress == 0.0 || uv.x > progress) return getFromColor((uv - vec2(progress, 0.0)) / vec2(1.0 - progress, 1.0));\n  return getToColor(uv / vec2(progress, 1.0));\n}\n\nvoid main(){\n  progress=u_progress;\n  ratio=u_resolution.x/u_resolution.y;\n  gl_FragColor=transition(vec2(v_uv.x,1.0-v_uv.y));\n}\n");
})();
