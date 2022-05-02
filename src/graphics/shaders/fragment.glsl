varying vec3 pos;
uniform float uTime;

void main() {
  float withOffset = 0.8 + pos.x;
  gl_FragColor = vec4(withOffset, withOffset, withOffset, 1.);
}