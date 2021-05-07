import {
	vec2,
} from "./math";

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

	const app: AppCtx = {
		canvas: gconf.canvas ?? (() => {
			const canvas = document.createElement("canvas");
			(gconf.root ?? document.body).appendChild(canvas);
			return canvas;
		})(),
		keyStates: {},
		charInputted: [],
		mouseState: "up",
		mousePos: vec2(0, 0),
		time: 0,
		realTime: 0,
		skipTime: false,
		dt: 0.0,
		scale: gconf.scale ?? 1,
		isTouch: false,
		loopID: null,
		stopped: false,
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

	if (gconf.fullscreen) {
		app.canvas.width = window.innerWidth;
		app.canvas.height = window.innerHeight;
	} else {
		app.canvas.width = (gconf.width || 640) * app.scale;
		app.canvas.height = (gconf.height || 480) * app.scale;
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

	app.isTouch = ("ontouchstart" in window) ||
		(navigator.maxTouchPoints > 0) ||
		(navigator.msMaxTouchPoints > 0);

	app.canvas.addEventListener("contextmenu", (e) => {
		e.preventDefault();
	});

	app.canvas.addEventListener("mousemove", (e) => {
		app.mousePos = vec2(e.offsetX, e.offsetY).scale(1 / app.scale);
	});

	app.canvas.addEventListener("mousedown", () => {
		app.mouseState = "pressed";
	});

	app.canvas.addEventListener("mouseup", () => {
		app.mouseState = "released";
	});

	app.canvas.addEventListener("touchstart", (e) => {
		const t = e.touches[0];
		app.mousePos = vec2(t.clientX, t.clientY).scale(1 / app.scale);
		app.mouseState = "pressed";
	});

	app.canvas.addEventListener("touchmove", (e) => {
		const t = e.touches[0];
		app.mousePos = vec2(t.clientX, t.clientY).scale(1 / app.scale);
	});

	app.canvas.addEventListener("keydown", (e) => {

		const k = keyMap[e.key] || e.key.toLowerCase();

		if (preventDefaultKeys.includes(k)) {
			e.preventDefault();
		}

		if (k.length === 1) {
			app.charInputted.push(k);
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

	app.canvas.focus();

	document.addEventListener("visibilitychange", () => {
		switch (document.visibilityState) {
			case "visible":
				// prevent a surge of dt() when switch back after the tab being hidden for a while
				app.skipTime = true;
//  				audio.ctx().resume();
				break;
			case "hidden":
//  				audio.ctx().suspend();
				break;
		}
	});

	function mousePos(): Vec2 {
		return app.mousePos.clone();
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

	function keyPressed(k: string): boolean {
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

	// get a base64 png image of canvas
	function screenshot(): string {
		return app.canvas.toDataURL();
	}

	function cursor(c: string) {
		if (c) {
			app.canvas.style.cursor = c ?? "default";
		}
		return app.canvas.style.cursor;
	}

	function run(f: () => void) {

		const frame = (t: number) => {

			const realTime = t / 1000;
			const realDt = realTime - app.realTime;

			app.realTime = realTime;

			if (!app.skipTime) {
				app.dt = realDt;
				app.time += app.dt;
			}

			app.skipTime = false;

			f();

			for (const k in app.keyStates) {
				app.keyStates[k] = processBtnState(app.keyStates[k]);
			}

			app.mouseState = processBtnState(app.mouseState);
			app.charInputted = [];

			if (!app.stopped) {
				app.loopID = requestAnimationFrame(frame);
			}

		};

		app.loopID = requestAnimationFrame(frame);

	}

	function quit() {
		cancelAnimationFrame(app.loopID);
		app.stopped = true;
	}

	return {
		gl,
		mousePos,
		keyDown,
		keyPressed,
		keyPressedRep,
		keyReleased,
		mouseDown,
		mouseClicked,
		mouseReleased,
		charInputted,
		cursor,
		dt,
		time,
		screenshot,
		run,
		quit,
	};

}

export {
	appInit,
};
