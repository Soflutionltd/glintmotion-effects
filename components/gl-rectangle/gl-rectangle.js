(function () {
  var S = window.HyperShader;
  if (!S || typeof S.registerShader !== "function") {
    throw new Error("Load vendor/glintmotion/hyper-shader.js before this file: it adds shaders to that build of HyperShader.");
  }
  S.registerShader("gl-rectangle", "// gl-rectangle, from GL Transitions \"Rectangle\" by martiniti (MIT).\nfloat progress;\nfloat ratio;\nvec4 getFromColor(vec2 p){return texture2D(u_from,vec2(p.x,1.0-p.y));}\nvec4 getToColor(vec2 p){return texture2D(u_to,vec2(p.x,1.0-p.y));}\n// Author: martiniti\n// License: MIT\n// Description: A rectangle grows from the center to cover the outgoing image, then shrinks to reveal the incoming one\n// Tags: box, shape, iris\n\n// @color Color of the rectangle\nconst vec4 bgcolor = vec4(0.0, 0.0, 0.0, 1.0);\n\nvec4 transition(vec2 p) {\n  float s = pow(2.0 * abs(progress - 0.5), 3.0);\n  \n   vec2 sq = p.xy / vec2(1.0).xy;\n   \n    // bottom-left\n    vec2 bl = step(vec2(abs(1. - 2.*progress)), sq + .25);\n    float dist = bl.x * bl.y;\n\n    // top-right\n    vec2 tr = step(vec2(abs(1. - 2.*progress)), 1.25-sq);\n    dist *= 1. * tr.x * tr.y;\n  \n  return mix(\n    progress < 0.5 ? getFromColor(p) : getToColor(p),\n    bgcolor,\n    step(s, dist)\n  );\n  \n}\n\nvoid main(){\n  progress=u_progress;\n  ratio=u_resolution.x/u_resolution.y;\n  gl_FragColor=transition(vec2(v_uv.x,1.0-v_uv.y));\n}\n");
})();
