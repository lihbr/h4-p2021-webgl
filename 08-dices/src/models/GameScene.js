const Base = require("./BaseModel.js");

module.exports = class Gamescene extends Base {
  constructor(THREE, CANNON, scene, world) {
    super(THREE, scene);
    this._Physics = CANNON;
    this._World = world;

    this._init();
  }

  _init() {
    this.dices = [];
    this.realDiceface = {
      1: 1,
      2: 6,
      3: 4,
      4: 3,
      5: 2,
      6: 5
    };

    this.mainMat = new this._Cnstr.MeshPhongMaterial({
      color: 0xffffff,
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
      new this._Cnstr.BoxBufferGeometry(30, 1, 30),
      this.mainMat
    );
    this.floor.position.y = -0.5;
    this.floor.receiveShadow = true;
    this._Scene.add(this.floor);

    this.groundMaterial = new this._Physics.Material();
    // Create a plane
    const groundBody = new this._Physics.Body({
      mass: 0, // freeze if 0
      material: this.groundMaterial,
      position: new this._Physics.Vec3(0, -1, 0), // m
      shape: new this._Physics.Box(new this._Physics.Vec3(30, 1, 30))
    });
    this._World.addBody(groundBody);

    this.ceiling = new this._Cnstr.Mesh(
      new this._Cnstr.BoxBufferGeometry(30, 1, 30),
      this.mainMat
    );
    this.ceiling.position.y = 20;
    this.ceiling.receiveShadow = true;
    this._Scene.add(this.ceiling);

    this.ceilingMaterial = new this._Physics.Material();
    // Create a plane
    const ceilingBody = new this._Physics.Body({
      mass: 0, // freeze if 0
      material: this.ceilingMaterial,
      position: new this._Physics.Vec3(
        this.ceiling.position.x,
        this.ceiling.position.y,
        this.ceiling.position.z
      ), // m
      shape: new this._Physics.Box(new this._Physics.Vec3(30, 1, 30))
    });
    this._World.addBody(ceilingBody);

    this.nWall = this._createWall();
    this.nWall.position.z = 15;
    this.nWall.receiveShadow = true;
    this._Scene.add(this.nWall);

    this.nWallBodyMaterial = new this._Physics.Material();
    const nWallBody = new this._Physics.Body({
      mass: 0, // freeze if 0
      material: this.nWallBodyMaterial,
      position: new this._Physics.Vec3(
        this.nWall.position.x,
        this.nWall.position.y,
        this.nWall.position.z
      ), // m
      shape: new this._Physics.Box(new this._Physics.Vec3(30, 20, 0.1))
    });
    this._World.addBody(nWallBody);

    this.sWall = this._createWall();
    this.sWall.position.z = -15;
    this.sWall.receiveShadow = true;
    this._Scene.add(this.sWall);

    this.sWallBodyMaterial = new this._Physics.Material();
    const sWallBody = new this._Physics.Body({
      mass: 0, // freeze if 0
      material: this.sWallBodyMaterial,
      position: new this._Physics.Vec3(
        this.sWall.position.x,
        this.sWall.position.y,
        this.sWall.position.z
      ), // m
      shape: new this._Physics.Box(new this._Physics.Vec3(30, 20, 0.1))
    });
    this._World.addBody(sWallBody);

    this.eWall = this._createWall();
    this.eWall.position.x = -15;
    this.eWall.receiveShadow = true;
    this.eWall.rotation.y = this._Cnstr.Math.degToRad(90);
    this._Scene.add(this.eWall);

    this.eWallBodyMaterial = new this._Physics.Material();
    const eWallBody = new this._Physics.Body({
      mass: 0, // freeze if 0
      material: this.eWallBodyMaterial,
      position: new this._Physics.Vec3(
        this.eWall.position.x,
        this.eWall.position.y,
        this.eWall.position.z
      ), // m
      shape: new this._Physics.Box(new this._Physics.Vec3(0.1, 20, 30))
    });
    this._World.addBody(eWallBody);

    this.wWall = this._createWall();
    this.wWall.position.x = 15;
    this.wWall.receiveShadow = true;
    this.wWall.rotation.y = this._Cnstr.Math.degToRad(90);
    this._Scene.add(this.wWall);

    this.wWallBodyMaterial = new this._Physics.Material();
    const wWallBody = new this._Physics.Body({
      mass: 0, // freeze if 0
      material: this.wWallBodyMaterial,
      position: new this._Physics.Vec3(
        this.wWall.position.x,
        this.wWall.position.y,
        this.wWall.position.z
      ), // m
      shape: new this._Physics.Box(new this._Physics.Vec3(0.1, 20, 30))
    });
    this._World.addBody(wWallBody);

    super._init();
  }

  _bind() {
    super._bind();
  }

  _render() {
    super._render();
    this.updatePhys();
  }

  _createWall() {
    const newWall = new this._Cnstr.Mesh(
      new this._Cnstr.BoxBufferGeometry(30, 20, 0.1),
      this.mainMat
    );
    newWall.position.y = 10;
    newWall.receiveShadow = true;
    return newWall;
  }

  updatePhys() {
    for (let i = 0; i < this.dices.length; i++) {
      const dice = this.dices[i];

      dice.position.x = dice.diceBody.position.x;
      dice.position.y = dice.diceBody.position.y;
      dice.position.z = dice.diceBody.position.z;
      dice.quaternion.x = dice.diceBody.quaternion.x;
      dice.quaternion.y = dice.diceBody.quaternion.y;
      dice.quaternion.z = dice.diceBody.quaternion.z;
      dice.quaternion.w = dice.diceBody.quaternion.w;

      if (dice.rolling) {
        dice.tick++;
      }

      if (dice.tick == 90) {
        dice.tick = 0;

        if (dice.prevPos && dice.rolling) {
          const distance = dice.prevPos.distanceTo(dice.position);
          if (Math.round(distance * 100) > 0) {
            dice.rolling = false;
            const side = this.getDiceSide(dice);
            console.log(side);
          }
        }
        if (dice.rolling) {
          dice.prevPos = new this._Cnstr.Vector3(
            dice.position.x,
            dice.position.y,
            dice.position.z
          );
        }
      }
    }
  }

  rollDice(point, dir, power) {
    for (let i = 0; i < 5; i++) {
      const randPoint = new this._Cnstr.Vector3(
        point.x + Math.random() * 0.5 - 0.25,
        point.y + Math.random() * 0.5 - 0.25,
        point.z
      );
      const dice = this.createDice(randPoint);

      const worldPoint = new this._Physics.Vec3(
        dice.position.x + Math.random() * 0.4 - 0.2,
        dice.position.y + Math.random() * 0.4 - 0.2,
        dice.position.z
      );
      const impulse = new this._Physics.Vec3(
        dir.x * power,
        dir.y * power,
        dir.z * power
      );

      dice.diceBody.applyImpulse(impulse, worldPoint);
    }
  }

  createDice(position) {
    const dice = new this._Cnstr.Mesh(
      new this._Cnstr.BoxBufferGeometry(2, 2, 2),
      this.mainMat
    );
    dice.position.set(position.x, position.y, position.z);
    dice.rotation.set(
      this._Cnstr.Math.degToRad(Math.round(Math.random() * 360)),
      this._Cnstr.Math.degToRad(Math.round(Math.random() * 360)),
      this._Cnstr.Math.degToRad(Math.round(Math.random() * 360))
    );
    dice.receiveShadow = true;
    dice.rolling = true;
    dice.tick = 0;
    this._Scene.add(dice);

    dice.diceBodymaterial = new this._Physics.Material();
    dice.diceBody = new this._Physics.Body({
      mass: 5,
      material: dice.diceBodymaterial,
      position: new this._Physics.Vec3(
        dice.position.x,
        dice.position.y,
        dice.position.z
      ), // m
      shape: new this._Physics.Box(new this._Physics.Vec3(1, 1, 1))
    });
    const quatRotDiceMesh = new this._Physics.Quaternion(0, 0, 0, 0);
    quatRotDiceMesh.setFromEuler(
      dice.rotation.x,
      dice.rotation.y,
      dice.rotation.z
    );
    dice.diceBody.quaternion = quatRotDiceMesh;

    this._World.addBody(dice.diceBody);

    const behaviourDiceToGround = new this._Physics.ContactMaterial(
      dice.diceBodymaterial,
      this.groundMaterial,
      { friction: 0.05, restitution: 0.4 }
    );
    const behaviourDiceToCeiling = new this._Physics.ContactMaterial(
      dice.diceBodymaterial,
      this.ceilingMaterial,
      { friction: 0.05, restitution: 0.4 }
    );
    const behaviourDiceToNWall = new this._Physics.ContactMaterial(
      dice.diceBodymaterial,
      this.nWallBodyMaterial,
      { friction: 0.05, restitution: 0.2 }
    );
    const behaviourDiceToSWall = new this._Physics.ContactMaterial(
      dice.diceBodymaterial,
      this.sWallBodyMaterial,
      { friction: 0.05, restitution: 0.2 }
    );
    const behaviourDiceToEWall = new this._Physics.ContactMaterial(
      dice.diceBodymaterial,
      this.eWallBodyMaterial,
      { friction: 0.05, restitution: 0.2 }
    );
    const behaviourDiceToWWall = new this._Physics.ContactMaterial(
      dice.diceBodymaterial,
      this.wWallBodyMaterial,
      { friction: 0.05, restitution: 0.2 }
    );

    this._World.addContactMaterial(behaviourDiceToGround);
    this._World.addContactMaterial(behaviourDiceToCeiling);
    this._World.addContactMaterial(behaviourDiceToNWall);
    this._World.addContactMaterial(behaviourDiceToSWall);
    this._World.addContactMaterial(behaviourDiceToEWall);
    this._World.addContactMaterial(behaviourDiceToWWall);

    this.dices.push(dice);

    return dice;
  }

  getDiceSide(dice) {
    const raycast = new this._Cnstr.Raycaster();

    raycast.set(
      new this._Cnstr.Vector3(
        dice.position.x,
        dice.position.y + 10,
        dice.position.z
      ),
      new this._Cnstr.Vector3(0, -1, 0)
    );

    const intersects = raycast.intersectObjects([dice]);

    if (intersects.length > 0) {
      const diceFace = Math.round((intersects[0].faceIndex + 1) / 2);
      return this.realDiceface[diceFace];
    }
  }
};
