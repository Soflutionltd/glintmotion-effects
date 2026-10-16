(function () {
  var S = window.HyperShader;
  if (!S || typeof S.registerShader !== "function") {
    throw new Error("Load vendor/glintmotion/hyper-shader.js before this file: it adds shaders to that build of HyperShader.");
  }
  S.registerShader("gl-simple-flip", "// gl-simple-flip, from GL Transitions \"SimpleFlip\" by nwoeanhinnogaehr (MIT).\nfloat progress;\nfloat ratio;\nvec4 getFromColor(vec2 p){return texture2D(u_from,vec2(p.x,1.0-p.y));}\nvec4 getToColor(vec2 p){return texture2D(u_to,vec2(p.x,1.0-p.y));}\n// Author: nwoeanhinnogaehr\n// License: MIT\n// Description: The outgoing image flips around the vertical axis into the incoming one\n// Tags: flip, horizontal\n// Ported from https://gist.github.com/nwoeanhinnogaehr/408045772d255df97520\n\nvec4 transition(vec2 uv) {\n  vec2 q = uv;\n  uv.x = (uv.x - 0.5) / abs(progress - 0.5) * 0.5 + 0.5;\n  vec4 a = getFromColor(uv);\n  vec4 b = getToColor(uv);\n  return vec4(mix(a, b, step(0.5, progress)).rgb * step(abs(q.x - 0.5), abs(progress - 0.5)), 1.0);\n}\n\nvoid main(){\n  progress=u_progress;\n  ratio=u_resolution.x/u_resolution.y;\n  gl_FragColor=transition(vec2(v_uv.x,1.0-v_uv.y));\n}\n");
})();
