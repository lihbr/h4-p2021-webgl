class Shader {
  constructor(gl, type, source) {
    this._gl = gl;
    this._type = type;
    this._source = source;

    this.init();
  }

  init() {
    const shader = this._gl.createShader(this._type);
    this._gl.shaderSource(shader, this._source);
    this._gl.compileShader(shader);

    this.shader = shader;
  }

  get() {
    return this.shader;
  }

  getStatus() {
    return this._gl.getShaderParameter(this.shader, this._gl.COMPILE_STATUS);
  }
}

export default Shader;
