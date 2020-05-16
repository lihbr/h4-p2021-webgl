import "./style/main.css";
import * as THREE from "three";

// Game elements
const Cam = require("./models/FpsCamera.js"),
  GScene = require("./models/GameScene.js"),
  EvtsManager = require("./models/EventsManager.js");

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

const gameScene = new GScene(THREE, scene);

const eventsManager = new EvtsManager();

const camera = new Cam(THREE, scene, {
  sendEventID: id => eventsManager.receiveEvent(id)
});

camera.getInteractiveElements(gameScene.interactiveElts);

eventsManager.getGameScene(gameScene);

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
const loop = () => {
  // Render
  renderer.render(scene, camera.threeCam);

  // Keep looping
  window.requestAnimationFrame(loop);
};
loop();
