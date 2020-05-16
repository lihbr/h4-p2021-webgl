const Base = require("./BaseModel.js");

module.exports = class Gamescene extends Base {
  constructor(THREE, scene) {
    super(THREE, scene);
  }

  _init() {
    this.interactiveElts = [];

    this.mainMat = new this._Cnstr.MeshPhongMaterial({
      color: 0xffffff, // white (can also use a CSS color string here)
      flatShading: true,
      shininess: 0
    });

    this.pointLight = new this._Cnstr.PointLight(0xffffff, 1, 80);
    this.pointLight.castShadow = true;
    this.pointLight.position.set(10, 10, 10);

    this.pointLight.shadow.mapSize.width = 1024;
    this.pointLight.shadow.mapSize.height = 1024;
    this.pointLight.shadow.camera.near = 0.5;
    this.pointLight.shadow.camera.far = 500;

    this._Scene.add(this.pointLight);

    this.floor = new this._Cnstr.Mesh(
      new this._Cnstr.BoxBufferGeometry(30, 0.1, 30),
      this.mainMat
    );
    this.floor.position.y = -1;
    this.floor.receiveShadow = true;
    this._Scene.add(this.floor);

    this.nWall = this._createWall();
    this.nWall.position.z = 15;
    this.nWall.receiveShadow = true;
    this._Scene.add(this.nWall);

    this.sWall = this._createWall();
    this.sWall.position.z = -15;
    this.sWall.receiveShadow = true;
    this._Scene.add(this.sWall);

    this.eWall = this._createWall();
    this.eWall.position.x = -15;
    this.eWall.receiveShadow = true;
    this.eWall.rotation.y = this._Cnstr.Math.degToRad(90);
    this._Scene.add(this.eWall);

    this.xWall = this._createWall();
    this.xWall.position.x = 15;
    this.xWall.receiveShadow = true;
    this.xWall.rotation.y = this._Cnstr.Math.degToRad(90);
    this._Scene.add(this.xWall);

    this.erraticMesh = new this._Cnstr.Mesh(
      new this._Cnstr.IcosahedronBufferGeometry(0.5),
      this.mainMat
    );
    this.erraticMesh.position.y = 0.5;
    this.erraticMesh.castShadow = true;
    this._Scene.add(this.erraticMesh);

    // this.beginPos = new this._Cnstr.Vector3(this.erraticMesh.position.x, this.erraticMesh.position.y, this.erraticMesh.position.z)
    // this.endPos = new this._Cnstr.Vector3(4, 1, -6)
    // this.step = 1
    // this.cursor = 0
    // this.lengthAnim = 100

    this.getNewSpline();
    this.duration = Math.round(Math.random() * 500);
    this.animIndex = 0;
    this.step = 0;

    super._init();
  }

  _bind() {
    super._bind();
  }

  _render() {
    // Update
    this.erraticMesh.rotation.x += 0.02;
    this.erraticMesh.rotation.y += 0.02;
    this.erraticMesh.rotation.z += 0.02;

    // this.interpolateMove()
    // this.interpolateCosMove()

    this.animateMoveErratic();

    super._render();
  }

  _createWall() {
    const newWall = new this._Cnstr.Mesh(
      new this._Cnstr.BoxBufferGeometry(30, 10, 0.1),
      this.mainMat
    );
    newWall.receiveShadow = true;
    return newWall;
  }

  interpolateMove() {
    this.cursor++;

    if (this.cursor > this.lengthAnim) {
      this.cursor = 0;
      this.step = this.step == 1 ? -1 : 1;
    }

    let from;
    let toward;

    if (this.step == 1) {
      from = this.beginPos;
      toward = this.endPos;
    } else {
      from = this.endPos;
      toward = this.beginPos;
    }

    const xMove = ((toward.x - from.x) / this.lengthAnim) * this.cursor;
    const yMove = ((toward.y - from.y) / this.lengthAnim) * this.cursor;
    const zMove = ((toward.z - from.z) / this.lengthAnim) * this.cursor;

    this.erraticMesh.position.set(
      from.x + xMove,
      from.y + yMove,
      from.z + zMove
    );
  }

  interpolateCosMove() {
    this.cursor += 360 / this.lengthAnim;

    if (this.cursor >= 360) {
      this.cursor = 0;
    }

    const cosIndex = (Math.cos(this._Cnstr.Math.degToRad(this.cursor)) + 1) / 2;

    const from = this.beginPos;
    const toward = this.endPos;

    const xMove = toward.x * cosIndex - from.x;
    const yMove = toward.y * cosIndex - from.y;
    const zMove = toward.z * cosIndex - from.z;

    this.erraticMesh.position.set(
      from.x + xMove,
      from.y + yMove,
      from.z + zMove
    );
  }

  animateMoveErratic() {
    this.animIndex++;
    if (this.animIndex > this.duration) {
      this.step = this.step == 0 ? 1 : 0;

      if (this.step == 1) {
        this.duration = Math.round(Math.random() * 30) + 10;
        this.getNewSpline();
      } else {
        this.duration = Math.round(Math.random() * 200);
      }

      this.animIndex = 0;
    }

    if (this.step == 1) {
      const meshPos = this.erraticCurve.getPoint(
        this.animIndex / this.duration
      );
      this.erraticMesh.position.set(meshPos.x, meshPos.y, meshPos.z);
    }
  }

  getNewSpline() {
    const meshPos = this.erraticMesh.position;

    let yNextPos = meshPos.y + Math.random() - 0.5;
    if (yNextPos < 0.5) yNextPos = 0.5;

    const newCurve = new this._Cnstr.SplineCurve3([
      new this._Cnstr.Vector3(meshPos.x, meshPos.y, meshPos.z),
      new this._Cnstr.Vector3(
        meshPos.x + Math.random() - 0.5,
        yNextPos,
        meshPos.z + Math.random() - 0.5
      )
    ]);

    this.erraticCurve = newCurve;
  }
};
