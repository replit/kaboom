import {
	vec2,
} from "./math";

type ButtonState =
	"up"
	| "pressed"
	| "rpressed"
	| "down"
	| "released"
	;

type AppConf = {
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
	mouseState: ButtonState,
	keyStates: Record<string, ButtonState>,
	charInputted: string[],
	mouseMoved: boolean,
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
};

type App = {
	gl: WebGLRenderingContext,
	mousePos(): Vec2,
	mouseDeltaPos(): Vec2,
	keyDown(k: string): boolean,
	keyPressed(k: string): boolean,
	keyPressedRep(k: string): boolean,
	keyReleased(k: string): boolean,
	mouseDown(): boolean,
	mouseClicked(): boolean,
	mouseReleased(): boolean,
	mouseMoved(): boolean,
	charInputted(): string[],
	cursor(c?: Cursor): Cursor,
	fullscreen(f?: boolean): boolean,
	dt(): number,
	fps(): number,
	time(): number,
	screenshot(): string,
	run(f: () => void),
	quit(),
	focused(): boolean,
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

function appInit(gconf: AppConf = {}): App {

    const root = gconf.root ?? document.body;

	const app: AppCtx = {
		canvas: gconf.canvas ?? (() => {
			const canvas = document.createElement("canvas");
			root.appendChild(canvas);
			return canvas;
		})(),
		keyStates: {},
		charInputted: [],
		mouseMoved: false,
		mouseState: "up",
		mousePos: vec2(0, 0),
		mouseDeltaPos: vec2(0, 0),
		time: 0,
		realTime: 0,
		skipTime: false,
		dt: 0.0,
		scale: gconf.scale ?? 1,
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
	];

	if (gconf.width && gconf.height && !gconf.stretch) {
		app.canvas.width = gconf.width * app.scale;
		app.canvas.height = gconf.height * app.scale;
	} else {
		app.canvas.width = root.offsetWidth;
		app.canvas.height = root.offsetHeight;
	}

	const styles = [
		"outline: none",
		"cursor: default",
	];

	if (gconf.crisp) {
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
		app.mousePos = vec2(e.offsetX, e.offsetY).scale(1 / app.scale);
		app.mouseDeltaPos = vec2(e.movementX, e.movementY).scale(1 / app.scale);
		app.mouseMoved = true;
	});

	app.canvas.addEventListener("mousedown", () => {
		app.mouseState = "pressed";
	});

	app.canvas.addEventListener("mouseup", () => {
		app.mouseState = "released";
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
			app.keyStates[k] = "rpressed";
		} else {
			app.keyStates[k] = "pressed";
		}

	});

	app.canvas.addEventListener("keyup", (e: KeyboardEvent) => {
		const k = keyMap[e.key] || e.key.toLowerCase();
		app.keyStates[k] = "released";
	});

	app.canvas.addEventListener("touchstart", (e) => {
		if (!gconf.touchToMouse) return;
		// disable long tap context menu
		e.preventDefault();
		const t = e.touches[0];
		app.mousePos = vec2(t.clientX, t.clientY).scale(1 / app.scale);
		app.mouseState = "pressed";
	});

	app.canvas.addEventListener("touchmove", (e) => {
		if (!gconf.touchToMouse) return;
		// disable scrolling
		e.preventDefault();
		const t = e.touches[0];
		app.mousePos = vec2(t.clientX, t.clientY).scale(1 / app.scale);
		app.mouseMoved = true;
	});

	app.canvas.addEventListener("touchend", (e) => {
		if (!gconf.touchToMouse) return;
		app.mouseState = "released";
	});

	app.canvas.addEventListener("touchcancel", (e) => {
		if (!gconf.touchToMouse) return;
		app.mouseState = "released";
	});

	document.addEventListener("visibilitychange", () => {
		switch (document.visibilityState) {
			case "visible":
				// prevent a surge of dt() when switch back after the tab being hidden for a while
				app.skipTime = true;
				gconf.audioCtx?.resume();
				break;
			case "hidden":
				gconf.audioCtx?.suspend();
				break;
		}
	});

	function mousePos(): Vec2 {
		return app.mousePos.clone();
	}

	function mouseDeltaPos(): Vec2 {
		return app.mouseDeltaPos.clone();
	}

	function mouseClicked(): boolean {
		return app.mouseState === "pressed";
	}

	function mouseDown(): boolean {
		return app.mouseState === "pressed" || app.mouseState === "down";
	}

	function mouseReleased(): boolean {
		return app.mouseState === "released";
	}

	function mouseMoved(): boolean {
		return app.mouseMoved;
	}

	// TODO: check for any
	function keyPressed(k?: string): boolean {
		return app.keyStates[k] === "pressed";
	}

	function keyPressedRep(k: string): boolean {
		return app.keyStates[k] === "pressed" || app.keyStates[k] === "rpressed";
	}

	function keyDown(k: string): boolean {
		return app.keyStates[k] === "pressed"
			|| app.keyStates[k] === "rpressed"
			|| app.keyStates[k] === "down";
	}

	function keyReleased(k: string): boolean {
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

	function fullscreen(f?: boolean): boolean {
		if (document.fullscreenElement) {
			document.exitFullscreen();
		} else {
			app.canvas.requestFullscreen();
		}
		return document.fullscreenElement != null;
	}

	function run(f: () => void) {

//  		let lastWidth = app.canvas.parentElement.offsetWidth;
//  		let lastHeight = app.canvas.parentElement.offsetHeight;

		const frame = (t: number) => {

			cursor("default");

//  			if (app.canvas.parentElement.offsetWidth !== lastWidth || app.canvas.parentElement.offsetHeight !== lastHeight) {
//  				lastWidth = app.canvas.parentElement.offsetWidth;
//  				lastHeight = app.canvas.parentElement.offsetHeight;
//  				app.canvas.width = lastWidth;
//  				app.canvas.height = lastHeight;
//  			}

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

			app.mouseState = processBtnState(app.mouseState);
			app.charInputted = [];
			app.mouseMoved = false;
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
		keyDown,
		keyPressed,
		keyPressedRep,
		keyReleased,
		mouseDown,
		mouseClicked,
		mouseReleased,
		mouseMoved,
		charInputted,
		cursor,
		dt,
		time,
		fps,
		screenshot,
		run,
		quit,
		focused: () => document.activeElement === app.canvas,
		focus: () => app.canvas.focus(),
		canvas: app.canvas,
		isTouch: app.isTouch,
		scale: app.scale,
		fullscreen,
	};

}

export {
	App,
	appInit,
};
