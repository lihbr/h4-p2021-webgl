attribute vec2 aPosition;

varying vec2 vUv;

void main()
{
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition.x, aPosition.y, 1.0, 1.0);
}
