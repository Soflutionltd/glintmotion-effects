(function () {
  var S = window.HyperShader;
  if (!S || typeof S.registerShader !== "function") {
    throw new Error("Load vendor/glintmotion/hyper-shader.js before this file: it adds shaders to that build of HyperShader.");
  }
  S.registerShader("gl-simple-zoom-out", "// gl-simple-zoom-out, from GL Transitions \"SimpleZoomOut\" by Tianshuo (MIT).\nfloat progress;\nfloat ratio;\nvec4 getFromColor(vec2 p){return texture2D(u_from,vec2(p.x,1.0-p.y));}\nvec4 getToColor(vec2 p){return texture2D(u_to,vec2(p.x,1.0-p.y));}\n// Author: Tianshuo\n// License: MIT\n// Description: The incoming image zooms out into place while fading in\n// Tags: zoom, fade\n\n\n// @range(0.2, 1) Part of the transition spent zooming\nconst float zoom_quickness = 0.8;\n// @param Fade instead of cutting to the incoming image\nconst bool fade = true;\nvec2 zoom(vec2 uv, float amount) {\n  return 0.5 + ((uv - 0.5) * (1.0-amount));\t\n}\n\nvec4 transition (vec2 uv) {\n  float nQuick = clamp(zoom_quickness,0.2,1.0);\n  return mix(\n    getFromColor(uv),\n    getToColor(zoom(uv,1.-smoothstep(1.-nQuick, 1., progress))),\n   fade?smoothstep(1.0-nQuick, 1., progress):(progress<1.0-nQuick?0.0:1.0)\n  );\n}\n\nvoid main(){\n  progress=u_progress;\n  ratio=u_resolution.x/u_resolution.y;\n  gl_FragColor=transition(vec2(v_uv.x,1.0-v_uv.y));\n}\n");
})();
