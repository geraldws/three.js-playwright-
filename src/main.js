import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createGearGeometry } from './gear.js';

const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x14161c);

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.set(3.5, 3, 7);

// Lighting: soft fill + key light + rim light so the metal reads well from any angle.
scene.add(new THREE.HemisphereLight(0xbcd2ff, 0x202030, 0.9));
const key = new THREE.DirectionalLight(0xffffff, 2.4);
key.position.set(5, 6, 5);
scene.add(key);
const rim = new THREE.DirectionalLight(0x6aa0ff, 1.2);
rim.position.set(-5, -2, -4);
scene.add(rim);

// Procedural environment gives the metallic material something to reflect (no asset downloads).
const envScene = new THREE.Scene();
envScene.background = new THREE.Color(0x8090b0);
const box = new THREE.Mesh(
  new THREE.BoxGeometry(10, 10, 10),
  new THREE.MeshBasicMaterial({ side: THREE.BackSide, color: 0xa0aac4 }),
);
envScene.add(box);
for (const [x, y, z, c] of [[4, 6, 2, 0xffffff], [6, 2, -4, 0xffffff], [-6, 1, 3, 0xffd9a0], [0, -4, -6, 0x88aaff]]) {
  const s = new THREE.Mesh(new THREE.SphereGeometry(2), new THREE.MeshBasicMaterial({ color: c }));
  s.position.set(x, y, z);
  envScene.add(s);
}
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(envScene, 0.04).texture;

const gear = new THREE.Mesh(
  createGearGeometry(),
  new THREE.MeshStandardMaterial({ color: 0xd4a72c, metalness: 0.6, roughness: 0.3 }),
);
scene.add(gear);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 3;
controls.maxDistance = 20;

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

const clock = new THREE.Clock();
let frames = 0;
renderer.setAnimationLoop(() => {
  gear.rotation.z += clock.getDelta() * 0.6;
  controls.update();
  renderer.render(scene, camera);
  frames++;
  // Exposed so Playwright can wait until real frames have been drawn.
  window.__frames = frames;
});
