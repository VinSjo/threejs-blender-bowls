'use strict';

import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { getCanvasSize, containDocumentBody } from './modules/Utils';

const bowlModelUrl = '/assets/bowl.glb';

const appContainer = document.querySelector('.app');

const canvasFillScreen = true;
const canvasMaxCover = 1;
const camPos = new THREE.Vector3(-40, 40, 40);

const bgColor = new THREE.Color(
	`rgb(${Math.round(
		THREE.MathUtils.mapLinear(Math.random(), 0, 1, 25, 128)
	)},${Math.round(
		THREE.MathUtils.mapLinear(Math.random(), 0, 1, 25, 128)
	)},${Math.round(THREE.MathUtils.mapLinear(Math.random(), 0, 1, 25, 128))})`
);
const lightColor = new THREE.Color('rgb(255,255,255)');
const bowlMaterial = new THREE.MeshStandardMaterial({ color: bgColor });
const gridOffset = 2.5;
let bowls = [];

let scene, renderer, camera, controls, stats;

let runAnimation = true,
	animateBowls = true,
	pointerDown = false,
	isDragging = false;

window.onload = () => {
	updateWindowSize();
	initScene();
	animate();
	initListeners();
	appContainer.classList.add('show');
};

function initScene() {
	const canvasSize = getCanvasSize(
		appContainer,
		canvasFillScreen,
		canvasMaxCover
	);
	scene = new THREE.Scene();
	scene.background = bgColor.clone();

	camera = new THREE.PerspectiveCamera(12.5, canvasSize.ratio, 0.1, 1000);
	camera.position.set(camPos.x, camPos.y, camPos.z);
	camera.lookAt(0, 0, 0);

	renderer = new THREE.WebGLRenderer({});
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(canvasSize.width, canvasSize.height);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.domElement.classList.add('grab');

	const keyLight = new THREE.RectAreaLight(lightColor, 0.3, 50, 50);
	keyLight.position.set(2.5, 5, 2.5);
	keyLight.lookAt(0, 0, 0);
	const ambLight = new THREE.AmbientLight(lightColor, 0.7);
	scene.add(keyLight);
	scene.add(ambLight);

	controls = new OrbitControls(camera, renderer.domElement);
	controls.enablePan = false;
	controls.enableZoom = true;
	controls.enableDamping = true;

	stats = new Stats();
	stats.dom.classList.add('stats-display');

	updateProjection(canvasSize);

	const loader = new GLTFLoader();
	loader.load(
		bowlModelUrl,
		function (model) {
			const mesh = model.scene.children[0];
			for (let x = -1; x <= 1; x++) {
				for (let y = -1; y <= 1; y++) {
					for (let z = -1; z <= 1; z++) {
						const bowl = cloneMesh(mesh, {
							position: new THREE.Vector3(
								x * gridOffset,
								y * gridOffset,
								z * gridOffset
							),
							scale: new THREE.Vector3(1, 1, 1),
							material: bowlMaterial,
						});
						bowls.push(bowl);
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

	appContainer.appendChild(renderer.domElement);
	appContainer.classList.add('show');
}

function animate() {
	try {
		if (bowls && animateBowls) {
			const rot = new THREE.Vector3(0.005, 0.0001, 0.005);
			bgColor.offsetHSL(1 / 3600, 0, 0);
			for (let i = 0; i < bowls.length; i++) {
				bowls[i].rotation.x += rot.x;
				bowls[i].rotation.y += rot.y;
				bowls[i].rotation.z += rot.z;
			}
			bowlMaterial.color = bgColor.clone();
			scene.background = bgColor.clone();
		}
		renderer && renderer.render(scene, camera);
		stats && stats.update();
		controls && controls.update();
		runAnimation && requestAnimationFrame(animate);
	} catch (e) {
		console.error('An error occured, aborting execution...');
		runAnimation = false;
	}
}

function initListeners() {
	window.onresize = updateWindowSize;
	try {
		ScreenOrientation.onchange = window.onresize;
	} catch (e) {
		console.error(
			'Screen Orientation API not available in this browser...'
		);
	}

	window.onpointerdown = () => {
		pointerDown = true;
	};

	window.onpointermove = ev => {
		isDragging = pointerDown;
		if (ev.target === renderer.domElement) {
			if (isDragging) {
				!runAnimation && animate();
				!renderer.domElement.classList.contains('grabbing') &&
					renderer.domElement.classList.add('grabbing');
			} else {
				renderer.domElement.classList.contains('grabbing') &&
					renderer.domElement.classList.remove('grabbing');
			}
		}
	};

	window.onpointerup = ev => {
		!isDragging &&
			ev.target === renderer.domElement &&
			(animateBowls = !animateBowls);
		isDragging = pointerDown = false;
	};

	window.onpointerleave = window.onpointerup;

	window.onkeydown = ev => {
		if (ev.key === ' ') {
			animateBowls = !animateBowls;
		}
		if (ev.key === '0') {
			document.body.querySelector(`.${stats.dom.classList[0]}`)
				? stats.dom.remove()
				: document.body.appendChild(stats.dom);
		}
	};

	window.oncontextmenu = ev => {
		if (!(ev instanceof MouseEvent) || ev.button === 0) {
			ev.preventDefault();
			ev.stopPropagation();
		}
	};
}

function updateWindowSize() {
	containDocumentBody();
	updateProjection();
}

function updateProjection(canvasSize) {
	if (!camera || !renderer) return;
	const c = canvasSize
		? canvasSize
		: getCanvasSize(appContainer, canvasFillScreen, canvasMaxCover);
	if (camPos) {
		camera.position.y = camPos.z / THREE.MathUtils.clamp(c.ratio, 0, 1);
		camera.position.z = camera.position.y;
		camera.position.x = -camera.position.y;
		camera.lookAt(0, 0, 0);
		if (controls) {
			controls.maxDistance = camera.position.z * 1.5;
			controls.minDistance = camera.position.z * 0.75;
		}
	}
	camera.aspect = c.ratio;
	camera.updateProjectionMatrix();
	renderer.setSize(c.width, c.height);
}
function cloneMesh(
	src,
	opt = { position: null, rotation: null, scale: null, material: null }
) {
	const obj = src.clone();
	if (opt.position) {
		opt.position.x && (obj.position.x = opt.position.x);
		opt.position.y && (obj.position.y = opt.position.y);
		opt.position.z && (obj.position.z = opt.position.z);
	}
	if (opt.rotation) {
		opt.rotation.x && (obj.rotation.x = opt.rotation.x);
		opt.rotation.y && (obj.rotation.y = opt.rotation.y);
		opt.rotation.z && (obj.rotation.z = opt.rotation.z);
	}
	if (opt.scale) {
		opt.scale.x && (obj.scale.x = opt.scale.x);
		opt.scale.y && (obj.scale.y = opt.scale.y);
		opt.scale.z && (obj.scale.z = opt.scale.z);
	}
	if (opt.material) {
		obj.material = opt.material;
	}
	return obj;
}
