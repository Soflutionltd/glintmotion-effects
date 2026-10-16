// gl-star-wipe, from GL Transitions "StarWipe" by Ben Lucas (MIT).
float progress;
float ratio;
vec4 getFromColor(vec2 p){return texture2D(u_from,vec2(p.x,1.0-p.y));}
vec4 getToColor(vec2 p){return texture2D(u_to,vec2(p.x,1.0-p.y));}
// Author: Ben Lucas
// License: MIT
// Description: A growing star reveals the incoming image
// Tags: wipe, shape, star
#define PI 3.141592653589793
#define STAR_ANGLE 1.2566370614359172

// @param Thickness of the star's border
const float border_thickness = 0.01;
const float star_rotation = 0.75;
// @color Color of the star's border
const vec4 border_color = vec4(1.0);
// @param Center of the star
const vec2 star_center = vec2(0.5);

vec2 rotate(vec2 v, float theta) {
    float cosTheta = cos(theta);
    float sinTheta = sin(theta);

    return vec2(
        cosTheta * v.x - sinTheta * v.y,
        sinTheta * v.x + cosTheta * v.y
    );
}

bool inStar(vec2 uv, vec2 center, float radius){
  vec2 uv_centered = uv - center;
  uv_centered = rotate(uv_centered, star_rotation * STAR_ANGLE);
  float theta = atan(uv_centered.y, uv_centered.x) + PI;

  vec2 uv_rotated = rotate(uv_centered, -STAR_ANGLE * (floor(theta / STAR_ANGLE) + 0.5));

  float slope = 0.3;
  if(uv_rotated.y > 0.0){
      return (radius + uv_rotated.x * slope > uv_rotated.y);
  } else {
     return (-radius - uv_rotated.x * slope < uv_rotated.y);
  }
}

vec4 transition (vec2 uv) {
  float progressScaled = (2.0 * border_thickness + 1.0) * progress - border_thickness;
  if(inStar(uv, star_center, progressScaled)){
    return getToColor(uv);
  } else if(inStar(uv, star_center, progressScaled+border_thickness)){
    return border_color;
  } else {
    return getFromColor(uv);
  }
}

void main(){
  progress=u_progress;
  ratio=u_resolution.x/u_resolution.y;
  gl_FragColor=transition(vec2(v_uv.x,1.0-v_uv.y));
}
