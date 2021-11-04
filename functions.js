import * as THREE from "https://threejs.org/build/three.module.js";

export function getCanvasSize(fillScreen = false, defaultSize = 500) {
	return {
		w: fillScreen ? window.innerWidth : defaultSize,
		h: fillScreen ? window.innerHeight : defaultSize,
		ratio: fillScreen ? window.innerWidth / window.innerHeight : 1,
	};
}

export function getRGB(r, g, b) {
	return new THREE.Color(`rgb(${r},${g},${b})`);
}

export function xyz(x, y, z) {
	return {x: x, y: y, z: z};
}

export function cloneObject3d(
	srcModel,
	options = {position: null, rotation: null, scale: null, material: null}
) {
	const obj = srcModel.clone();
	if (options.position) {
		options.position.x && (obj.position.x = options.position.x);
		options.position.y && (obj.position.y = options.position.y);
		options.position.z && (obj.position.z = options.position.z);
	}
	if (options.rotation) {
		options.rotation.x && (obj.rotation.x = options.rotation.x);
		options.rotation.y && (obj.rotation.y = options.rotation.y);
		options.rotation.z && (obj.rotation.z = options.rotation.z);
	}
	if (options.scale) {
		options.scale.x && (obj.scale.x = options.scale.x);
		options.scale.y && (obj.scale.y = options.scale.y);
		options.scale.z && (obj.scale.z = options.scale.z);
	}
	if (options.material) {
		obj.material = options.material;
	}
	return obj;
}
