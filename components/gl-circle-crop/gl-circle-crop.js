(function () {
  var S = window.HyperShader;
  if (!S || typeof S.registerShader !== "function") {
    throw new Error("Load vendor/glintmotion/hyper-shader.js before this file: it adds shaders to that build of HyperShader.");
  }
  S.registerShader("gl-circle-crop", "// gl-circle-crop, from GL Transitions \"CircleCrop\" by fkuteken (MIT).\nfloat progress;\nfloat ratio;\nvec4 getFromColor(vec2 p){return texture2D(u_from,vec2(p.x,1.0-p.y));}\nvec4 getToColor(vec2 p){return texture2D(u_to,vec2(p.x,1.0-p.y));}\n// License: MIT\n// Author: fkuteken\n// Description: The outgoing image closes into a circle over a background color, then the incoming one opens from it\n// Tags: circle, iris, shape\n// ported by gre from https://gist.github.com/fkuteken/f63e3009c1143950dee9063c3b83fb88\n\n// @color Background color\nconst vec4 bgcolor = vec4(0.0, 0.0, 0.0, 1.0);\n\nvec4 transition(vec2 p) {\n  vec2 ratio2 = vec2(1.0, 1.0 / ratio);\n  float s = pow(2.0 * abs(progress - 0.5), 3.0);\n  float dist = length((vec2(p) - 0.5) * ratio2);\n  return mix(\n    progress < 0.5 ? getFromColor(p) : getToColor(p), // branching is ok here as we statically depend on progress uniform (branching won't change over pixels)\n    bgcolor,\n    step(s, dist)\n  );\n}\n\nvoid main(){\n  progress=u_progress;\n  ratio=u_resolution.x/u_resolution.y;\n  gl_FragColor=transition(vec2(v_uv.x,1.0-v_uv.y));\n}\n");
})();
