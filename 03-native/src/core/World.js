import loadPlain from "../helpers/loadPlain";

import Program from "./Program";

class World {
  constructor(namespace = "01") {
    this._namespace = namespace;

    this.init();
  }

  async init() {
    this._initTime = Date.now();

    this.initCanvas();
    this.initGl();
    await this.initProgram();
    this.initUniforms();
    this.initAttributes();

    this.loop();
  }

  initCanvas() {
    this._$canvas = document.querySelector("canvas.canvas");
    this._$canvas.width = 600;
    this._$canvas.height = 400;
  }

  initGl() {
    this._gl = this._$canvas.getContext("webgl");
    this._gl.viewport(0, 0, this._$canvas.width, this._$canvas.height);
  }

  async initProgram() {
    const vertex = await loadPlain(
      `/assets/shaders/${this._namespace}/vertex.glsl`
    );
    const fragment = await loadPlain(
      `/assets/shaders/${this._namespace}/fragment.glsl`
    );

    const program = new Program(this._gl, vertex, fragment);

    console.log("program:", program.getStatus());

    this._gl.useProgram(program.get());
    this._program = program;
  }

  initAttributes() {
    const positionBuffer = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, positionBuffer);

    const positionAttributeLocation = this._gl.getAttribLocation(
      this._program.get(),
      "aPosition"
    );
    this._gl.enableVertexAttribArray(positionAttributeLocation);
    this._gl.vertexAttribPointer(
      positionAttributeLocation,
      2,
      this._gl.FLOAT,
      false,
      0,
      0
    );

    // eslint-disable-next-line
    const positions = [
      -1, -1,
      -1, 1,
      1, -1,
      1, 1,
      -1, 1,
      1, -1
    ];

    this._gl.bufferData(
      this._gl.ARRAY_BUFFER,
      Float32Array.from(positions),
      this._gl.STATIC_DRAW
    );
  }

  initUniforms() {
    // Color
    const colorUniformLocation = this._gl.getUniformLocation(
      this._program.get(),
      "uColor"
    );
    this._gl.uniform3f(colorUniformLocation, 1, 0, 0);

    // Time
    const timeUniformLocation = this._gl.getUniformLocation(
      this._program.get(),
      "uTime"
    );
    this._gl.uniform1f(timeUniformLocation, 0.5);

    this._colorUniformLocation = colorUniformLocation;
    this._timeUniformLocation = timeUniformLocation;

    // Img
    const textureImage = new Image();
    textureImage.addEventListener("load", () => {
      const texture = this._gl.createTexture();
      this._gl.activeTexture(this._gl.TEXTURE0);
      this._gl.bindTexture(this._gl.TEXTURE_2D, texture);
      this._gl.texImage2D(
        this._gl.TEXTURE_2D,
        0,
        this._gl.RGBA,
        this._gl.RGBA,
        this._gl.UNSIGNED_BYTE,
        textureImage
      );
      this._gl.texParameteri(
        this._gl.TEXTURE_2D,
        this._gl.TEXTURE_WRAP_S,
        this._gl.CLAMP_TO_EDGE
      );
      this._gl.texParameteri(
        this._gl.TEXTURE_2D,
        this._gl.TEXTURE_WRAP_T,
        this._gl.CLAMP_TO_EDGE
      );
      this._gl.texParameteri(
        this._gl.TEXTURE_2D,
        this._gl.TEXTURE_MIN_FILTER,
        this._gl.NEAREST
      );
      this._gl.texParameteri(
        this._gl.TEXTURE_2D,
        this._gl.TEXTURE_MAG_FILTER,
        this._gl.NEAREST
      );
    });
    textureImage.src = "/assets/img/sudo.jpg";
  }

  loop() {
    const elapsed = Date.now() - this._initTime;

    this._gl.uniform1f(this._timeUniformLocation, elapsed);

    this.draw();

    window.requestAnimationFrame(this.loop.bind(this));
  }

  draw() {
    this._gl.drawArrays(this._gl.TRIANGLES, 0, 6);
  }
}

export default World;
