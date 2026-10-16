// gl-left-right, from GL Transitions "LeftRight" by zhmy (MIT).
float progress;
float ratio;
vec4 getFromColor(vec2 p){return texture2D(u_from,vec2(p.x,1.0-p.y));}
vec4 getToColor(vec2 p){return texture2D(u_to,vec2(p.x,1.0-p.y));}
// Author: zhmy
// License: MIT
// Description: The outgoing image shrinks away to the left while the incoming one slides in from the right
// Tags: slide, zoom, horizontal

const vec4 black = vec4(0.0, 0.0, 0.0, 1.0);
const vec2 boundMin = vec2(0.0, 0.0);
const vec2 boundMax = vec2(1.0, 1.0);

bool inBounds (vec2 p) {
    return all(lessThan(boundMin, p)) && all(lessThan(p, boundMax));
}

vec4 transition (vec2 uv) {
    vec2 spfr,spto = vec2(-1.);

    float size = mix(1.0, 3.0, progress*0.2);
    spto = (uv + vec2(-0.5,-0.5))*vec2(size,size)+vec2(0.5,0.5);
    spfr = (uv - vec2(1.-progress, 0.0));
    if(inBounds(spfr)){
        return getToColor(spfr);
    }else if(inBounds(spto)){
        return getFromColor(spto) * (1.0 - progress);
    } else{
        return black;
    }
}
void main(){
  progress=u_progress;
  ratio=u_resolution.x/u_resolution.y;
  gl_FragColor=transition(vec2(v_uv.x,1.0-v_uv.y));
}
