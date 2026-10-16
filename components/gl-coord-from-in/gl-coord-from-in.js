(function () {
  var S = window.HyperShader;
  if (!S || typeof S.registerShader !== "function") {
    throw new Error("Load vendor/glintmotion/hyper-shader.js before this file: it adds shaders to that build of HyperShader.");
  }
  S.registerShader("gl-coord-from-in", "// gl-coord-from-in, from GL Transitions \"coord-from-in\" by haiyoucuv (MIT).\nfloat progress;\nfloat ratio;\nvec4 getFromColor(vec2 p){return texture2D(u_from,vec2(p.x,1.0-p.y));}\nvec4 getToColor(vec2 p){return texture2D(u_to,vec2(p.x,1.0-p.y));}\n// Author: haiyoucuv\n// License: MIT\n// Description: A crossfade in which the colors of one image displace the other\n// Tags: displace, distort, blend\n\nvec4 transition (vec2 uv) {\n\n  vec4 coordTo = getToColor(uv);\n  vec4 coordFrom = getFromColor(uv);\n\n  return mix(\n    getFromColor(mix(uv, coordTo.rg, progress)),\n    getToColor(mix(coordFrom.rg, uv, progress)),\n    progress\n  );\n\n}\n\nvoid main(){\n  progress=u_progress;\n  ratio=u_resolution.x/u_resolution.y;\n  gl_FragColor=transition(vec2(v_uv.x,1.0-v_uv.y));\n}\n");
})();
