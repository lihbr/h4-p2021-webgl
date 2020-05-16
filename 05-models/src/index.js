import "./style/main.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

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
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
});

/**
 * Environnements
 */
// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Test
const cube = new THREE.Mesh(
  new THREE.CylinderBufferGeometry(0.5, 0.5, 1, 10),
  new THREE.MeshStandardMaterial({ flatShading: true })
);
scene.add(cube);

// Lights
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.x = 3;
directionalLight.position.y = 4;
directionalLight.position.z = 5;
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector(".canvas")
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(sizes.width, sizes.height);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.physicallyCorrectLights = true;
renderer.gammaFactor = 2.2;
renderer.gammaOutPut = true;

/**
 * Models
 */
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/assets/draco/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load("/assets/models/burger/burger.glb", model => {
  console.log(model.scene.children);

  const burger = new THREE.Group();
  burger.scale.set(0.4, 0.4, 0.4);
  burger.position.y = 0.75;
  scene.add(burger);

  [...model.scene.children].map(i => burger.add(i));

  console.log("success");
});

/**
 * Camera controls
 */
const cameraControls = new OrbitControls(camera, renderer.domElement);

/**
 * Loop
 */
const loop = () => {
  // Render
  renderer.render(scene, camera);

  // Keep looping
  window.requestAnimationFrame(loop);
};
loop();
