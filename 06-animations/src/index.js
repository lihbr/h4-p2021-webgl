import "./style/main.css";
import * as THREE from "three";

const AnimCam = require("./models/AnimCamera.js"),
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

// Camera
const camera = new AnimCam(THREE, scene, {});

const gameScene = new GScene(THREE, scene);

camera.getLookAtPosition(gameScene.erraticMesh);
// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector(".webgl")
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(sizes.width, sizes.height);

/**
 * Loop
 */
const loop = () => {
  // Render
  renderer.render(scene, camera.threeCam);

  // Keep looping
  window.requestAnimationFrame(loop);
};
loop();
