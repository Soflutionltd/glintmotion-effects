// gl-circle-crop, from GL Transitions "CircleCrop" by fkuteken (MIT).
float progress;
float ratio;
vec4 getFromColor(vec2 p){return texture2D(u_from,vec2(p.x,1.0-p.y));}
vec4 getToColor(vec2 p){return texture2D(u_to,vec2(p.x,1.0-p.y));}
// License: MIT
// Author: fkuteken
// Description: The outgoing image closes into a circle over a background color, then the incoming one opens from it
// Tags: circle, iris, shape
// ported by gre from https://gist.github.com/fkuteken/f63e3009c1143950dee9063c3b83fb88

// @color Background color
const vec4 bgcolor = vec4(0.0, 0.0, 0.0, 1.0);

vec4 transition(vec2 p) {
  vec2 ratio2 = vec2(1.0, 1.0 / ratio);
  float s = pow(2.0 * abs(progress - 0.5), 3.0);
  float dist = length((vec2(p) - 0.5) * ratio2);
  return mix(
    progress < 0.5 ? getFromColor(p) : getToColor(p), // branching is ok here as we statically depend on progress uniform (branching won't change over pixels)
    bgcolor,
    step(s, dist)
  );
}

void main(){
  progress=u_progress;
  ratio=u_resolution.x/u_resolution.y;
  gl_FragColor=transition(vec2(v_uv.x,1.0-v_uv.y));
}
