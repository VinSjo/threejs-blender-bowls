'use strict';
/**
 * @module ThreeUtils
 * @requires THREE
 */

import * as THREE from 'three';

export { isV3, clampV3, randomV3 };

/**
 * Check if variable is a valid 3d vector
 *
 * @function isVector3
 * @param  {any} val  the variable to be examined
 * @return {Boolean}  returns true if:
 * variable is an object,
 * has "x", "y" and "z" properties and
 * and their values is of type "number"
 */
function isV3(val) {
	if (!val || typeof val !== 'object') return false;
	return (
		val.hasOwnProperty('x') &&
		val.hasOwnProperty('y') &&
		val.hasOwnProperty('z') &&
		typeof val.x === 'number' &&
		typeof val.y === 'number' &&
		typeof val.z === 'number'
	);
}

function clampV3(v, min = 0, max = 1) {
	if (!isV3(v)) return v;
	v.x = THREE.MathUtils.clamp(v.x, min, max) + 0.0;
	v.y = THREE.MathUtils.clamp(v.y, min, max) + 0.0;
	v.z = THREE.MathUtils.clamp(v.z, min, max) + 0.0;
	return v;
}

function randomV3(min = 0, max = 1) {
	const v = new THREE.Vector3(Math.random(), Math.random(), Math.random());
	if (min !== 0 || max !== 1) {
		v.x = THREE.MathUtils.mapLinear(v.x, 0, 1, min, max);
		v.y = THREE.MathUtils.mapLinear(v.y, 0, 1, min, max);
		v.z = THREE.MathUtils.mapLinear(v.z, 0, 1, min, max);
		return clampV3(v, min, max);
	}
	return v;
}
