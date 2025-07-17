precision mediump float;

attribute vec4 position;
attribute vec4 texcoord;
attribute vec3 instanceOrigin;
attribute float instanceSeed;
attribute float instanceSpeed;
attribute float instanceAngularVelocity;
attribute float instanceSpriteIndex;
attribute vec3 instanceColor;

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_noise_map;
varying vec4 v_texcoord;
varying float opacity;
varying vec3 v_color;
uniform float u_sprite_count;

float TIMESCALE = 0.00002;
float TIMESCALE_ROTATE = 0.0001;
float WIDTH_PX = 5.0;
vec2 DIRECTION = vec2(0.0, 1.0);

vec2 OFFSET_FREQ = vec2(0.01,0.1);
vec2 OFFSET_SCALE = vec2(0.2,0.1);

void main() {
  float sprite_subdivisions = sqrt(u_sprite_count);
  float sprite_row = floor(instanceSpriteIndex / sprite_subdivisions);
  float sprite_column = mod(instanceSpriteIndex, sprite_subdivisions);
  v_texcoord = texcoord / sprite_subdivisions + vec4(sprite_column / sprite_subdivisions, sprite_row / sprite_subdivisions, 0.0,0.0);

  float aspect_ratio = u_resolution.x / u_resolution.y;
  float base_scale = WIDTH_PX / u_resolution.x;

  float perspective_scale = 1.0 - instanceOrigin.z;
  float scale = perspective_scale * base_scale;

  vec2 center = instanceOrigin.xy;

   // animate
  center += DIRECTION * instanceSpeed * perspective_scale * u_time * TIMESCALE;
  
  vec2 offset = texture2D(u_noise_map, center * OFFSET_FREQ).rg * 2.0 - 1.0;

  // vec2 offset = vec2(offset_x, offset_y) * OFFSET_SCALE;
  center += offset * OFFSET_SCALE;
  
  // modulate

  // center.y = mod(center.y, 2.2) - 1.0;
  center.y = mod(center.y + 1.1, 2.2) - 1.1;
  // center *= vec2(aspect_ratio, 1.0);


  vec2 transformed_position = position.xy;
  // rotate
  transformed_position.xy = mat2(cos(u_time * TIMESCALE_ROTATE * instanceAngularVelocity), -sin(u_time * TIMESCALE_ROTATE * instanceAngularVelocity), sin(u_time * TIMESCALE_ROTATE * instanceAngularVelocity), cos(u_time * TIMESCALE_ROTATE * instanceAngularVelocity)) * transformed_position.xy;
  // scale
  transformed_position *= scale;
  // make square
  transformed_position.xy *= vec2(1.0, aspect_ratio);
  
  // translate
  transformed_position.xy += center;
 
  opacity = 0.5 + perspective_scale * 0.5;

  v_color = instanceColor;

  // transformed_position = position.xy;
  // transformed_position *= 0.3;
  // transformed_position.xy += center;

  gl_Position = vec4(transformed_position, 1.0, position.w);
}
