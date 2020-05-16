const Base = require("./BaseModel.js");
module.exports = class Weapon extends Base {
  constructor(THREE, scene, cb) {
    super(THREE, scene, cb);
  }

  _init() {
    this.rockets = [];
    this.rocketSpeed = 0.2;

    this.mainMat = new this._Cnstr.MeshPhongMaterial({
      color: 0xffffff, // white (can also use a CSS color string here)
      flatShading: true,
      shininess: 0
    });

    this.meshWeapon = new this._Cnstr.Mesh(
      new this._Cnstr.BoxBufferGeometry(0.4, 0.4, 1),
      this.mainMat
    );

    super._init();
  }

  _bind() {
    super._bind();
  }

  _render() {
    for (let i = 0; i < this.rockets.length; i++) {
      const rocket = this.rockets[i];
      rocket.translateOnAxis(
        new this._Cnstr.Vector3(0, 0, 1),
        this.rocketSpeed
      );
    }

    super._render();
  }

  shoot(camera) {
    this.ammoWeapon = new this._Cnstr.Mesh(
      new this._Cnstr.BoxBufferGeometry(0.2, 0.2, 0.5),
      this.mainMat
    );
    this.ammoWeapon.castShadow = true;

    this.ammoPos = this.meshWeapon.getWorldPosition(
      new this._Cnstr.Vector3(0, 0, 0)
    );
    this.ammoWeapon.position.set(
      this.ammoPos.x,
      this.ammoPos.y,
      this.ammoPos.z
    );

    const raycast = new this._Cnstr.Raycaster();
    raycast.setFromCamera(new this._Cnstr.Vector2(0, 0), camera);

    const intersects = raycast.intersectObjects(this._Scene.children);

    if (intersects.length > 0) {
      this.ammoWeapon.lookAt(intersects[0].point);
    }

    this._Scene.add(this.ammoWeapon);
    this.rockets.push(this.ammoWeapon);
  }
};
