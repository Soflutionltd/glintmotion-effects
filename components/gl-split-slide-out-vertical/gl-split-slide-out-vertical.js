(function () {
  var S = window.HyperShader;
  if (!S || typeof S.registerShader !== "function") {
    throw new Error("Load vendor/glintmotion/hyper-shader.js before this file: it adds shaders to that build of HyperShader.");
  }
  S.registerShader("gl-split-slide-out-vertical", "// gl-split-slide-out-vertical, from GL Transitions \"splitSlideOutVertical\" by OllyOllyOlly (MIT).\nfloat progress;\nfloat ratio;\nvec4 getFromColor(vec2 p){return texture2D(u_from,vec2(p.x,1.0-p.y));}\nvec4 getToColor(vec2 p){return texture2D(u_to,vec2(p.x,1.0-p.y));}\n// Author: OllyOllyOlly\n// License: MIT\n// Description: The outgoing image slides out as two halves moving vertically in opposite directions\n// Tags: slide, split, vertical\n\n// @param Swap the directions of the halves\nconst bool reverse = false;\n\nconst vec2 boundMin = vec2(0.0, 0.0);\nconst vec2 boundMax = vec2(1.0, 1.0);\n\nbool inBounds (vec2 p) {\n  return all(lessThan(boundMin, p)) && all(lessThan(p, boundMax));\n}\n\nvec4 transition (vec2 uv) {\n  float modifier = (uv.x > 0.5 ? 1.0 : -1.0) * (reverse ? -1.0 : 1.0) ;\n  vec2 p = vec2(uv.x, uv.y + (progress * modifier));\n\n  return inBounds(p) ? getFromColor(p) : getToColor(uv);\n}\n\nvoid main(){\n  progress=u_progress;\n  ratio=u_resolution.x/u_resolution.y;\n  gl_FragColor=transition(vec2(v_uv.x,1.0-v_uv.y));\n}\n");
})();
