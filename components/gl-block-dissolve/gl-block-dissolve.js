(function () {
  var S = window.HyperShader;
  if (!S || typeof S.registerShader !== "function") {
    throw new Error("Load vendor/glintmotion/hyper-shader.js before this file: it adds shaders to that build of HyperShader.");
  }
  S.registerShader("gl-block-dissolve", "// gl-block-dissolve, from GL Transitions \"BlockDissolve\" by nwoeanhinnogaehr (MIT).\nfloat progress;\nfloat ratio;\nvec4 getFromColor(vec2 p){return texture2D(u_from,vec2(p.x,1.0-p.y));}\nvec4 getToColor(vec2 p){return texture2D(u_to,vec2(p.x,1.0-p.y));}\n// Author: nwoeanhinnogaehr\n// License: MIT\n// Description: The incoming image appears in small random blocks\n// Tags: dissolve, blocks, noise\n// Ported from https://gist.github.com/nwoeanhinnogaehr/b93818de23d4511fde10\n\nconst float blocksize = 0.02;\n\nfloat rand(vec2 co) {\n  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);\n}\n\nvec4 transition(vec2 uv) {\n  return mix(getFromColor(uv), getToColor(uv), step(rand(floor(uv / blocksize)), progress));\n}\n\nvoid main(){\n  progress=u_progress;\n  ratio=u_resolution.x/u_resolution.y;\n  gl_FragColor=transition(vec2(v_uv.x,1.0-v_uv.y));\n}\n");
})();
