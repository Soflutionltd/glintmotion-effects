(function () {
  var S = window.HyperShader;
  if (!S || typeof S.registerShader !== "function") {
    throw new Error("Load vendor/glintmotion/hyper-shader.js before this file: it adds shaders to that build of HyperShader.");
  }
  S.registerShader("gl-vertical-close", "// gl-vertical-close, from GL Transitions \"VerticalClose\" by martiniti (MIT).\nfloat progress;\nfloat ratio;\nvec4 getFromColor(vec2 p){return texture2D(u_from,vec2(p.x,1.0-p.y));}\nvec4 getToColor(vec2 p){return texture2D(u_to,vec2(p.x,1.0-p.y));}\n// Author: martiniti\n// License: MIT\n// Description: The incoming image closes in from the left and right edges toward the middle\n// Tags: wipe, split\n\nvec4 transition (vec2 uv) {\n\n  float s = 2.0 - abs((uv.x - 0.5) / (progress - 1.0)) - 2.0 * progress;\n  \n  return mix(\n    getFromColor(uv),\n    getToColor(uv),\n    smoothstep(0.5, 0.0, s)\n  );\n}\n\nvoid main(){\n  progress=u_progress;\n  ratio=u_resolution.x/u_resolution.y;\n  gl_FragColor=transition(vec2(v_uv.x,1.0-v_uv.y));\n}\n");
})();
