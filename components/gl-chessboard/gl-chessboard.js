(function () {
  var S = window.HyperShader;
  if (!S || typeof S.registerShader !== "function") {
    throw new Error("Load vendor/glintmotion/hyper-shader.js before this file: it adds shaders to that build of HyperShader.");
  }
  S.registerShader("gl-chessboard", "// gl-chessboard, from GL Transitions \"chessboard\" by lql (MIT).\nfloat progress;\nfloat ratio;\nvec4 getFromColor(vec2 p){return texture2D(u_from,vec2(p.x,1.0-p.y));}\nvec4 getToColor(vec2 p){return texture2D(u_to,vec2(p.x,1.0-p.y));}\n// Author: lql\n// License: MIT\n// Description: A chessboard pattern of squares reveals the incoming image\n// Tags: grid, squares, pattern\n\n// @param Number of squares per row\nconst float grid_num = 10.0;\n\nvec4 transition(vec2 uv) {\n    vec2 st = uv * grid_num;\n    vec2 idx = floor(st);\n    vec2 grid = fract(st);\n\n    vec4 a = getFromColor(uv);\n    vec4 b = getToColor(uv);\n\n    float checker = mod(idx.x + idx.y, 2.0);\n    float mixFactor;\n\n    if (progress <= 0.5) {\n        mixFactor = (checker > 0.5) ? step(grid.x, progress * 2.0) : 0.0;\n    } else {\n        mixFactor = (checker < 0.5) ? step(grid.x, (progress - 0.5) * 2.0) : 1.0;\n    }\n\n    return mix(a, b, mixFactor);\n}\n\nvoid main(){\n  progress=u_progress;\n  ratio=u_resolution.x/u_resolution.y;\n  gl_FragColor=transition(vec2(v_uv.x,1.0-v_uv.y));\n}\n");
})();
