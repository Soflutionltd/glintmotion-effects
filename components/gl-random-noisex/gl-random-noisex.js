(function () {
  var S = window.HyperShader;
  if (!S || typeof S.registerShader !== "function") {
    throw new Error("Load vendor/glintmotion/hyper-shader.js before this file: it adds shaders to that build of HyperShader.");
  }
  S.registerShader("gl-random-noisex", "// gl-random-noisex, from GL Transitions \"randomNoisex\" by towrabbit (MIT).\nfloat progress;\nfloat ratio;\nvec4 getFromColor(vec2 p){return texture2D(u_from,vec2(p.x,1.0-p.y));}\nvec4 getToColor(vec2 p){return texture2D(u_to,vec2(p.x,1.0-p.y));}\n// Author: towrabbit\n// License: MIT\n// Description: The incoming image appears pixel by pixel in random noise\n// Tags: dissolve, noise\n\nfloat random (vec2 st) {\n    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);\n}\nvec4 transition (vec2 uv) {\n  vec4 leftSide = getFromColor(uv);\n  vec4 rightSide = getToColor(uv);\n  float uvz = floor(random(uv)+progress);\n  return mix(leftSide,rightSide,uvz);\n}\n\nvoid main(){\n  progress=u_progress;\n  ratio=u_resolution.x/u_resolution.y;\n  gl_FragColor=transition(vec2(v_uv.x,1.0-v_uv.y));\n}\n");
})();
