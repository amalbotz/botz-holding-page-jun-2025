#define PI 3.141592653589793
#define HALF_PI 1.5707963267948966
precision mediump float;

varying vec4 v_texcoord;
uniform float u_time;
uniform float u_timescale;
uniform float u_noise_scale;
uniform float u_opacity;
uniform float u_touch_opacity;
uniform sampler2D u_map_wordmark;
uniform sampler2D u_map_background;
uniform vec2 u_background_resolution;
uniform vec2 u_resolution;
uniform vec2 u_mouse_position;
uniform vec3 u_color;

float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

float sineInOut(float t) {
  return -0.5 * (cos(PI * t) - 1.0);
}

float sineIn(float t) {
  return sin((t - 1.0) * HALF_PI) + 1.0;
}

float sineOut(float t) {
  return sin(t * HALF_PI);
}

float quarticInOut(float t) {
  return t < 0.5
    ? +8.0 * pow(t, 4.0)
    : -8.0 * pow(t - 1.0, 4.0) + 1.0;
}

float exponentialIn(float t) {
  return t == 0.0 ? t : pow(2.0, 10.0 * (t - 1.0));
}

float exponentialInOut(float t) {
  return t == 0.0 || t == 1.0
    ? t
    : t < 0.5
      ? +0.5 * pow(2.0, (20.0 * t) - 10.0)
      : -0.5 * pow(2.0, 10.0 - (t * 20.0)) + 1.0;
}

float quarticIn(float t) {
  return pow(t, 4.0);
}


void main() {
  float aspect_ratio = u_resolution.x / u_resolution.y;
  float background_aspect_ratio = u_background_resolution.x / u_background_resolution.y;

	float pixel_x = v_texcoord.x * u_resolution.x;
	float pixel_y = v_texcoord.y * u_resolution.y;

	float mouse_x = u_mouse_position.x * u_resolution.x;
	float mouse_y = u_mouse_position.y * u_resolution.y;

	float dist_to_mouse = distance(vec2(mouse_x, mouse_y), vec2(pixel_x, pixel_y));
	dist_to_mouse = smoothstep(max(u_resolution.x, u_resolution.y) * 0.1, max(u_resolution.x, u_resolution.y) * 0.4, dist_to_mouse);
	dist_to_mouse = 1.0 - dist_to_mouse;

  // gl_FragColor = vec4(dist_to_mouse,dist_to_mouse,dist_to_mouse,1.0);
  // return;

	vec2 noise_texcoord = vec2(v_texcoord.x, v_texcoord.y / aspect_ratio);
	float noise_value = noise(vec3(noise_texcoord * 6.0, u_time * 0.001));
	noise_value = sineIn(noise_value);

	dist_to_mouse = dist_to_mouse * (0.75 + noise_value * 0.5);
  dist_to_mouse *= u_touch_opacity;

  vec2 wordmark_texcoord = v_texcoord.xy;
  vec2 background_texcoord = v_texcoord.xy;

  vec2 scale;
  if (background_aspect_ratio > aspect_ratio) {
    // Background is wider than container, fit by height
    scale = vec2(background_aspect_ratio / aspect_ratio, 1.0);
  } else {
    // Background is taller than container, fit by width
    scale = vec2(1.0, aspect_ratio / background_aspect_ratio);
  }
  
  // Center the background
  background_texcoord = (background_texcoord - 0.5) / scale + 0.5;

  vec4 texel_wordmark = texture2D(u_map_wordmark, wordmark_texcoord);
  vec4 texel_background = texture2D(u_map_background, background_texcoord);
  
	float threshold = clamp(texel_wordmark.r + (dist_to_mouse * 0.4), 0.0, 1.0) + (1.0 - u_opacity);
	threshold = step(0.5, threshold);
  // threshold = smoothstep(0.5, 0.51, threshold);


  // threshold = texel_wordmark.r;

	gl_FragColor = vec4(texel_background.rgb, threshold);
}
