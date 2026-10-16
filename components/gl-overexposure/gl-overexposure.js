(function () {
  var S = window.HyperShader;
  if (!S || typeof S.registerShader !== "function") {
    throw new Error("Load vendor/glintmotion/hyper-shader.js before this file: it adds shaders to that build of HyperShader.");
  }
  S.registerShader("gl-overexposure", "// gl-overexposure, from GL Transitions \"Overexposure\" by Ben Zhang (MIT).\nfloat progress;\nfloat ratio;\nvec4 getFromColor(vec2 p){return texture2D(u_from,vec2(p.x,1.0-p.y));}\nvec4 getToColor(vec2 p){return texture2D(u_to,vec2(p.x,1.0-p.y));}\n// Author: Ben Zhang\n// License: MIT\n// Description: A crossfade through a washed-out, overexposed white\n// Tags: flash, light, fade\n\n// @param Amount of overexposure\nconst float strength = 0.6;\nconst float PI = 3.141592653589793;\n\nvec4 transition (vec2 uv) {\n  vec4 from = getFromColor(uv);\n  vec4 to = getToColor(uv);\n\n  // Multipliers\n  float from_m = 1.0 - progress + sin(PI * progress) * strength;\n  float to_m = progress + sin(PI * progress) * strength;\n  \n  return vec4(\n    from.r * from.a * from_m + to.r * to.a * to_m,\n    from.g * from.a * from_m + to.g * to.a * to_m,\n    from.b * from.a * from_m + to.b * to.a * to_m,\n    mix(from.a, to.a, progress)\n  );\n}\n\nvoid main(){\n  progress=u_progress;\n  ratio=u_resolution.x/u_resolution.y;\n  gl_FragColor=transition(vec2(v_uv.x,1.0-v_uv.y));\n}\n");
})();
