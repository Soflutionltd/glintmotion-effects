(function () {
  var S = window.HyperShader;
  if (!S || typeof S.registerShader !== "function") {
    throw new Error("Load vendor/glintmotion/hyper-shader.js before this file: it adds shaders to that build of HyperShader.");
  }
  S.registerShader("gl-zoom-in-out", "// gl-zoom-in-out, from GL Transitions \"zoomInOut\" by OllyOllyOlly (MIT).\nfloat progress;\nfloat ratio;\nvec4 getFromColor(vec2 p){return texture2D(u_from,vec2(p.x,1.0-p.y));}\nvec4 getToColor(vec2 p){return texture2D(u_to,vec2(p.x,1.0-p.y));}\n// Author: OllyOllyOlly\n// License: MIT\n// Description: Zooms into the outgoing image until it blurs into a flat color, then out to the incoming one\n// Tags: zoom, blur\n\nvec2 zoom(vec2 uv, float amount) {\n  return 0.5 + ((uv - 0.5) * (1.0 - amount));\n}\n\nvec4 transition (vec2 uv) {\n  float zoomFrom = smoothstep(0.0, 1.0, progress * 2.0);\n  float zoomTo = smoothstep(0.0, 1.0, (1.0 - progress) * 2.0);\n  float crossfade = smoothstep(0.4, 0.6, progress);\n  return mix(\n    getFromColor(zoom(uv, zoomFrom)),\n    getToColor(zoom(uv, zoomTo)),\n    crossfade\n  );\n}\n\nvoid main(){\n  progress=u_progress;\n  ratio=u_resolution.x/u_resolution.y;\n  gl_FragColor=transition(vec2(v_uv.x,1.0-v_uv.y));\n}\n");
})();
