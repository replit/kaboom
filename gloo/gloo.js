// web port of gloo interface

(() => {

function run(gconf) {

	const DEF_WIDTH = 640;
	const DEF_HEIGHT = 480;

	let canvas = gconf.canvas;

	if (!canvas) {
		canvas = document.createElement("canvas");
		const root = gconf.root || document.body;
		root.appendChild(canvas);
	}

	if (gconf.fullscreen) {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	} else {
		canvas.width = gconf.width || DEF_WIDTH;
		canvas.height = gconf.height || DEF_HEIGHT;
	}

	const styles = [
		"outline: none",
	];

	if (gconf.crisp) {
		styles.push("image-rendering: pixelated");
		styles.push("image-rendering: crisp-edges");
	}

	canvas.style = styles.join(";");
	canvas.setAttribute("tabindex", "0");

	const gl = canvas.getContext("webgl", gconf.glConf || {
		antialias: true,
		depth: true,
		stencil: true,
		alpha: true,
		preserveDrawingBuffer: true,
	});

	const isTouch = ("ontouchstart" in window)
		|| (navigator.maxTouchPoints > 0)
		|| (navigator.msMaxTouchPoints > 0);

	let mousePos = [0, 0];
	let mouseState = "idle";
	const keyStates = {};
	let charInputted = [];

	const keyMap = {
		"ArrowLeft": "left",
		"ArrowRight": "right",
		"ArrowUp": "up",
		"ArrowDown": "down",
		"Escape": "esc",
		" ": "space",
	};

	const preventDefaultKeys = [
		"space",
		"left",
		"right",
		"up",
		"down",
		"tab",
	];

	canvas.addEventListener("mousemove", (e) => {
		mousePos = [ e.offsetX, e.offsetY ];
	});

	canvas.addEventListener("mousedown", (e) => {
		mouseState = "pressed";
	});

	canvas.addEventListener("mouseup", (e) => {
		mouseState = "released";
	});

	canvas.addEventListener("touchstart", (e) => {
		const t = e.touches[0];
		mousePos = [ t.clientX, t.clientY ];
		mouseState = "pressed";
	});

	canvas.addEventListener("touchmove", (e) => {
		const t = e.touches[0];
		mousePos = [ t.clientX, t.clientY ];
	});

	canvas.addEventListener("keydown", (e) => {

		const k = keyMap[e.key] || e.key.toLowerCase();

		if (preventDefaultKeys.includes(k)) {
			e.preventDefault();
		}

		if (k.length === 1) {
			charInputted.push(k);
		}

		if (k === "space") {
			charInputted.push(" ");
		}

		if (e.repeat) {
			keyStates[k] = "rpressed";
		} else {
			keyStates[k] = "pressed";
		}

	});

	canvas.addEventListener("keyup", (e) => {
		const k = keyMap[e.key] || e.key.toLowerCase();
		keyStates[k] = "released";
	});

	canvas.focus();

	let skipTime = false;

	document.addEventListener("visibilitychange", (e) => {
		switch (document.visibilityState) {
			case "visible":
				skipTime = true;
	// 			audioCtx.resume();
				break;
			case "hidden":
	// 			audioCtx.suspend();
				break;
		}
	});

	const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

	let loopID = null;
	let startTime = null;
	let time = 0;
	let dt = 0;

	function processBtnState(s) {
		if (s === "pressed" || s === "rpressed") {
			return "down";
		}
		if (s === "released") {
			return "up";
		}
		return s;
	}

	function keyDown(k) {
		return keyStates[k] === "pressed"
			|| keyStates[k] === "rpressed"
			|| keyStates[k] === "down";
	}

	function mousePressed() {
		return mouseState === "pressed";
	}

	function mouseDown() {
		return mouseState === "pressed" || mouseState === "down";
	}

	function mouseReleased() {
		return mouseState === "released";
	}

	function keyPressed(k) {
		return keyStates[k] === "pressed";
	}

	function keyPressedRep(k) {
		return keyStates[k] === "pressed" || keyStates[k] === "rpressed";
	}

	function keyDown(k) {
		return keyStates[k] === "pressed"
			|| keyStates[k] === "rpressed"
			|| keyStates[k] === "down";
	}

	function keyReleased(k) {
		return keyStates[k] === "released";
	}

	const g = {
		gl,
		keyPressed,
		keyPressedRep,
		keyDown,
		keyReleased,
		mousePressed,
		mouseDown,
		mouseReleased,
		time() {
			return time;
		},
		dt() {
			return dt;
		},
		mouseX() {
			return mousePos[0];
		},
		mouseY() {
			return mousePos[1];
		},
		charInputted() {
			return charInputted;
		},
		quit() {},
	};

	if (gconf.init) {
		gconf.init(g);
	}

	function update(t) {

		if (!startTime) {
			startTime = t;
		}

		if (skipTime) {
			startTime = t - time * 1000;
			skipTime = false;
		}

		dt = (t - startTime) / 1000 - time;
		time += dt;

		if (gconf.frame) {
			gconf.frame(g);
		}

		for (const k in keyStates) {
			keyStates[k] = processBtnState(keyStates[k]);
		}

		mouseState = processBtnState(mouseState);
		charInputted = [];

		loopID = requestAnimationFrame(update);

	}

	loopID = requestAnimationFrame(update);

	return g;

}

function loadImg(src) {

	if (typeof src === "string") {

		const img = new Image();

		img.src = src;

		return new Promise((resolve, reject) => {
			img.onload = () => {
				resolve({
					domImg: img,
				});
			};
			img.onerror = () => {
				reject(`failed to load img from ${src}`);
			};
		});

	}

	return new Promise((resolve, reject) => {
		reject(`unrecognized img src ${src}`);
	});

}

window.gloo = {
	web: true,
	run,
	loadImg,
};

})();
