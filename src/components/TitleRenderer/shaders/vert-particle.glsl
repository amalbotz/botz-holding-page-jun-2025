precision mediump float;

attribute vec4 position;
attribute vec4 texcoord;
attribute float instanceScale;
attribute vec2 instancePosition;
attribute vec2 instanceDirection;
attribute float instanceSpeed;

uniform vec2 u_resolution;
uniform float u_time;
varying vec4 v_texcoord;

void main() {
  v_texcoord = texcoord;

  float width_px = 16.0;
  float aspect_ratio = u_resolution.x / u_resolution.y;
  float base_scale = width_px / u_resolution.x;

  vec2 center = instancePosition;

  // normalize direction
  vec2 velocity = normalize(instanceDirection) * instanceSpeed;
   
   // animate
  center += velocity * u_time * 0.0001;
  // modulate
  center = mod(center, 2.2) - 1.1;

  // make square
  vec3 transformed_position = position.xyz * vec3(1.0, aspect_ratio, 1.0);
  // scale
  transformed_position *= instanceScale * base_scale;
  // translate
  transformed_position.xy += center;
 
  gl_Position = vec4(transformed_position, position.w);
}
