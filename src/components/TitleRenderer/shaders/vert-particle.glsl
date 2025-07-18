precision mediump float;

attribute vec4 position;
attribute vec4 texcoord;
attribute vec3 instancePosition;
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

void main() {
  float sprite_subdivisions = sqrt(u_sprite_count);
  float sprite_row = floor(instanceSpriteIndex / sprite_subdivisions);
  float sprite_column = mod(instanceSpriteIndex, sprite_subdivisions);
  
  v_texcoord = texcoord / sprite_subdivisions + vec4(sprite_column / sprite_subdivisions, sprite_row / sprite_subdivisions, 0.0,0.0);

  float width_px = 10.0;
  float aspect_ratio = u_resolution.x / u_resolution.y;
  float base_scale = width_px / u_resolution.x;

  float perspective_scale = instancePosition.z;
  float scale = perspective_scale * base_scale;
  // scale = 1.0;

  vec2 center = instancePosition.xy;

  float noise_scale_xy = 0.01;
  float noise_scale_z = 0.5;
  float timescale = 0.00002;
  float timescale_rotate = 0.0001;
  // normalize direction§
  float direction_x = texture2D(u_noise_map, instancePosition.xz * vec2(noise_scale_xy, noise_scale_z)).r * 2.0 - 1.0;
  float direction_y = texture2D(u_noise_map, instancePosition.yz * vec2(noise_scale_xy * aspect_ratio, noise_scale_z)).r * 2.0 - 1.0;

  vec2 velocity = normalize(vec2(direction_x, direction_y)) * instanceSpeed * perspective_scale;
   
   // animate
  center += velocity * u_time * timescale;
  float offset_x = texture2D(u_noise_map, vec2(center.x * 5.0, instancePosition.z * 10.0 + u_time * timescale) * vec2(0.1)).r * 2.0 - 1.0;
  float offset_y = texture2D(u_noise_map, vec2(center.y * 5.0, instancePosition.z * 10.0 + u_time * timescale) * vec2(0.1)).g * 2.0 - 1.0;
  vec2 offset = vec2(offset_x, offset_y);

  center += offset * 0.1;
  // modulate
  center = mod(center, 2.0) - 1.0;
  // center *= vec2(aspect_ratio, 1.0);


  vec2 transformed_position = position.xy;
  // rotate
  transformed_position.xy = mat2(cos(u_time * timescale_rotate * instanceAngularVelocity), -sin(u_time * timescale_rotate * instanceAngularVelocity), sin(u_time * timescale_rotate * instanceAngularVelocity), cos(u_time * timescale_rotate * instanceAngularVelocity)) * transformed_position.xy;
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
