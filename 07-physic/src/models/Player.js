const Base = require("./BaseModel.js");

module.exports = class AnimateCamera extends Base {
  constructor(THREE, scene, cb) {
    super(THREE, scene, cb);
    this._init();
  }

  _init() {
    this.canvas = document.querySelector(".webgl");

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

    this.threeCam.position.z = 15;
    this.threeCam.position.y = 4;

    this._Scene.add(this.threeCam);

    super._init();
  }

  _bind() {
    super._bind();
    this.canvas.addEventListener("mousedown", event => {
      if (this.interactiveElts) {
        const normX = (event.clientX / window.innerWidth) * 2 - 1;
        const normY = (event.clientY / window.innerHeight) * -2 + 1;

        const raycast = new this._Cnstr.Raycaster();
        raycast.setFromCamera(
          new this._Cnstr.Vector2(normX, normY),
          this.threeCam
        );

        const intersects = raycast.intersectObjects(this.interactiveElts, true);

        if (intersects.length > 0) {
          // console.log(intersects[0].point)
          const pokePosition = intersects[0].point;

          const dir = new this._Cnstr.Vector3();
          dir
            .subVectors(intersects[0].object.position, pokePosition)
            .normalize();

          this._Callbacks.pokeBall(
            intersects[0].object,
            pokePosition,
            dir,
            300
          );
        }
      }
    });
  }

  _render() {
    super._render();
  }

  getInteractiveElts(meshes) {
    this.interactiveElts = meshes;
  }
};
