const Base = require("./BaseModel.js");

module.exports = class AnimCamera extends Base {
  constructor(THREE, scene, cb) {
    super(THREE, scene, cb);
  }

  _init() {
    // Sizes

    this.sizes = {};
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;

    // Camera

    this.threeCam = new this._Cnstr.PerspectiveCamera(
      75,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );
    this.threeCam.position.set(0, 1, 4);

    this._Scene.add(this.threeCam);

    this.topPos = 5;
    this.botPos = 0;
    this.speed = 0.1;
    this._direction = 1;
    this.smoothAnim = 0.2;

    this.degreeCursor = 0;
    this.radius = (this.topPos - this.botPos) / 2;
    this.speed = 3;

    this.curve = new this._Cnstr.SplineCurve3([
      new this._Cnstr.Vector3(0, 1, 3),
      new this._Cnstr.Vector3(3, 3, -4),
      new this._Cnstr.Vector3(4, 8, 2),
      new this._Cnstr.Vector3(-4, 3, 2),
      new this._Cnstr.Vector3(-1, 2, -1),
      new this._Cnstr.Vector3(0, 1, 3)
    ]);

    this.curveIndex = 0;
    this.lengthAnim = 1000;

    super._init();
  }

  _bind() {
    super._bind();
  }

  _render() {
    // this.linearAnim()
    // this.easeOutAnim()
    // this.easeInOutAnim();
    // this.lookAtObject && this.followLineAnim();
    super._render();
  }

  getLookAtPosition(mesh) {
    this.lookAtObject = mesh;
  }

  linearAnim() {
    const nextPos = this.threeCam.position.y + this.speed * this._direction;
    if (nextPos > this.topPos) {
      this._direction = -1;
      this.linearAnim();
    } else if (nextPos < this.botPos) {
      this._direction = 1;
      this.linearAnim();
    } else {
      this.threeCam.position.y += this.speed * this._direction;
    }
  }

  easeOutAnim() {
    let nextPos = this.threeCam.position.y;
    if (this._direction > 0) {
      nextPos +=
        (this.topPos - this.threeCam.position.y) *
          this.speed *
          this.smoothAnim +
        0.01;
    } else {
      nextPos -=
        (this.threeCam.position.y - this.botPos) *
          this.speed *
          this.smoothAnim +
        0.01;
    }

    if (nextPos > this.topPos) {
      this._direction = -1;
      this.easeOutAnim();
    } else if (nextPos < this.botPos) {
      this._direction = 1;
      this.easeOutAnim();
    } else {
      this.threeCam.position.y = nextPos;
    }
  }

  easeInOutAnim() {
    this.threeCam.position.y =
      Math.cos(this._Cnstr.Math.degToRad(this.degreeCursor)) * this.radius +
      (this.radius + this.botPos);

    this.degreeCursor += this.speed;
    if (this.degreeCursor >= 360) {
      this.degreeCursor = 0;
    }
  }

  followLineAnim() {
    this.curveIndex++;
    if (this.curveIndex > 1000) {
      this.curveIndex = 0;
    }

    const camPos = this.curve.getPoint(this.curveIndex / 1000);
    const camRot = this.curve.getTangent(this.curveIndex / 1000);

    this.threeCam.position.set(camPos.x, camPos.y, camPos.z);
    this.threeCam.rotation.set(camRot.x, camRot.y, camRot.z);

    // this.threeCam.lookAt(new this._Cnstr.Vector3(0, 0, 0));
    // this.threeCam.lookAt(this.curve.getPoint((this.curveIndex + 1) / 1000));
    this.threeCam.lookAt(this.lookAtObject.position);
  }
};
