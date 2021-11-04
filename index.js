import * as THREE from "https://threejs.org/build/three.module.js";
import {GLTFLoader} from "https://threejs.org/examples/jsm/loaders/GLTFLoader.js";
import {OrbitControls} from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import {getRGB, cloneObject3d, xyz} from "./functions.js";

const gridOffset = 2.5;

const rectLight = {
	color: getRGB(255, 255, 255),
	strength: 0.5,
	size: new THREE.Vector2(50, 50),
	pos: new THREE.Vector3(2.5, 5, 2.5),
};

const ambLight = {
	color: getRGB(255, 255, 255),
	strength: 0.6,
};

const colors = {
	bg: getRGB(128, 0, 0),
	dark: getRGB(25, 25, 25),
	light: getRGB(245, 245, 245),
};

const mats = {
	bg: new THREE.MeshStandardMaterial({color: colors.bg}),
	dark: new THREE.MeshStandardMaterial({color: colors.dark}),
	light: new THREE.MeshStandardMaterial({color: colors.light}),
};

let canvasSize = getCanvasSize();

const scene = new THREE.Scene();
scene.background = colors.light;

const camera = new THREE.PerspectiveCamera(10, canvasSize.ratio, 0.1, 500);
camera.position.set(-40, 40, 40);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(canvasSize.w, canvasSize.h);
renderer.setPixelRatio(window.devicePixelRatio);

const controls = new OrbitControls(camera, renderer.domElement);

const keyLight = new THREE.RectAreaLight(
	rectLight.color,
	rectLight.strength,
	rectLight.size.x,
	rectLight.size.y
);
keyLight.position.set(rectLight.pos.x, rectLight.pos.y, rectLight.pos.z);
keyLight.lookAt(0, 0, 0);

const ambientLight = new THREE.AmbientLight(ambLight.color, ambLight.strength);

const loader = new GLTFLoader();

scene.add(keyLight);
scene.add(ambientLight);

document.body.appendChild(renderer.domElement);

const objects3d = {
	bowls: [],
	plates: [],
	pipes: [],
};

function initBowls() {
	loader.load(
		"./models/bowl_lowpoly.glb",
		function (gltf) {
			const obj = gltf.scene.children[0];
			for (let x = -1; x <= 1; x++) {
				for (let y = -1; y <= 1; y++) {
					for (let z = -1; z <= 1; z++) {
						const pos = new THREE.Vector3(
							x * gridOffset,
							y * gridOffset,
							z * gridOffset
						);

						const bowl = cloneObject3d(obj, {
							position: pos,
							material: mats.light,
						});
						objects3d.bowls.push(bowl);
						scene.add(bowl);
					}
				}
			}
		},
		undefined,
		function (error) {
			console.error(error);
		}
	);
}

initBowls();

function animate() {
	const rot = new THREE.Vector3(0.005, 0.0001, 0.005);

	for (const t in objects3d) {
		if (
			typeof objects3d[t] === "object" &&
			Object.entries(objects3d[t]).length > 0
		) {
			const type = objects3d[t];
			for (let i = 0; i < type.length; i++) {
				type[i].rotation.x += rot.x;
				type[i].rotation.y += rot.y;
				type[i].rotation.z += rot.z;
			}
		}
	}
	requestAnimationFrame(animate);

	renderer.render(scene, camera);
	controls.update();
}

animate();

window.onresize = () => {
	canvasSize = getCanvasSize();
	document.body.width = canvasSize.w;
	document.body.height = canvasSize.h;
	renderer.setSize(canvasSize.w, canvasSize.h);
	camera.aspect = canvasSize.ratio;
	camera.updateProjectionMatrix();
};

function getCanvasSize() {
	return {
		w: window.innerWidth,
		h: window.innerHeight,
		ratio: window.innerWidth / window.innerHeight,
	};
}
