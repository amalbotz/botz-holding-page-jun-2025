precision mediump float;

attribute vec4 position;
attribute vec4 texcoord;

varying vec4 v_texcoord;

void main() {
  v_texcoord = texcoord;
  gl_Position = position;
}
