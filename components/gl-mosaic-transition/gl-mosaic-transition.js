(function () {
  var S = window.HyperShader;
  if (!S || typeof S.registerShader !== "function") {
    throw new Error("Load vendor/glintmotion/hyper-shader.js before this file: it adds shaders to that build of HyperShader.");
  }
  S.registerShader("gl-mosaic-transition", "// gl-mosaic-transition, from GL Transitions \"mosaic_transition\" by YueDev (MIT).\nfloat progress;\nfloat ratio;\nvec4 getFromColor(vec2 p){return texture2D(u_from,vec2(p.x,1.0-p.y));}\nvec4 getToColor(vec2 p){return texture2D(u_to,vec2(p.x,1.0-p.y));}\n// Author: YueDev\n// License: MIT\n// Description: Both images break into mosaic blocks that blend, then sharpen into the incoming image\n// Tags: mosaic, pixelate, blend\n\n// @param Number of mosaic blocks\nconst float mosaicNum = 10.0;\n\nvec2 getMosaicUV(vec2 uv) {\n  float mosaicWidth = 2.0 / mosaicNum * min(progress, 1.0 - progress);\n  float mX = floor(uv.x / mosaicWidth) + 0.5;\n  float mY = floor(uv.y / mosaicWidth) + 0.5;\n  return vec2(mX * mosaicWidth, mY * mosaicWidth);\n}\n\nvec4 transition (vec2 uv) {\n  vec2 mosaicUV = min(progress, 1.0 - progress) == 0.0 ? uv : getMosaicUV(uv);\n  return mix(getFromColor(mosaicUV), getToColor(mosaicUV), progress * progress);\n}\n\nvoid main(){\n  progress=u_progress;\n  ratio=u_resolution.x/u_resolution.y;\n  gl_FragColor=transition(vec2(v_uv.x,1.0-v_uv.y));\n}\n");
})();
