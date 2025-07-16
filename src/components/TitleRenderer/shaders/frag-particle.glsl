precision mediump float;

uniform sampler2D u_particle_map;
varying vec4 v_texcoord;
varying float opacity;
varying vec3 v_color;

void main() {
  float alpha = texture2D(u_particle_map, v_texcoord.xy).r;

  gl_FragColor = vec4(v_color, opacity * 0.66 * alpha);

  // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
