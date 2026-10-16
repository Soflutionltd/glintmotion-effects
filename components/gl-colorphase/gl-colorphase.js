(function () {
  var S = window.HyperShader;
  if (!S || typeof S.registerShader !== "function") {
    throw new Error("Load vendor/glintmotion/hyper-shader.js before this file: it adds shaders to that build of HyperShader.");
  }
  S.registerShader("gl-colorphase", "// gl-colorphase, from GL Transitions \"colorphase\" by gre (MIT).\nfloat progress;\nfloat ratio;\nvec4 getFromColor(vec2 p){return texture2D(u_from,vec2(p.x,1.0-p.y));}\nvec4 getToColor(vec2 p){return texture2D(u_to,vec2(p.x,1.0-p.y));}\n// Author: gre\n// License: MIT\n// Description: A crossfade in which each color channel changes at a different time\n// Tags: fade, color\n\n// Usage: fromStep and toStep must be in [0.0, 1.0] range \n// and all(fromStep) must be < all(toStep)\n\n// @range(0, 1) When each channel (r, g, b, a) starts changing\nconst vec4 fromStep = vec4(0.0, 0.2, 0.4, 0.0);\n// @range(0, 1) When each channel (r, g, b, a) finishes changing\nconst vec4 toStep = vec4(0.6, 0.8, 1.0, 1.0);\n\nvec4 transition (vec2 uv) {\n  vec4 a = getFromColor(uv);\n  vec4 b = getToColor(uv);\n  return mix(a, b, smoothstep(fromStep, toStep, vec4(progress)));\n}\n\nvoid main(){\n  progress=u_progress;\n  ratio=u_resolution.x/u_resolution.y;\n  gl_FragColor=transition(vec2(v_uv.x,1.0-v_uv.y));\n}\n");
})();
