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

    this.ceiling = new this._Cnstr.Mesh(
      new this._Cnstr.BoxBufferGeometry(30, 0.1, 30),
      this.mainMat
    );
    this.ceiling.position.y = 5;
    this._Scene.add(this.ceiling);

    this.nWall = this._createWall();
    this.nWall.position.z = 15;
    this._Scene.add(this.nWall);

    this.sWall = this._createWall();
    this.sWall.position.z = -15;
    this._Scene.add(this.sWall);

    this.eWall = this._createWall();
    this.eWall.position.x = -15;
    this.eWall.rotation.y = this._Cnstr.Math.degToRad(90);
    this._Scene.add(this.eWall);

    this.xWall = this._createWall();
    this.xWall.position.x = 15;
    this.xWall.rotation.y = this._Cnstr.Math.degToRad(90);
    this._Scene.add(this.xWall);

    this.centerCube = new this._Cnstr.Mesh(
      new this._Cnstr.BoxBufferGeometry(1, 1, 1),
      this.mainMat
    );
    this.centerCube.position.y = -0.5;
    this.centerCube.castShadow = true;
    this.centerCube.interactiveID = 1;
    this.interactiveElts.push(this.centerCube);
    this._Scene.add(this.centerCube);

    super._init();
  }

  _bind() {
    super._bind();
  }

  _render() {
    // Update
    this.centerCube.rotation.y += 0.01;

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
};
