(function () {
  var S = window.HyperShader;
  if (!S || typeof S.registerShader !== "function") {
    throw new Error("Load vendor/glintmotion/hyper-shader.js before this file: it adds shaders to that build of HyperShader.");
  }
  S.registerShader("gl-windowblinds", "// gl-windowblinds, from GL Transitions \"windowblinds\" by Fabien Benetou (MIT).\nfloat progress;\nfloat ratio;\nvec4 getFromColor(vec2 p){return texture2D(u_from,vec2(p.x,1.0-p.y));}\nvec4 getToColor(vec2 p){return texture2D(u_to,vec2(p.x,1.0-p.y));}\n// Author: Fabien Benetou\n// License: MIT\n// Description: A crossfade through horizontal window blinds\n// Tags: blinds, stripes, blend\n\nvec4 transition (vec2 uv) {\n  float t = progress;\n  \n  if (mod(floor(uv.y*100.*progress),2.)==0.)\n    t*=2.-.5;\n  \n  return mix(\n    getFromColor(uv),\n    getToColor(uv),\n    mix(t, progress, smoothstep(0.8, 1.0, progress))\n  );\n}\n\nvoid main(){\n  progress=u_progress;\n  ratio=u_resolution.x/u_resolution.y;\n  gl_FragColor=transition(vec2(v_uv.x,1.0-v_uv.y));\n}\n");
})();
