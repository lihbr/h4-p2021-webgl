uniform float uTime;
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vElevation;

void main() {
  vec4 color = texture2D(uTexture, vUv);
  color.rgb += vElevation * 0.8;
  gl_FragColor = color;
}
