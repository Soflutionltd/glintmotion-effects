// gl-split-slide-in-out-vertical, from GL Transitions "splitSlideInOutVertical" by OllyOllyOlly (MIT).
float progress;
float ratio;
vec4 getFromColor(vec2 p){return texture2D(u_from,vec2(p.x,1.0-p.y));}
vec4 getToColor(vec2 p){return texture2D(u_to,vec2(p.x,1.0-p.y));}
// Author: OllyOllyOlly
// License: MIT
// Description: The halves of both images slide vertically in opposite directions, out and in at once
// Tags: slide, split, vertical

// @param Swap the directions of the halves
const bool reverse = false;

const vec2 boundMin = vec2(0.0, 0.0);
const vec2 boundMax = vec2(1.0, 1.0);

bool inBounds (vec2 p) {
  return all(lessThan(boundMin, p)) && all(lessThan(p, boundMax));
}

vec4 transition (vec2 uv) {
  float modifier = (uv.x > 0.5 ? 1.0 : -1.0) * (reverse ? -1.0 : 1.0) ;
  vec2 fromP = vec2(uv.x, uv.y + (progress * modifier));
  vec2 toP = vec2(uv.x, (uv.y + (progress * modifier)) - modifier);

  return inBounds(fromP) ? getFromColor(fromP) : getToColor(toP);
}

void main(){
  progress=u_progress;
  ratio=u_resolution.x/u_resolution.y;
  gl_FragColor=transition(vec2(v_uv.x,1.0-v_uv.y));
}
