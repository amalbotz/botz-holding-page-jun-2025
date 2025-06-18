
#define PI 3.141592653589793
#define HALF_PI 1.5707963267948966
precision mediump float;

varying vec4 v_texcoord;
uniform float u_time;
uniform float u_timescale;
uniform float u_noise_scale;
uniform float u_opacity;
uniform sampler2D u_map_wordmark;
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



// // Cellular noise ("Worley noise") in 2D in GLSL.
// // Copyright (c) Stefan Gustavson 2011-04-19. All rights reserved.
// // This code is released under the conditions of the MIT license.
// // See LICENSE file for details.
// // https://github.com/stegu/webgl-noise

// // Modulo 289 without a division (only multiplications)
// vec3 mod289(vec3 x) {
//   return x - floor(x * (1.0 / 289.0)) * 289.0;
// }

// vec2 mod289(vec2 x) {
//   return x - floor(x * (1.0 / 289.0)) * 289.0;
// }

// // Modulo 7 without a division
// vec3 mod7(vec3 x) {
//   return x - floor(x * (1.0 / 7.0)) * 7.0;
// }

// // Permutation polynomial: (34x^2 + 6x) mod 289
// vec3 permute(vec3 x) {
//   return mod289((34.0 * x + 10.0) * x);
// }

// // Cellular noise, returning F1 and F2 in a vec2.
// // Standard 3x3 search window for good F1 and F2 values
// vec2 cellular(vec2 P) {
// #define K 0.142857142857 // 1/7
// #define Ko 0.428571428571 // 3/7
// #define jitter 1.0 // Less gives more regular pattern
// 	vec2 Pi = mod289(floor(P));
//  	vec2 Pf = fract(P);
// 	vec3 oi = vec3(-1.0, 0.0, 1.0);
// 	vec3 of = vec3(-0.5, 0.5, 1.5);
// 	vec3 px = permute(Pi.x + oi);
// 	vec3 p = permute(px.x + Pi.y + oi); // p11, p12, p13
// 	vec3 ox = fract(p*K) - Ko;
// 	vec3 oy = mod7(floor(p*K))*K - Ko;
// 	vec3 dx = Pf.x + 0.5 + jitter*ox;
// 	vec3 dy = Pf.y - of + jitter*oy;
// 	vec3 d1 = dx * dx + dy * dy; // d11, d12 and d13, squared
// 	p = permute(px.y + Pi.y + oi); // p21, p22, p23
// 	ox = fract(p*K) - Ko;
// 	oy = mod7(floor(p*K))*K - Ko;
// 	dx = Pf.x - 0.5 + jitter*ox;
// 	dy = Pf.y - of + jitter*oy;
// 	vec3 d2 = dx * dx + dy * dy; // d21, d22 and d23, squared
// 	p = permute(px.z + Pi.y + oi); // p31, p32, p33
// 	ox = fract(p*K) - Ko;
// 	oy = mod7(floor(p*K))*K - Ko;
// 	dx = Pf.x - 1.5 + jitter*ox;
// 	dy = Pf.y - of + jitter*oy;
// 	vec3 d3 = dx * dx + dy * dy; // d31, d32 and d33, squared
// 	// Sort out the two smallest distances (F1, F2)
// 	vec3 d1a = min(d1, d2);
// 	d2 = max(d1, d2); // Swap to keep candidates for F2
// 	d2 = min(d2, d3); // neither F1 nor F2 are now in d3
// 	d1 = min(d1a, d2); // F1 is now in d1
// 	d2 = max(d1a, d2); // Swap to keep candidates for F2
// 	d1.xy = (d1.x < d1.y) ? d1.xy : d1.yx; // Swap if smaller
// 	d1.xz = (d1.x < d1.z) ? d1.xz : d1.zx; // F1 is in d1.x
// 	d1.yz = min(d1.yz, d2.yz); // F2 is now not in d2.yz
// 	d1.y = min(d1.y, d1.z); // nor in  d1.z
// 	d1.y = min(d1.y, d2.x); // F2 is in d1.y, we're done.
// 	return sqrt(d1.xy);
// }

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

	float pixel_x = v_texcoord.x * u_resolution.x;
	float pixel_y = v_texcoord.y * u_resolution.y;

	float mouse_x = u_mouse_position.x * u_resolution.x;
	float mouse_y = u_mouse_position.y * u_resolution.y;

	float dist_to_mouse = distance(vec2(mouse_x, mouse_y), vec2(pixel_x, pixel_y));
	dist_to_mouse = smoothstep(0.0, max(u_resolution.x, u_resolution.y) * 0.2, dist_to_mouse);
	dist_to_mouse = 1.0 - dist_to_mouse;

	vec2 noise_texcoord = vec2(v_texcoord.x, v_texcoord.y / aspect_ratio);
	float noise_value = 1.0 - noise(vec3(noise_texcoord * 8.0, u_time * 0.001));
	noise_value = sineOut(noise_value);

	dist_to_mouse = dist_to_mouse * (0.5 + noise_value * 0.5);

	gl_FragColor = vec4(noise_value,noise_value,noise_value, 1.0);
	// return;

  vec4 texel_wordmark = texture2D(u_map_wordmark, v_texcoord.xy);

	float threshold = clamp(texel_wordmark.r + (dist_to_mouse * 0.4), 0.0, 1.0) + (1.0 - u_opacity);
	threshold = step(0.5, threshold);

	gl_FragColor = vec4(u_color, threshold);

  // float aspect_ratio = u_resolution.x / u_resolution.y;

  
  
	// float noise_val_two = 1.0 - cellular(noise_texcoord * vec2(5.0 * u_noise_scale * 2.5) + vec2(u_time * u_timescale * 0.00005, u_time * 0.0001)).x;

	// float noise_val = (sineIn(noise_val_one) * 0.6) + (quarticIn(noise_val_two) * 0.4) + (dist_to_mouse * 0.4);


  // // noise_val = exponentialIn(noise_val);
	// noise_val = noise_val - 0.5;
  // noise_val *= u_opacity * 0.66;

  // float threshold = clamp(texel_wordmark.r + (noise_val * 0.8), 0.0, 1.0) + ((1.0 - u_opacity) * -0.75);
  // threshold = step(0.45, threshold);

  // gl_FragColor = vec4(u_color,threshold);
}
