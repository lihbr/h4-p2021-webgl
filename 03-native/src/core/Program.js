import Shader from "./Shader";

class Program {
  constructor(gl, vertex, fragment) {
    this._gl = gl;
    this._vertex = vertex;
    this._fragment = fragment;

    this.init();
  }

  init() {
    const vertexShader = new Shader(
      this._gl,
      this._gl.VERTEX_SHADER,
      this._vertex
    );

    if (!vertexShader.getStatus()) {
      console.error("Vertex shader is not valid:\n\n", this._vertex);
      throw "Vertex shader is not valid";
    }

    const fragmentShader = new Shader(
      this._gl,
      this._gl.FRAGMENT_SHADER,
      this._fragment
    );

    if (!fragmentShader.getStatus()) {
      console.error("Fragment shader is not valid:\n\n", this._fragment);
      throw "Fragment shader is not valid";
    }

    const program = this._gl.createProgram();
    this._gl.attachShader(program, vertexShader.get());
    this._gl.attachShader(program, fragmentShader.get());
    this._gl.linkProgram(program);

    this.program = program;
  }

  get() {
    return this.program;
  }

  getStatus() {
    return this._gl.getProgramParameter(this.program, this._gl.LINK_STATUS);
  }
}

export default Program;
