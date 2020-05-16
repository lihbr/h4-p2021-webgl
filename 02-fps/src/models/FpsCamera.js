const Base = require("./BaseModel.js"),
  Weapon = require("./Weapon.js");

module.exports = class FpsCamera extends Base {
  constructor(THREE, scene, cb) {
    super(THREE, scene, cb);
  }

  _init() {
    this._canvas = document.querySelector(".webgl");
    this._fpsUseBtn = document.querySelector(".useCursor");
    this._fpsCursor = document.querySelector(".inGameCursor");

    this._rotEngaged = false;

    this._angularSensibility = 1.8;

    this._mapping = {
      90: "forward",
      83: "backward",
      81: "left",
      68: "right",
      69: "use"
    };

    this.moveAxis = {};
    this._updateMove();

    this.interactable = false;
    this.interactiveElts = [];

    this.forwardPressed = false;
    this.backwardPressed = false;
    this.leftPressed = false;
    this.rightPressed = false;

    // Spike Handling on event for Chrome
    this._lastEvtMvtX = 0;
    this._lastEvtMvtY = 0;

    // Sizes

    this.sizes = {};
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;

    // Camera

    this.controlAxis = new this._Cnstr.Object3D();

    this.threeCam = new this._Cnstr.PerspectiveCamera(
      75,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );

    this.controlAxis.add(this.threeCam);
    this.controlAxis.position.z = 3;

    this.weapon = new Weapon(this._Cnstr, this._Scene, {});
    this.weapon.meshWeapon.position.set(0.5, -0.5, -1);

    this.threeCam.add(this.weapon.meshWeapon);

    this._Scene.add(this.controlAxis);

    console.log(this.weapon);

    super._init();
  }

  _bind() {
    this._initPointerLock();

    // Event pour changer l'état du pointeur, sous tout les types de navigateur
    document.addEventListener(
      "pointerlockchange",
      () => {
        this._pointerlockchange();
      },
      false
    );
    document.addEventListener(
      "mspointerlockchange",
      () => {
        this._pointerlockchange();
      },
      false
    );
    document.addEventListener(
      "mozpointerlockchange",
      () => {
        this._pointerlockchange();
      },
      false
    );
    document.addEventListener(
      "webkitpointerlockchange",
      () => {
        this._pointerlockchange();
      },
      false
    );

    window.addEventListener(
      "mousemove",
      evt => {
        const dampPos = this._handleSpike(evt);

        if (this._rotEngaged === true) {
          this.controlAxis.rotation.y -=
            dampPos.movementX * 0.001 * this._angularSensibility;

          let nextXRot =
            this.threeCam.rotation.x -
            dampPos.movementY * 0.001 * this._angularSensibility;

          if (
            nextXRot >= this._Cnstr.Math.degToRad(90) ||
            nextXRot <= this._Cnstr.Math.degToRad(-90)
          ) {
            nextXRot = this.threeCam.rotation.x;
          }

          this.threeCam.rotation.x = nextXRot;
        }
      },
      false
    );

    window.addEventListener(
      "keydown",
      evt => {
        if (this._rotEngaged === true) {
          if (this._mapping[evt.keyCode] == "use" && this.interactable) {
            this._triggerElement();
          } else {
            switch (this._mapping[evt.keyCode]) {
              case "forward":
                this.forwardPressed = true;
                break;
              case "backward":
                this.backwardPressed = true;
                break;
              case "left":
                this.leftPressed = true;
                break;
              case "right":
                this.rightPressed = true;
                break;
            }
            this._updateMove();
          }
        }
      },
      false
    );

    window.addEventListener(
      "keyup",
      evt => {
        if (this._rotEngaged === true) {
          if (this._mapping[evt.keyCode]) {
            switch (this._mapping[evt.keyCode]) {
              case "forward":
                this.forwardPressed = false;
                break;
              case "backward":
                this.backwardPressed = false;
                break;
              case "left":
                this.leftPressed = false;
                break;
              case "right":
                this.rightPressed = false;
                break;
            }
            this._updateMove();
          }
        }
      },
      false
    );

    window.addEventListener(
      "click",
      evt => {
        if (this._rotEngaged === true) {
          this.weapon.shoot(this.threeCam);
        }
      },
      false
    );

    super._bind();
  }

  _render() {
    this.controlAxis.translateOnAxis(
      new this._Cnstr.Vector3(this.moveAxis.x, 0, this.moveAxis.z),
      0.1
    );

    this.checkForInteractiveElts();

    super._render();
  }

  _initPointerLock() {
    // Requete pour la capture du pointeur
    this._canvas.addEventListener(
      "click",
      () => {
        this._canvas.requestPointerLock =
          this._canvas.requestPointerLock ||
          this._canvas.msRequestPointerLock ||
          this._canvas.mozRequestPointerLock ||
          this._canvas.webkitRequestPointerLock;
        if (this._canvas.requestPointerLock) {
          this._canvas.requestPointerLock();
        }
      },
      false
    );
  }

  _pointerlockchange(evt) {
    const controlEnabled =
      document.mozPointerLockElement === this._canvas ||
      document.webkitPointerLockElement === this._canvas ||
      document.msPointerLockElement === this._canvas ||
      document.pointerLockElement === this._canvas;

    if (!controlEnabled) {
      this._rotEngaged = false;
      this._fpsCursor.classList.add("hidden");
    } else {
      this._rotEngaged = true;
      this._fpsCursor.classList.remove("hidden");
    }
  }

  _handleSpike(evt) {
    const dampValues = {};

    if (
      Math.abs(this._lastEvtMvtX - evt.movementX) > 200 ||
      Math.abs(this._lastEvtMvtY - evt.movementY) > 200
    ) {
      console.log(
        "%c Spike at X : " +
          (this._lastEvtMvtX - evt.movementX) +
          "Y : " +
          (this._lastEvtMvtY - evt.movementY),
        "color: red; font-weight: bold;"
      );
      dampValues.movementX = this._lastEvtMvtX;
      dampValues.movementY = this._lastEvtMvtY;
    } else {
      dampValues.movementX = evt.movementX;
      dampValues.movementY = evt.movementY;

      this._lastEvtMvtX = evt.movementX;
      this._lastEvtMvtY = evt.movementY;
    }

    return dampValues;
  }

  _updateMove() {
    const axis = {
      x: 0,
      z: 0
    };

    if (!(this.forwardPressed && this.backwardPressed)) {
      axis.z = this.forwardPressed ? -1 : this.backwardPressed ? 1 : 0;
    }

    if (!(this.leftPressed && this.rightPressed)) {
      axis.x = this.leftPressed ? -1 : this.rightPressed ? 1 : 0;
    }

    if (Math.abs(axis.z) > 0 && Math.abs(axis.x) > 0) {
      axis.z = axis.z / 2;
      axis.x = axis.x / 2;
    }

    this.moveAxis = axis;
  }

  _triggerElement() {
    const raycast = new this._Cnstr.Raycaster();
    raycast.setFromCamera(new this._Cnstr.Vector2(0, 0), this.threeCam);

    const intersects = raycast.intersectObjects(this.interactiveElts);

    if (intersects.length > 0 && intersects[0].distance < 2) {
      this._Callbacks.sendEventID(intersects[0].object.interactiveID);
    }
  }

  getInteractiveElements(meshes) {
    this.interactiveElts = meshes;
  }

  checkForInteractiveElts() {
    const raycast = new this._Cnstr.Raycaster();
    raycast.setFromCamera(new this._Cnstr.Vector2(0, 0), this.threeCam);

    const intersects = raycast.intersectObjects(this.interactiveElts);

    if (intersects.length > 0 && intersects[0].distance < 2) {
      if (this._fpsUseBtn.classList.contains("hidden")) {
        this._fpsUseBtn.classList.remove("hidden");
        this.interactable = true;
      }
    } else {
      if (!this._fpsUseBtn.classList.contains("hidden")) {
        this._fpsUseBtn.classList.add("hidden");
        this.interactable = false;
      }
    }
  }
};
