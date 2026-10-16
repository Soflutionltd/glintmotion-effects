(function () {
  var S = window.HyperShader;
  if (!S || typeof S.registerShader !== "function") {
    throw new Error("Load vendor/glintmotion/hyper-shader.js before this file: it adds shaders to that build of HyperShader.");
  }
  S.registerShader("gl-wind", "// gl-wind, from GL Transitions \"wind\" by gre (MIT).\nfloat progress;\nfloat ratio;\nvec4 getFromColor(vec2 p){return texture2D(u_from,vec2(p.x,1.0-p.y));}\nvec4 getToColor(vec2 p){return texture2D(u_to,vec2(p.x,1.0-p.y));}\n// Author: gre\n// License: MIT\n// Description: A ragged left-to-right wipe, as if the image was blown away by the wind\n// Tags: wipe, horizontal, noise\n\n// @range(0, 1) Width of the ragged edge\nconst float size = 0.2;\n// @param Wipe from right to left instead\nconst bool reversed = false;\n\nfloat rand (vec2 co) {\n  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\n}\n\nvec4 transition (vec2 uv) {\n  float x = reversed ? 1. - uv.x : uv.x;\n  float r = rand(vec2(0, uv.y));\n  float m = smoothstep(0.0, -size, x*(1.0-size) + size*r - (progress * (1.0 + size)));\n  return mix(\n    getFromColor(uv),\n    getToColor(uv),\n    m\n  );\n}\n\nvoid main(){\n  progress=u_progress;\n  ratio=u_resolution.x/u_resolution.y;\n  gl_FragColor=transition(vec2(v_uv.x,1.0-v_uv.y));\n}\n");
})();
