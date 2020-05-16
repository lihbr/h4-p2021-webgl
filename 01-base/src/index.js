import "./style/main.css";

import {
  Scene,
  Mesh,
  WebGLRenderer,
  PerspectiveCamera,
  Group,
  MeshNormalMaterial,
  SphereGeometry,
  PlaneGeometry,
  TorusKnotGeometry
} from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  ratio: window.innerWidth / window.innerHeight
};

/**
 * Environment
 */
// Scene
const scene = new Scene();

// Camera
const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera);

/**
 * Objects
 */
const objectsGroup = new Group();
scene.add(objectsGroup);

const material = new MeshNormalMaterial();

// Sphere
const sphere = new Mesh(new SphereGeometry(2, 16, 16), material);
sphere.position.x = -6;
objectsGroup.add(sphere);

// Plane
const plane = new Mesh(new PlaneGeometry(4, 4, 4, 4), material);
objectsGroup.add(plane);

// Torus Knot
const torusKnot = new Mesh(new TorusKnotGeometry(1.5, 0.5, 128, 16), material);
torusKnot.position.x = 6;
objectsGroup.add(torusKnot);

/**
 * Renderer
 */
const renderer = new WebGLRenderer({
  canvas: document.querySelector(".canvas")
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Controls
 */
const cameraControls = new OrbitControls(camera, renderer.domElement);

/**
 * Events
 */
const resize = () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  sizes.ratio = sizes.width / sizes.height;

  renderer.setSize(sizes.width, sizes.height);
  camera.aspect = sizes.ratio;
  camera.updateProjectionMatrix();
};
window.addEventListener("resize", resize);
resize();

/**
 * Start
 */
const loop = () => {
  // Update objects
  sphere.rotation.y += 0.002;
  plane.rotation.y += 0.002;
  torusKnot.rotation.y += 0.002;

  cameraControls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(loop);
};
loop();
