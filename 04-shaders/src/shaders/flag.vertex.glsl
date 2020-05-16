uniform float uTime;

varying vec2 vUv;
varying float vElevation;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  modelPosition.y += sin(modelPosition.x * 3.14 - uTime * 0.002) * 0.2 * uv.x;

  float elevation = sin(modelPosition.x - uTime * 0.002) * 0.5 * uv.x;
  modelPosition.z += elevation;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;
  gl_Position = projectionPosition;

  vUv = uv;
  vElevation = elevation;
}
