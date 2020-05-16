import "./style/main.css";
import * as THREE from "three";
import CANNON from "cannon";

const Cam = require("./models/Player.js"),
  GScene = require("./models/GameScene.js");

/**
 * Sizes
 */
const sizes = {};
sizes.width = window.innerWidth;
sizes.height = window.innerHeight;

window.addEventListener("resize", () => {
  // Save sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.threeCam.aspect = sizes.width / sizes.height;
  camera.threeCam.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
});

/**
 * Environnements
 */
// Scene
const scene = new THREE.Scene();

// Physic
const world = new CANNON.World();
world.gravity.set(0, -18, 0);

const camera = new Cam(THREE, scene, {
  pokeBall: (mesh, point, dir, power) =>
    gameScene.pokeBall(mesh, point, dir, power)
});

const gameScene = new GScene(THREE, CANNON, scene, world);

camera.getInteractiveElts(gameScene.balls);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector(".webgl")
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(sizes.width, sizes.height);

/**
 * Loop
 */
const loop = time => {
  // Keep looping
  window.requestAnimationFrame(loop);

  world.step(1 / 60);

  renderer.render(scene, camera.threeCam);
};
loop();
