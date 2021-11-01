import {
	vec2,
} from "./math";

import {
	Key,
	MouseButton,
	Vec2,
	Cursor,
} from "./types";

type ButtonState =
	"up"
	| "pressed"
	| "rpressed"
	| "down"
	| "released"
	;

type AppOpt = {
	width?: number,
	height?: number,
	stretch?: boolean,
	scale?: number,
	crisp?: boolean,
	canvas?: HTMLCanvasElement,
	root?: HTMLElement,
	touchToMouse?: boolean,
	audioCtx?: AudioContext,
};

type AppCtx = {
	canvas: HTMLCanvasElement,
	mousePos: Vec2,
	mouseDeltaPos: Vec2,
	mouseStates: Record<string, ButtonState>,
	keyStates: Record<string, ButtonState>,
	charInputted: string[],
	isMouseMoved: boolean,
	time: number,
	dt: number,
	realTime: number,
	skipTime: boolean,
	scale: number,
	isTouch: boolean,
	loopID: number | null,
	stopped: boolean,
	fps: number,
	fpsBuf: number[],
	fpsTimer: number,
	isKeyPressed: boolean,
	isKeyPressedRepeat: boolean,
};

type App = {
	gl: WebGLRenderingContext,
	mousePos(): Vec2,
	mouseDeltaPos(): Vec2,
	isKeyDown(k?: Key): boolean,
	isKeyPressed(k?: Key): boolean,
	isKeyPressedRepeat(k?: Key): boolean,
	isKeyReleased(k?: Key): boolean,
	isMouseDown(m?: MouseButton): boolean,
	isMousePressed(m?: MouseButton): boolean,
	isMouseReleased(m?: MouseButton): boolean,
	isMouseMoved(m?: MouseButton): boolean,
	charInputted(): string[],
	cursor(c?: Cursor): Cursor,
	fullscreen(f?: boolean): void,
	isFullscreen(): boolean,
	dt(): number,
	fps(): number,
	time(): number,
	screenshot(): string,
	run(f: () => void),
	quit(),
	isFocused(): boolean,
	focus(),
	canvas: HTMLCanvasElement,
	isTouch: boolean,
	scale: number,
};

function processBtnState(s: ButtonState): ButtonState {
	if (s === "pressed" || s === "rpressed") {
		return "down";
	}
	if (s === "released") {
		return "up";
	}
	return s;
}

function enterFullscreen(el: HTMLElement) {
	if (el.requestFullscreen) el.requestFullscreen();
	// @ts-ignore
	else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
};

function exitFullscreen() {
	if (document.exitFullscreen) document.exitFullscreen();
	// @ts-ignore
	else if (document.webkitExitFullScreen) document.webkitExitFullScreen();
};

function getFullscreenElement(): Element | void {
	return document.fullscreenElement
		// @ts-ignore
		|| document.webkitFullscreenElement
		;
};

function appInit(gopt: AppOpt = {}): App {

    const root = gopt.root ?? document.body;

	if (root === document.body) {
		document.body.style["width"] = "100%";
		document.body.style["height"] = "100%";
		document.body.style["margin"] = "0px";
		document.documentElement.style["width"] = "100%";
		document.documentElement.style["height"] = "100%";
	}

	const app: AppCtx = {
		canvas: gopt.canvas ?? (() => {
			const canvas = document.createElement("canvas");
			root.appendChild(canvas);
			return canvas;
		})(),
		keyStates: {},
		charInputted: [],
		isMouseMoved: false,
		isKeyPressed: false,
		isKeyPressedRepeat: false,
		mouseStates: {},
		mousePos: vec2(0, 0),
		mouseDeltaPos: vec2(0, 0),
		time: 0,
		realTime: 0,
		skipTime: false,
		dt: 0.0,
		scale: gopt.scale ?? 1,
		isTouch: false,
		loopID: null,
		stopped: false,
		fps: 0,
		fpsBuf: [],
		fpsTimer: 0,
	};

	const keyMap = {
		"ArrowLeft": "left",
		"ArrowRight": "right",
		"ArrowUp": "up",
		"ArrowDown": "down",
		" ": "space",
	};

	const preventDefaultKeys = [
		"space",
		"left",
		"right",
		"up",
		"down",
		"tab",
		"f1",
		"f2",
		"f3",
		"f4",
		"f5",
		"f6",
		"f7",
		"f8",
		"f9",
		"f10",
		"f11",
		"s",
	];

	if (gopt.width && gopt.height && !gopt.stretch) {
		app.canvas.width = gopt.width * app.scale;
		app.canvas.height = gopt.height * app.scale;
	} else {
		app.canvas.width = app.canvas.parentElement.offsetWidth;
		app.canvas.height = app.canvas.parentElement.offsetHeight;
	}

	const styles = [
		"outline: none",
		"cursor: default",
	];

	if (gopt.crisp) {
		styles.push("image-rendering: pixelated");
		styles.push("image-rendering: crisp-edges");
	}

	// @ts-ignore
	app.canvas.style = styles.join(";");
	app.canvas.setAttribute("tabindex", "0");

	const gl = app.canvas
		.getContext("webgl", {
			antialias: true,
			depth: true,
			stencil: true,
			alpha: true,
			preserveDrawingBuffer: true,
		});

	app.isTouch = ("ontouchstart" in window) || navigator.maxTouchPoints > 0;

	app.canvas.addEventListener("mousemove", (e) => {
		if (isFullscreen()) {
			// in fullscreen mode browser adds letter box to preserve original canvas aspect ratio, but won't give us the transformed mouse position
			// TODO
			app.mousePos = vec2(e.offsetX, e.offsetY).scale(1 / app.scale);
		} else {
			app.mousePos = vec2(e.offsetX, e.offsetY).scale(1 / app.scale);
		}
		app.mouseDeltaPos = vec2(e.movementX, e.movementY).scale(1 / app.scale);
		app.isMouseMoved = true;
	});

	// according to https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
	const mouseButtons = [
		"left",
		"middle",
		"right",
		"back",
		"forward",
	];

	app.canvas.addEventListener("mousedown", (e) => {
		const m = mouseButtons[e.button];
		if (m) {
			app.mouseStates[m] = "pressed";
		}
	});

	app.canvas.addEventListener("mouseup", (e) => {
		const m = mouseButtons[e.button];
		if (m) {
			app.mouseStates[m] = "released";
		}
	});

	app.canvas.addEventListener("keydown", (e) => {

		const k = keyMap[e.key] || e.key.toLowerCase();

		if (preventDefaultKeys.includes(k)) {
			e.preventDefault();
		}

		if (k.length === 1) {
			app.charInputted.push(e.key);
		}

		if (k === "space") {
			app.charInputted.push(" ");
		}

		if (e.repeat) {
			app.isKeyPressedRepeat = true;
			app.keyStates[k] = "rpressed";
		} else {
			app.isKeyPressed = true;
			app.keyStates[k] = "pressed";
		}

	});

	app.canvas.addEventListener("keyup", (e: KeyboardEvent) => {
		const k = keyMap[e.key] || e.key.toLowerCase();
		app.keyStates[k] = "released";
	});

	app.canvas.addEventListener("touchstart", (e) => {
		if (!gopt.touchToMouse) return;
		// disable long tap context menu
		e.preventDefault();
		const t = e.touches[0];
		app.mousePos = vec2(t.clientX, t.clientY).scale(1 / app.scale);
		app.mouseStates["left"] = "pressed";
	});

	app.canvas.addEventListener("touchmove", (e) => {
		if (!gopt.touchToMouse) return;
		// disable scrolling
		e.preventDefault();
		const t = e.touches[0];
		app.mousePos = vec2(t.clientX, t.clientY).scale(1 / app.scale);
		app.isMouseMoved = true;
	});

	app.canvas.addEventListener("touchend", (e) => {
		if (!gopt.touchToMouse) return;
		app.mouseStates["left"] = "released";
	});

	app.canvas.addEventListener("touchcancel", (e) => {
		if (!gopt.touchToMouse) return;
		app.mouseStates["left"] = "released";
	});

	app.canvas.addEventListener("contextmenu", function (e) {
		e.preventDefault();
	});

	document.addEventListener("visibilitychange", () => {
		switch (document.visibilityState) {
			case "visible":
				// prevent a surge of dt() when switch back after the tab being hidden for a while
				app.skipTime = true;
				// TODO: don't resume if debug.paused
				gopt.audioCtx?.resume();
				break;
			case "hidden":
				gopt.audioCtx?.suspend();
				break;
		}
	});

	// TODO: not quite working
//  	window.addEventListener("resize", () => {
//  		if (!(gopt.width && gopt.height && !gopt.stretch)) {
//  			app.canvas.width = app.canvas.parentElement.offsetWidth;
//  			app.canvas.height = app.canvas.parentElement.offsetHeight;
//  		}
//  	});

	function mousePos(): Vec2 {
		return app.mousePos.clone();
	}

	function mouseDeltaPos(): Vec2 {
		return app.mouseDeltaPos.clone();
	}

	function isMousePressed(m = "left"): boolean {
		return app.mouseStates[m] === "pressed";
	}

	function isMouseDown(m = "left"): boolean {
		return app.mouseStates[m] === "pressed" || app.mouseStates[m] === "down";
	}

	function isMouseReleased(m = "left"): boolean {
		return app.mouseStates[m] === "released";
	}

	function isMouseMoved(): boolean {
		return app.isMouseMoved;
	}

	function isKeyPressed(k?: string): boolean {
		if (k === undefined) {
			return app.isKeyPressed;
		} else {
			return app.keyStates[k] === "pressed";
		}
	}

	function isKeyPressedRepeat(k: string): boolean {
		if (k === undefined) {
			return app.isKeyPressedRepeat;
		} else {
			return app.keyStates[k] === "pressed" || app.keyStates[k] === "rpressed";
		}
	}

	function isKeyDown(k: string): boolean {
		return app.keyStates[k] === "pressed"
			|| app.keyStates[k] === "rpressed"
			|| app.keyStates[k] === "down";
	}

	function isKeyReleased(k: string): boolean {
		return app.keyStates[k] === "released";
	}

	function charInputted(): string[] {
		return [...app.charInputted];
	}

	// get delta time between last frame
	function dt(): number {
		return app.dt;
	}

	// get current running time
	function time(): number {
		return app.time;
	}

	function fps(): number {
		return app.fps;
	}

	// get a base64 png image of canvas
	function screenshot(): string {
		return app.canvas.toDataURL();
	}

	// TODO: custom cursor
	function cursor(c?: Cursor): Cursor {
		if (c) {
			app.canvas.style.cursor = c;
		}
		return app.canvas.style.cursor;
	}

	function fullscreen(f: boolean = true) {
		if (f) {
			enterFullscreen(app.canvas);
		} else {
			exitFullscreen();
		}
	}

	function isFullscreen(): boolean {
		return Boolean(getFullscreenElement());
	}

	function run(f: () => void) {

		const frame = (t: number) => {

			if (document.visibilityState !== "visible") {
				app.loopID = requestAnimationFrame(frame);
				return;
			}

			const realTime = t / 1000;
			const realDt = realTime - app.realTime;

			app.realTime = realTime;

			if (!app.skipTime) {
				app.dt = realDt;
				app.time += app.dt;
				app.fpsBuf.push(1 / app.dt);
				app.fpsTimer += app.dt;
				if (app.fpsTimer >= 1) {
					app.fpsTimer = 0;
					app.fps = Math.round(app.fpsBuf.reduce((a, b) => a + b) / app.fpsBuf.length);
					app.fpsBuf = [];
				}
			}

			app.skipTime = false;

			f();

			for (const k in app.keyStates) {
				app.keyStates[k] = processBtnState(app.keyStates[k]);
			}

			for (const m in app.mouseStates) {
				app.mouseStates[m] = processBtnState(app.mouseStates[m]);
			}

			app.charInputted = [];
			app.isMouseMoved = false;
			app.isKeyPressed = false;
			app.isKeyPressedRepeat = false;
			app.loopID = requestAnimationFrame(frame);

		};

		app.stopped = false;
		app.loopID = requestAnimationFrame(frame);

	}

	function quit() {
		cancelAnimationFrame(app.loopID);
		app.stopped = true;
	}

	return {
		gl,
		mousePos,
		mouseDeltaPos,
		isKeyDown,
		isKeyPressed,
		isKeyPressedRepeat,
		isKeyReleased,
		isMouseDown,
		isMousePressed,
		isMouseReleased,
		isMouseMoved,
		charInputted,
		cursor,
		dt,
		time,
		fps,
		screenshot,
		run,
		quit,
		isFocused: () => document.activeElement === app.canvas,
		focus: () => app.canvas.focus(),
		canvas: app.canvas,
		isTouch: app.isTouch,
		scale: app.scale,
		fullscreen,
		isFullscreen,
	};

}

export {
	App,
	appInit,
};
