const Base = require("./BaseModel.js");

module.exports = class Gamescene extends Base {
  constructor(THREE, CANNON, scene, world) {
    super(THREE, scene);
    this._Physics = CANNON;
    this._World = world;

    this._init();
  }

  _init() {
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
    this.ceiling.position.y = 10;
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
      shape: new this._Physics.Box(new this._Physics.Vec3(30, 10, 0.1))
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
      shape: new this._Physics.Box(new this._Physics.Vec3(30, 10, 0.1))
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
      shape: new this._Physics.Box(new this._Physics.Vec3(0.1, 10, 30))
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
      shape: new this._Physics.Box(new this._Physics.Vec3(0.1, 10, 30))
    });
    this._World.addBody(wWallBody);

    // this.sphere = new this._Cnstr.Mesh(new this._Cnstr.SphereBufferGeometry(1, 16, 16), this.mainMat)
    // this.sphere.position.set(0, 5, 0)
    // this.sphere.castShadow = true
    // this._Scene.add(this.sphere)
    // this.interactiveElts.push(this.sphere)

    // this.sphere.sphereMaterial = new this._Physics.Material()
    // this.sphere.sphereBody = new this._Physics.Body({
    //   mass: 5, // kg
    //   material : this.sphere.sphereMaterial,
    //   position: new this._Physics.Vec3(this.sphere.position.x, this.sphere.position.y, this.sphere.position.z), // m
    //   shape: new this._Physics.Sphere(1)
    // })
    // this._World.addBody(this.sphere.sphereBody)

    // const behaviourSphereToGround = new this._Physics.ContactMaterial(this.sphere.sphereMaterial, this.groundMaterial, { friction: 0.0, restitution: .9 })
    // const behaviourSphereToCeiling = new this._Physics.ContactMaterial(this.sphere.sphereMaterial, this.ceilingMaterial, { friction: 0.0, restitution: .9 })
    // const behaviourSphereToNWall = new this._Physics.ContactMaterial(this.sphere.sphereMaterial, this.nWallBodyMaterial, { friction: 0.0, restitution: .6 })
    // const behaviourSphereToSWall = new this._Physics.ContactMaterial(this.sphere.sphereMaterial, this.sWallBodyMaterial, { friction: 0.0, restitution: .6 })
    // const behaviourSphereToEWall = new this._Physics.ContactMaterial(this.sphere.sphereMaterial, this.eWallBodyMaterial, { friction: 0.0, restitution: .6 })
    // const behaviourSphereToWWall = new this._Physics.ContactMaterial(this.sphere.sphereMaterial, this.wWallBodyMaterial, { friction: 0.0, restitution: .6 })

    // this._World.addContactMaterial(behaviourSphereToGround)
    // this._World.addContactMaterial(behaviourSphereToCeiling)
    // this._World.addContactMaterial(behaviourSphereToNWall)
    // this._World.addContactMaterial(behaviourSphereToSWall)
    // this._World.addContactMaterial(behaviourSphereToEWall)
    // this._World.addContactMaterial(behaviourSphereToWWall)

    this.balls = [];
    for (let i = 0; i < 50; i++) {
      this.createBall(
        5,
        1,
        Math.floor(Math.random() * 20) - 10,
        Math.floor(Math.random() * 5),
        Math.floor(Math.random() * 20) - 10
      );
    }

    super._init();
  }

  _bind() {
    super._bind();
  }

  _render() {
    super._render();
    this.updatePhys();
    // this.sphere.position.x = this.sphere.sphereBody.position.x
    // this.sphere.position.y = this.sphere.sphereBody.position.y
    // this.sphere.position.z = this.sphere.sphereBody.position.z
    // this.sphere.quaternion.x = this.sphere.sphereBody.quaternion.x
    // this.sphere.quaternion.y = this.sphere.sphereBody.quaternion.y
    // this.sphere.quaternion.z = this.sphere.sphereBody.quaternion.z
    // this.sphere.quaternion.w = this.sphere.sphereBody.quaternion.w
  }

  _createWall() {
    const newWall = new this._Cnstr.Mesh(
      new this._Cnstr.BoxBufferGeometry(30, 10, 0.1),
      this.mainMat
    );
    newWall.receiveShadow = true;
    return newWall;
  }

  pokeBall(mesh, point, dir, power) {
    const worldPoint = new this._Physics.Vec3(point.x, point.y, point.z);
    const impulse = new this._Physics.Vec3(
      dir.x * power,
      dir.y * power,
      dir.z * power
    );
    mesh.sphereBody.applyImpulse(impulse, worldPoint);
  }

  createBall(mass, radius, posX, posY, posZ) {
    const sphere = new this._Cnstr.Mesh(
      new this._Cnstr.SphereBufferGeometry(radius, 16, 16),
      new this._Cnstr.MeshStandardMaterial({
        color: new this._Cnstr.Color(`hsl(${Math.random() * 360}, 70%, 35%)`)
      })
    );
    sphere.position.set(posX, posY, posZ);
    sphere.castShadow = true;
    this._Scene.add(sphere);

    // Create a sphere in phys
    sphere.sphereMaterial = new this._Physics.Material();
    sphere.sphereBody = new this._Physics.Body({
      mass: mass, // kg
      material: sphere.sphereMaterial,
      position: new this._Physics.Vec3(
        sphere.position.x,
        sphere.position.y,
        sphere.position.z
      ), // m
      shape: new this._Physics.Sphere(radius)
    });
    this._World.addBody(sphere.sphereBody);

    const behaviourSphereToGround = new this._Physics.ContactMaterial(
      sphere.sphereMaterial,
      this.groundMaterial,
      { friction: 0.0, restitution: 0.9 }
    );
    const behaviourSphereToCeiling = new this._Physics.ContactMaterial(
      sphere.sphereMaterial,
      this.ceilingMaterial,
      { friction: 0.0, restitution: 0.9 }
    );
    const behaviourSphereToNWall = new this._Physics.ContactMaterial(
      sphere.sphereMaterial,
      this.nWallBodyMaterial,
      { friction: 0.0, restitution: 0.6 }
    );
    const behaviourSphereToSWall = new this._Physics.ContactMaterial(
      sphere.sphereMaterial,
      this.sWallBodyMaterial,
      { friction: 0.0, restitution: 0.6 }
    );
    const behaviourSphereToEWall = new this._Physics.ContactMaterial(
      sphere.sphereMaterial,
      this.eWallBodyMaterial,
      { friction: 0.0, restitution: 0.6 }
    );
    const behaviourSphereToWWall = new this._Physics.ContactMaterial(
      sphere.sphereMaterial,
      this.wWallBodyMaterial,
      { friction: 0.0, restitution: 0.6 }
    );

    this._World.addContactMaterial(behaviourSphereToGround);
    this._World.addContactMaterial(behaviourSphereToCeiling);
    this._World.addContactMaterial(behaviourSphereToNWall);
    this._World.addContactMaterial(behaviourSphereToSWall);
    this._World.addContactMaterial(behaviourSphereToEWall);
    this._World.addContactMaterial(behaviourSphereToWWall);

    this.balls.push(sphere);
  }

  updatePhys() {
    for (let i = 0; i < this.balls.length; i++) {
      const ball = this.balls[i];

      ball.position.x = ball.sphereBody.position.x;
      ball.position.y = ball.sphereBody.position.y;
      ball.position.z = ball.sphereBody.position.z;
      ball.quaternion.x = ball.sphereBody.quaternion.x;
      ball.quaternion.y = ball.sphereBody.quaternion.y;
      ball.quaternion.z = ball.sphereBody.quaternion.z;
      ball.quaternion.w = ball.sphereBody.quaternion.w;
    }
  }
};
