(function () {
  var S = window.HyperShader;
  if (!S || typeof S.registerShader !== "function") {
    throw new Error("Load vendor/glintmotion/hyper-shader.js before this file: it adds shaders to that build of HyperShader.");
  }
  S.registerShader("gl-scale-in", "// gl-scale-in, from GL Transitions \"scale-in\" by haiyoucuv (MIT).\nfloat progress;\nfloat ratio;\nvec4 getFromColor(vec2 p){return texture2D(u_from,vec2(p.x,1.0-p.y));}\nvec4 getToColor(vec2 p){return texture2D(u_to,vec2(p.x,1.0-p.y));}\n// Author: haiyoucuv\n// License: MIT\n// Description: The incoming image scales in from the center while fading in\n// Tags: zoom, fade\n\nvec4 scale(in vec2 uv){\n    uv = 0.5 + (uv - 0.5) * progress;\n    return getToColor(uv);\n}\n\nvec4 transition (vec2 uv) {\n  return mix(\n    getFromColor(uv),\n    scale(uv),\n    progress\n  );\n}\n\nvoid main(){\n  progress=u_progress;\n  ratio=u_resolution.x/u_resolution.y;\n  gl_FragColor=transition(vec2(v_uv.x,1.0-v_uv.y));\n}\n");
})();
