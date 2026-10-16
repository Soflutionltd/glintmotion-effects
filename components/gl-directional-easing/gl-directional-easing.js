(function () {
  var S = window.HyperShader;
  if (!S || typeof S.registerShader !== "function") {
    throw new Error("Load vendor/glintmotion/hyper-shader.js before this file: it adds shaders to that build of HyperShader.");
  }
  S.registerShader("gl-directional-easing", "// gl-directional-easing, from GL Transitions \"directional-easing\" by Max Plotnikov (MIT).\nfloat progress;\nfloat ratio;\nvec4 getFromColor(vec2 p){return texture2D(u_from,vec2(p.x,1.0-p.y));}\nvec4 getToColor(vec2 p){return texture2D(u_to,vec2(p.x,1.0-p.y));}\n// Author: Max Plotnikov\n// License: MIT\n// Description: Like Directional, with an eased movement\n// Tags: slide, push, directional\n\n// @param Direction of the movement\nconst vec2 direction = vec2(0.0, 1.0);\n\nvec4 transition (vec2 uv) {\n  float easing = sqrt((2.0 - progress) * progress);\n  vec2 p = uv + easing * sign(direction);\n  vec2 f = fract(p);\n  return mix(\n    getToColor(f),\n    getFromColor(f),\n    step(0.0, p.y) * step(p.y, 1.0) * step(0.0, p.x) * step(p.x, 1.0)\n  );\n}\n\nvoid main(){\n  progress=u_progress;\n  ratio=u_resolution.x/u_resolution.y;\n  gl_FragColor=transition(vec2(v_uv.x,1.0-v_uv.y));\n}\n");
})();
