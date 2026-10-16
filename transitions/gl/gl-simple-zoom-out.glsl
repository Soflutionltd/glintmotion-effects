// gl-simple-zoom-out, from GL Transitions "SimpleZoomOut" by Tianshuo (MIT).
float progress;
float ratio;
vec4 getFromColor(vec2 p){return texture2D(u_from,vec2(p.x,1.0-p.y));}
vec4 getToColor(vec2 p){return texture2D(u_to,vec2(p.x,1.0-p.y));}
// Author: Tianshuo
// License: MIT
// Description: The incoming image zooms out into place while fading in
// Tags: zoom, fade


// @range(0.2, 1) Part of the transition spent zooming
const float zoom_quickness = 0.8;
// @param Fade instead of cutting to the incoming image
const bool fade = true;
vec2 zoom(vec2 uv, float amount) {
  return 0.5 + ((uv - 0.5) * (1.0-amount));	
}

vec4 transition (vec2 uv) {
  float nQuick = clamp(zoom_quickness,0.2,1.0);
  return mix(
    getFromColor(uv),
    getToColor(zoom(uv,1.-smoothstep(1.-nQuick, 1., progress))),
   fade?smoothstep(1.0-nQuick, 1., progress):(progress<1.0-nQuick?0.0:1.0)
  );
}

void main(){
  progress=u_progress;
  ratio=u_resolution.x/u_resolution.y;
  gl_FragColor=transition(vec2(v_uv.x,1.0-v_uv.y));
}
