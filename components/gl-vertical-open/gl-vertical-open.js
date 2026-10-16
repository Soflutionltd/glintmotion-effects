(function () {
  var S = window.HyperShader;
  if (!S || typeof S.registerShader !== "function") {
    throw new Error("Load vendor/glintmotion/hyper-shader.js before this file: it adds shaders to that build of HyperShader.");
  }
  S.registerShader("gl-vertical-open", "// gl-vertical-open, from GL Transitions \"VerticalOpen\" by martiniti (MIT).\nfloat progress;\nfloat ratio;\nvec4 getFromColor(vec2 p){return texture2D(u_from,vec2(p.x,1.0-p.y));}\nvec4 getToColor(vec2 p){return texture2D(u_to,vec2(p.x,1.0-p.y));}\n// Author: martiniti\n// License: MIT\n// Description: The incoming image opens from a line in the middle toward the left and right edges\n// Tags: wipe, split\n\nvec4 transition (vec2 uv) {\n\n  float regress = 1.0 - progress;\n  float s = 2.0 - abs((uv.x - 0.5) / (regress - 1.0)) - 2.0 * regress;\n  \n  return mix(\n    getFromColor(uv),\n    getToColor(uv),\n    smoothstep(0.0, 0.5, s)\n  );\n}\n\nvoid main(){\n  progress=u_progress;\n  ratio=u_resolution.x/u_resolution.y;\n  gl_FragColor=transition(vec2(v_uv.x,1.0-v_uv.y));\n}\n");
})();
