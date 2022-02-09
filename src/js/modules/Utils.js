'use strict';
/**
 * @module Utils
 * @requires MathUtils
 */
import { constrain } from './MathUtils';
export { getWindowSize, getCanvasSize, containDocumentBody };

function getWindowSize() {
	return {
		width: window.innerWidth,
		height: window.innerHeight,
	};
}

function containDocumentBody(windowSize) {
	const w = windowSize ? windowSize : getWindowSize();
	document.body.width = w.width;
	document.body.height = w.height;
	document.body.style.width = w.width + 'px';
	document.body.style.height = w.height + 'px';
}

function getCanvasSize(appContainer, canvasFillScreen, canvasMaxCover = 1) {
	const w = getWindowSize();
	let rect;
	if (!appContainer) {
		rect = w;
	} else {
		rect = appContainer.getBoundingClientRect();
		if (rect.width != w.width || rect.height != w.height) {
			appContainer.height = w.width;
			appContainer.width = w.height;
			rect = appContainer.getBoundingClientRect();
		}
	}
	const width = constrain(
		canvasFillScreen
			? rect.width * canvasMaxCover
			: Math.min(rect.width, rect.height) * canvasMaxCover,
		100,
		w.width
	);
	const height = constrain(
		canvasFillScreen ? rect.height * canvasMaxCover : width,
		100,
		w.height
	);
	return {
		width: width,
		height: height,
		ratio: width / height,
	};
}
