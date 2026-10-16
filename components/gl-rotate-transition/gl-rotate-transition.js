(function () {
  var S = window.HyperShader;
  if (!S || typeof S.registerShader !== "function") {
    throw new Error("Load vendor/glintmotion/hyper-shader.js before this file: it adds shaders to that build of HyperShader.");
  }
  S.registerShader("gl-rotate-transition", "// gl-rotate-transition, from GL Transitions \"rotateTransition\" by haiyoucuv (MIT).\nfloat progress;\nfloat ratio;\nvec4 getFromColor(vec2 p){return texture2D(u_from,vec2(p.x,1.0-p.y));}\nvec4 getToColor(vec2 p){return texture2D(u_to,vec2(p.x,1.0-p.y));}\n// Author: haiyoucuv\n// License: MIT\n// Description: The images spin around the center while crossfading\n// Tags: rotate, spin, blend\n\n#define PI 3.1415926\n\nvec2 rotate2D(in vec2 uv, in float angle){\n  \n  return uv * mat2(cos(angle), -sin(angle), sin(angle), cos(angle));\n}\nvec4 transition (vec2 uv) {\n  \n  vec2 p = fract(rotate2D(uv - 0.5, progress * PI * 2.0) + 0.5);\n\n  return mix(\n    getFromColor(p),\n    getToColor(p),\n    progress\n  );\n}\n\nvoid main(){\n  progress=u_progress;\n  ratio=u_resolution.x/u_resolution.y;\n  gl_FragColor=transition(vec2(v_uv.x,1.0-v_uv.y));\n}\n");
})();
