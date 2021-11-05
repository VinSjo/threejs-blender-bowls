"use strict";
/**
 * @module MathUtils
 */
export {
	isNum,
	isInt,
	isFloat,
	roundFloat,
	constrain,
	normalize,
	map,
	segmentMap,
	euclideanModulo,
	parabola,
	cubicBezier,
};

/**
 * Determine if a value is a number
 *
 * @function isNum
 * @param  {Number} value  value to be examined
 * @return {Boolean}       true if value is of type "number"
 */
function isNum(value) {
	return typeof value === "number";
}

/**
 * Determine if a variables value is an integer
 *
 * @function isInt
 * @param  {Number} value  value to be examined
 * @return {Boolean}       true if value is of type "number" and an integer
 */
function isInt(value) {
	return typeof value === "number" && value % 1 === 0;
}

/**
 * Determine if a variables value is a float
 *
 * @function isFloat
 * @param  {Number} value  value to be examined
 * @return {Boolean}       true if value is of type "number" and a float
 */
function isFloat(value) {
	return typeof value === "number" && value % 1 === 0;
}

/**
 * Round a number while preserving a specified precision
 *
 * @function roundFloat
 * @param  {Number} n             incoming number to be rounded
 * @param  {Number} [precision]  number of decimal digits to round to, default is 1
 * @return {Number}               rounded float value
 */
function roundFloat(n, precision = 1) {
	if (typeof n !== "number" || typeof precision !== "number") return n;
	if (!n || !precision) return n;
	const m = 10 ** precision;
	return Math.round(n * m) / m;
}

/**
 * Constrain a value between a minimum and maximum value
 * Math.constrain-method by p5.js:
 * https://github.com/processing/p5.js/blob/v1.4.0/src/math/calculation.js#L72
 *
 * @function clamp
 * @param  {Number} n     number to constrain
 * @param  {Number} low   minimum limit
 * @param  {Number} high  maximum limit
 * @return {Number}       constrained number
 */
function constrain(n, low, high) {
	if (
		typeof n !== "number" ||
		typeof low !== "number" ||
		typeof high !== "number"
	) {
		return n;
	}
	return Math.max(Math.min(n, high), low);
}

/**
 * Normalize a value
 *
 * @function normalize
 * @param  {Number} n     the incoming value to normalize
 * @param  {Number} low   minimum limit of incoming value
 * @param  {Number} high  maximum limit of incoming value
 * @return {Number}       float value between 0 and 1
 */
function normalize(n, low, high) {
	return map(n, low, high, 0, 1, true);
}

/**
 * Re-maps a number from one range to another.
 * Based on p5.js Math.map-method: https://github.com/processing/p5.js/blob/v1.4.0/src/math/calculation.js#L72
 *
 * @function map
 * @param  {Number} n              the incoming value to be converted
 * @param  {Number} start1         lower bound of the value's current range
 * @param  {Number} stop1          upper bound of the value's current range
 * @param  {Number} start2         lower bound of the value's target range
 * @param  {Number} stop2          upper bound of the value's target range
 * @param  {Boolean} [constrainValue]  constrain the value to the newly mapped range
 * @return {Number}                remapped number
 */
function map(n, start1, stop1, start2, stop2, constrainValue = true) {
	if (
		typeof n !== "number" ||
		typeof start1 !== "number" ||
		typeof start2 !== "number" ||
		typeof stop1 !== "number" ||
		typeof stop2 !== "number"
	) {
		return n;
	}
	const val = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
	const min = Math.min(start2, stop2);
	const max = Math.max(start2, stop2);
	if (!constrainValue || (val >= min && val <= max)) {
		return val;
	}
	return constrain(val, min, max);
}

/**
 * Segment a range into N segments and return which segment a number belongs to * withing that range
 *
 * @function segmentMap
 * @param  {Number} n         value which the segment position is calculated
 * @param  {Number} segments  amount of segments
 * @param  {Number} low       lowest value in range
 * @param  {Number} high      highest value in range
 * @return {Number}           returns an integer between 0 and the amount of segments -1
 *
 */
function segmentMap(n, segments, low, high) {
	if (
		typeof n !== "number" ||
		typeof segments !== "number" ||
		typeof low !== "number" ||
		typeof high !== "number"
	) {
		return n;
	}
	return euclideanModulo(
		Math.floor(map(n, low, high, 0, segments, true)),
		segments
	);
}

/**
 * Based on MathUtils.euclideanModulo function from threejs:
 * https://github.com/mrdoob/three.js/blob/master/src/math/MathUtils.js#L49
 *
 * compute euclidian modulo of m % n
 * https://en.wikipedia.org/wiki/Modulo_operation
 *
 * @function euclideanModulo
 * @param  {Number} n  number to be calculated
 * @param  {Number} m  maximum value to be returned
 * @return {Number}    a number between min and the max
 */
function euclideanModulo(n, max) {
	if (typeof n !== "number" || typeof max !== "number") return n;
	return ((n % max) + max) % max;
}

/**
 * Get Y-value on a parabola at a given X-value
 *
 * @function parabola
 * @param  {Number} x     incoming value of x, between 0 and 1
 * @param  {Number} tMin  minimum value of t, used with x and tMax to get a normalized t-value.
 * @param  {Number} tMax  maximum value of t, used with x and tMin to get a normalized t-value.
 * @return {Number}       Y value at the normalized value of X, between tMin and tMax
 */
function parabola(x) {
	if (typeof x !== "number") return x;
	const h = 0.5,
		a = -4;
	return a * Math.pow(x - h, 2) + 1;
}

/**
 * Get Y-value on a cubic bezier-curve at a given X-value
 *
 * @function cubicBezier
 * @param  {Number} x     incoming value of x, between 0 and 1
 * @param  {Number} tMin  minimum value of t, used with x and tMax to get a normalized t-value.
 * @param  {Number} tMax  maximum value of t, used with x and tMin to get a normalized t-value.
 * @param  {Number} y1    Y-value of first control-point in curve
 * @param  {Number} y2    Y-value of second control-point in curve
 * @param  {Number} y3    Y-value of third control-point in curve
 * @param  {Number} y4    Y-value of fourth controlpoint in curve
 * @return {Number}       Y value at the normalized value of X
 */
function cubicBezier(x, y1, y2, y3, y4) {
	if (
		typeof x !== "number" ||
		typeof y1 !== "number" ||
		typeof y2 !== "number" ||
		typeof y3 !== "number" ||
		typeof y4 !== "number"
	) {
		return x;
	}
	const t = x;
	const y =
		Math.pow(1 - t, 3) * y1 +
		3 * Math.pow(1 - t, 2) * t * y2 +
		3 * (1 - t) * Math.pow(t, 2) * y3 +
		Math.pow(t, 3) * y4;
	return y;
}
