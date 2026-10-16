(function () {
  var S = window.HyperShader;
  if (!S || typeof S.registerShader !== "function") {
    throw new Error("Load vendor/glintmotion/hyper-shader.js before this file: it adds shaders to that build of HyperShader.");
  }
  S.registerShader("gl-burn", "// gl-burn, from GL Transitions \"burn\" by gre (MIT).\nfloat progress;\nfloat ratio;\nvec4 getFromColor(vec2 p){return texture2D(u_from,vec2(p.x,1.0-p.y));}\nvec4 getToColor(vec2 p){return texture2D(u_to,vec2(p.x,1.0-p.y));}\n// Author: gre\n// License: MIT\n// Description: A crossfade that brightens toward a color in the middle\n// Tags: fade, color, flash\n// @color Color the images brighten toward\nconst vec3 color = vec3(0.9, 0.4, 0.2);\nvec4 transition (vec2 uv) {\n  return mix(\n    getFromColor(uv) + vec4(progress*color, 1.0),\n    getToColor(uv) + vec4((1.0-progress)*color, 1.0),\n    progress\n  );\n}\n\nvoid main(){\n  progress=u_progress;\n  ratio=u_resolution.x/u_resolution.y;\n  gl_FragColor=transition(vec2(v_uv.x,1.0-v_uv.y));\n}\n");
})();
