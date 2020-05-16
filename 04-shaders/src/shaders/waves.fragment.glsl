uniform vec3 uColorLow;
uniform vec3 uColorHigh;

varying vec2 vUv;
varying float vElevation;

void main() {
  float ratio = vElevation * 0.5 + 0.7;
  vec3 color = mix(uColorLow, uColorHigh, ratio);

  gl_FragColor = vec4(color, 1.0);
}
