precision mediump float;

uniform vec3 uColor;
uniform float uTime;
uniform sampler2D uTexture;

varying vec2 vUv;

void main() {
  // vec2 grid = abs(cos(vUv * 200.0 * abs(cos(uTime * 0.001))));

  // gl_FragColor = vec4(
  //   grid,
  //   1.0,
  //   1.0
  // );

  float brightness = sin(uTime * 0.001) * 0.2 + 0.8;
  vec2 flipUv = vec2(vUv.x, 1.0 - vUv.y);
  flipUv.y += sin(flipUv.x * 10.0 + uTime * 0.001) * 0.1;
  vec4 color = texture2D(uTexture, flipUv);

  float vignetteStrength = 1.0 - distance(vUv, vec2(0.5));
  color.rgb *= vignetteStrength * 2.0 - 0.5;

  color.rgb = mix(color.rgb, uColor, 0.3);

  gl_FragColor = color;

}
