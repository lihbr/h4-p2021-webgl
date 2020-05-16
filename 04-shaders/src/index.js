import "./style/main.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import flagVertexShader from "./shaders/flag.vertex.glsl";
import flagFragmentShader from "./shaders/flag.fragment.glsl";
import flagImage from "./img/flag.png";

import patternsVertexShader from "./shaders/patterns.vertex.glsl";
import patternsFragmentShader from "./shaders/patterns.fragment.glsl";

import wavesVertexShader from "./shaders/waves.vertex.glsl";
import wavesFragmentShader from "./shaders/waves.fragment.glsl";

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const flagTexture = textureLoader.load(flagImage);

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

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector(".canvas")
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(sizes.width, sizes.height);

/**
 * Flag
 */
const flagGeometry = new THREE.PlaneBufferGeometry(3, 3, 20, 20);

// const flagMaterial = new THREE.MeshBasicMaterial()
const flagMaterial = new THREE.ShaderMaterial({
  vertexShader: flagVertexShader,
  fragmentShader: flagFragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uTexture: { value: flagTexture }
  },
  side: THREE.DoubleSide
});

const flagMesh = new THREE.Mesh(flagGeometry, flagMaterial);
flagMesh.scale.y = 0.75;
// scene.add(flagMesh);

/**
 * Patterns
 */
const patternsGeometry = new THREE.PlaneBufferGeometry();

const patternsMaterial = new THREE.ShaderMaterial({
  vertexShader: patternsVertexShader,
  fragmentShader: patternsFragmentShader,
  side: THREE.DoubleSide
});

const patternsMesh = new THREE.Mesh(patternsGeometry, patternsMaterial);
patternsMesh.scale.set(3, 3, 3);
// scene.add(patternsMesh);

/**
 * Waves
 */
const wavesGeometry = new THREE.PlaneBufferGeometry(1, 1, 500, 500);

const wavesMaterial = new THREE.ShaderMaterial({
  vertexShader: wavesVertexShader,
  fragmentShader: wavesFragmentShader,
  side: THREE.DoubleSide,
  uniforms: {
    uTime: { value: 0 },
    uColorLow: { value: new THREE.Color("#002651") },
    uColorHigh: { value: new THREE.Color("#a5c9cd") }
  }
});

const wavesMesh = new THREE.Mesh(wavesGeometry, wavesMaterial);
wavesMesh.scale.set(10, 10, 10);
wavesMesh.rotation.x = Math.PI / 2;
wavesMesh.position.y = -0.5;
scene.add(wavesMesh);

/**
 * Camera controls
 */
const cameraControls = new OrbitControls(camera, renderer.domElement);
cameraControls.zoomSpeed = 0.3;
cameraControls.enableDamping = true;

/**
 * Loop
 */
const startTime = Date.now();
const loop = () => {
  const elapsedTime = Date.now() - startTime;

  // Update flag
  flagMaterial.uniforms.uTime.value = elapsedTime;

  // Update waves
  wavesMaterial.uniforms.uTime.value = elapsedTime;

  // Update camera controls
  cameraControls.update();

  // Render
  renderer.render(scene, camera);

  // Keep looping
  window.requestAnimationFrame(loop);
};
loop();
