// everything related to canvas, game loop and input

import type {
	KaboomCtx,
	Cursor,
	Key,
	MouseButton,
	GamepadButton,
	GamepadStick,
	GamepadDef,
	KGamePad,
} from "./types"

import {
	Vec2,
} from "./math"

import {
	EventHandler,
	EventController,
} from "./utils"

import GAMEPAD_MAP from "./gamepad.json"

export class ButtonState<T = string> {
	pressed: Set<T> = new Set([])
	pressedRepeat: Set<T> = new Set([])
	released: Set<T> = new Set([])
	down: Set<T> = new Set([])
	update() {
		this.pressed.clear()
		this.released.clear()
		this.pressedRepeat.clear()
	}
	press(btn: T) {
		this.pressed.add(btn)
		this.pressedRepeat.add(btn)
		this.down.add(btn)
	}
	pressRepeat(btn: T) {
		this.pressedRepeat.add(btn)
	}
	release(btn: T) {
		this.down.delete(btn)
		this.pressed.delete(btn)
		this.released.add(btn)
	}
}

class GamepadState {
	buttonState: ButtonState<GamepadButton> = new ButtonState()
	stickState: Map<GamepadStick, Vec2> = new Map()
}

class FPSCounter {
	private dts: number[] = []
	private timer: number = 0
	fps: number = 0
	tick(dt: number) {
		this.dts.push(dt)
		this.timer += dt
		if (this.timer >= 1) {
			this.timer = 0
			this.fps = Math.round(1 / (this.dts.reduce((a, b) => a + b) / this.dts.length))
			this.dts = []
		}
	}
}

export default (opt: {
	canvas: HTMLCanvasElement,
	touchToMouse?: boolean,
	gamepads?: Record<string, GamepadDef>,
	pixelDensity?: number,
	maxFPS?: number,
}) => {

	if (!opt.canvas) {
		throw new Error("Please provide a canvas")
	}

	const state = {
		canvas: opt.canvas,
		loopID: null as null | number,
		stopped: false,
		dt: 0,
		time: 0,
		realTime: 0,
		fpsCounter: new FPSCounter(),
		timeScale: 1,
		skipTime: false,
		numFrames: 0,
		paused: false,
		mousePos: new Vec2(0),
		mouseDeltaPos: new Vec2(0),
		keyState: new ButtonState<Key>(),
		mouseState: new ButtonState<MouseButton>(),
		mergedGamepadState: new GamepadState(),
		gamepadStates: new Map<number, GamepadState>(),
		gamepads: [] as KGamePad[],
		charInputted: [],
		isMouseMoved: false,
		lastWidth: opt.canvas.offsetWidth,
		lastHeight: opt.canvas.offsetHeight,
		events: new EventHandler<{
			mouseMove: [],
			mouseDown: [MouseButton],
			mousePress: [MouseButton],
			mouseRelease: [MouseButton],
			charInput: [string],
			keyPress: [Key],
			keyDown: [Key],
			keyPressRepeat: [Key],
			keyRelease: [Key],
			touchStart: [Vec2, Touch],
			touchMove: [Vec2, Touch],
			touchEnd: [Vec2, Touch],
			gamepadButtonDown: [string],
			gamepadButtonPress: [string],
			gamepadButtonRelease: [string],
			gamepadStick: [string, Vec2],
			gamepadConnect: [KGamePad],
			gamepadDisconnect: [KGamePad],
			scroll: [Vec2],
			resize: [],
			input: [],
		}>(),
	}

	function canvas() {
		return state.canvas
	}

	function dt() {
		return state.dt * state.timeScale
	}

	function time() {
		return state.time
	}

	function fps() {
		return state.fpsCounter.fps
	}

	function numFrames() {
		return state.numFrames
	}

	function screenshot(): string {
		return state.canvas.toDataURL()
	}

	function setCursor(c: Cursor): void {
		state.canvas.style.cursor = c
	}

	function getCursor(): Cursor {
		return state.canvas.style.cursor
	}

	function setCursorLocked(b: boolean): void {
		if (b) {
			try {
				const res = state.canvas.requestPointerLock() as unknown as Promise<void>
				if (res.catch) {
					res.catch((e) => console.error(e))
				}
			} catch (e) {
				console.error(e)
			}
		} else {
			document.exitPointerLock()
		}
	}

	function isCursorLocked(): boolean {
		return !!document.pointerLockElement
	}

	// wrappers around full screen functions to work across browsers
	function enterFullscreen(el: HTMLElement) {
		if (el.requestFullscreen) el.requestFullscreen()
		// @ts-ignore
		else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen()
	}

	function exitFullscreen() {
		if (document.exitFullscreen) document.exitFullscreen()
		// @ts-ignore
		else if (document.webkitExitFullScreen) document.webkitExitFullScreen()
	}

	function getFullscreenElement(): Element | void {
		return document.fullscreenElement
			// @ts-ignore
			|| document.webkitFullscreenElement
	}

	function setFullscreen(f: boolean = true) {
		if (f) {
			enterFullscreen(state.canvas)
		} else {
			exitFullscreen()
		}
	}

	function isFullscreen(): boolean {
		return Boolean(getFullscreenElement())
	}

	function quit() {
		state.stopped = true
		for (const name in canvasEvents) {
			state.canvas.removeEventListener(name, canvasEvents[name])
		}
		for (const name in docEvents) {
			document.removeEventListener(name, docEvents[name])
		}
		for (const name in winEvents) {
			window.removeEventListener(name, winEvents[name])
		}
		resizeObserver.disconnect()
	}

	function run(action: () => void) {

		if (state.loopID !== null) {
			cancelAnimationFrame(state.loopID)
		}

		let accumulatedDt = 0

		const frame = (t: number) => {

			if (state.stopped) return

			// TODO: paused should still process input
			// TODO: allow background actions?
			if (state.paused || document.visibilityState !== "visible") {
				state.loopID = requestAnimationFrame(frame)
				return
			}

			const loopTime = t / 1000
			const realDt = loopTime - state.realTime
			const desiredDt = opt.maxFPS ? 1 / opt.maxFPS : 0

			state.realTime = loopTime
			accumulatedDt += realDt

			if (accumulatedDt > desiredDt) {
				if (!state.skipTime) {
					state.dt = accumulatedDt
					state.time += dt()
					state.fpsCounter.tick(state.dt)
				}
				accumulatedDt = 0
				state.skipTime = false
				state.numFrames++
				processInput()
				action()
				resetInput()
			}

			state.loopID = requestAnimationFrame(frame)

		}

		frame(0)

	}

	function isTouchscreen() {
		return ("ontouchstart" in window) || navigator.maxTouchPoints > 0
	}

	function mousePos(): Vec2 {
		return state.mousePos.clone()
	}

	function mouseDeltaPos(): Vec2 {
		return state.mouseDeltaPos.clone()
	}

	function isMousePressed(m: MouseButton = "left"): boolean {
		return state.mouseState.pressed.has(m)
	}

	function isMouseDown(m: MouseButton = "left"): boolean {
		return state.mouseState.down.has(m)
	}

	function isMouseReleased(m: MouseButton = "left"): boolean {
		return state.mouseState.released.has(m)
	}

	function isMouseMoved(): boolean {
		return state.isMouseMoved
	}

	function isKeyPressed(k?: Key): boolean {
		return k === undefined
			? state.keyState.pressed.size > 0
			: state.keyState.pressed.has(k)
	}

	function isKeyPressedRepeat(k?: Key): boolean {
		return k === undefined
			? state.keyState.pressedRepeat.size > 0
			: state.keyState.pressedRepeat.has(k)
	}

	function isKeyDown(k?: Key): boolean {
		return k === undefined
			? state.keyState.down.size > 0
			: state.keyState.down.has(k)
	}

	function isKeyReleased(k?: Key): boolean {
		return k === undefined
			? state.keyState.released.size > 0
			: state.keyState.released.has(k)
	}

	function isGamepadButtonPressed(btn?: GamepadButton): boolean {
		return btn === undefined
			? state.mergedGamepadState.buttonState.pressed.size > 0
			: state.mergedGamepadState.buttonState.pressed.has(btn)
	}

	function isGamepadButtonDown(btn?: GamepadButton): boolean {
		return btn === undefined
			? state.mergedGamepadState.buttonState.down.size > 0
			: state.mergedGamepadState.buttonState.down.has(btn)
	}

	function isGamepadButtonReleased(btn?: GamepadButton): boolean {
		return btn === undefined
			? state.mergedGamepadState.buttonState.released.size > 0
			: state.mergedGamepadState.buttonState.released.has(btn)
	}

	function onResize(action: () => void): EventController {
		return state.events.on("resize", action)
	}

	// input callbacks
	const onKeyDown = ((key, action) => {
		if (typeof key === "function") {
			return state.events.on("keyDown", key)
		} else if (typeof key === "string" && typeof action === "function") {
			return state.events.on("keyDown", (k) => k === key && action(key))
		}
	}) as KaboomCtx["onKeyDown"]

	const onKeyPress = ((key, action) => {
		if (typeof key === "function") {
			return state.events.on("keyPress", key)
		} else if (typeof key === "string" && typeof action === "function") {
			return state.events.on("keyPress", (k) => k === key && action(key))
		}
	}) as KaboomCtx["onKeyPress"]

	const onKeyPressRepeat = ((key, action) => {
		if (typeof key === "function") {
			return state.events.on("keyPressRepeat", key)
		} else if (typeof key === "string" && typeof action === "function") {
			return state.events.on("keyPressRepeat", (k) => k === key && action(key))
		}
	}) as KaboomCtx["onKeyPressRepeat"]

	const onKeyRelease = ((key, action) => {
		if (typeof key === "function") {
			return state.events.on("keyRelease", key)
		} else if (typeof key === "string" && typeof action === "function") {
			return state.events.on("keyRelease", (k) => k === key && action(key))
		}
	}) as KaboomCtx["onKeyRelease"]

	function onMouseDown(
		mouse: MouseButton | ((m: MouseButton) => void),
		action?: (m: MouseButton) => void,
	): EventController {
		if (typeof mouse === "function") {
			return state.events.on("mouseDown", (m) => mouse(m))
		} else {
			return state.events.on("mouseDown", (m) => m === mouse && action(m))
		}
	}

	function onMousePress(
		mouse: MouseButton | ((m: MouseButton) => void),
		action?: (m: MouseButton) => void,
	): EventController {
		if (typeof mouse === "function") {
			return state.events.on("mousePress", (m) => mouse(m))
		} else {
			return state.events.on("mousePress", (m) => m === mouse && action(m))
		}
	}

	function onMouseRelease(
		mouse: MouseButton | ((m: MouseButton) => void),
		action?: (m: MouseButton) => void,
	): EventController {
		if (typeof mouse === "function") {
			return state.events.on("mouseRelease", (m) => mouse(m))
		} else {
			return state.events.on("mouseRelease", (m) => m === mouse && action(m))
		}
	}

	function onMouseMove(f: (pos: Vec2, dpos: Vec2) => void): EventController {
		return state.events.on("mouseMove", () => f(mousePos(), mouseDeltaPos()))
	}

	function onCharInput(action: (ch: string) => void): EventController {
		return state.events.on("charInput", action)
	}

	function onTouchStart(f: (pos: Vec2, t: Touch) => void): EventController {
		return state.events.on("touchStart", f)
	}

	function onTouchMove(f: (pos: Vec2, t: Touch) => void): EventController {
		return state.events.on("touchMove", f)
	}

	function onTouchEnd(f: (pos: Vec2, t: Touch) => void): EventController {
		return state.events.on("touchEnd", f)
	}

	function onScroll(action: (delta: Vec2) => void): EventController {
		return state.events.on("scroll", action)
	}

	function onGamepadButtonDown(btn: GamepadButton | ((btn: GamepadButton) => void), action?: (btn: GamepadButton) => void): EventController {
		if (typeof btn === "function") {
			return state.events.on("gamepadButtonDown", btn)
		} else if (typeof btn === "string" && typeof action === "function") {
			return state.events.on("gamepadButtonDown", (b) => b === btn && action(btn))
		}
	}

	function onGamepadButtonPress(btn: GamepadButton | ((btn: GamepadButton) => void), action?: (btn: GamepadButton) => void): EventController {
		if (typeof btn === "function") {
			return state.events.on("gamepadButtonPress", btn)
		} else if (typeof btn === "string" && typeof action === "function") {
			return state.events.on("gamepadButtonPress", (b) => b === btn && action(btn))
		}
	}

	function onGamepadButtonRelease(btn: GamepadButton | ((btn: GamepadButton) => void), action?: (btn: GamepadButton) => void): EventController {
		if (typeof btn === "function") {
			return state.events.on("gamepadButtonRelease", btn)
		} else if (typeof btn === "string" && typeof action === "function") {
			return state.events.on("gamepadButtonRelease", (b) => b === btn && action(btn))
		}
	}

	function onGamepadStick(stick: GamepadStick, action: (value: Vec2) => void): EventController {
		return state.events.on("gamepadStick", ((a: string, v: Vec2) => a === stick && action(v)))
	}

	function onGamepadConnect(action: (gamepad: KGamePad) => void) {
		state.events.on("gamepadConnect", action)
	}

	function onGamepadDisconnect(action: (gamepad: KGamePad) => void) {
		state.events.on("gamepadDisconnect", action)
	}

	function getGamepadStick(stick: GamepadStick): Vec2 {
		return state.mergedGamepadState.stickState.get(stick) || new Vec2(0)
	}

	function charInputted(): string[] {
		return [...state.charInputted]
	}

	function getGamepads(): KGamePad[] {
		return [...state.gamepads]
	}

	function processInput() {
		state.events.trigger("input")
		state.keyState.down.forEach((k) => state.events.trigger("keyDown", k))
		state.mouseState.down.forEach((k) => state.events.trigger("mouseDown", k))
		processGamepad()
	}

	function resetInput() {
		state.keyState.update()
		state.mouseState.update()
		state.mergedGamepadState.buttonState.update()
		state.mergedGamepadState.stickState.forEach((v, k) => {
			state.mergedGamepadState.stickState.set(k, new Vec2(0))
		})
		state.charInputted = []
		state.isMouseMoved = false

		state.gamepadStates.forEach((s) => {
			s.buttonState.update()
			s.stickState.forEach((v, k) => {
				s.stickState.set(k, new Vec2(0))
			})
		})
	}

	function registerGamepad(browserGamepad: Gamepad) {

		const gamepad = {
			index: browserGamepad.index,
			isPressed: (btn: GamepadButton) => {
				return state.gamepadStates.get(browserGamepad.index).buttonState.pressed.has(btn)
			},
			isDown: (btn: GamepadButton) => {
				return state.gamepadStates.get(browserGamepad.index).buttonState.down.has(btn)
			},
			isReleased: (btn: GamepadButton) => {
				return state.gamepadStates.get(browserGamepad.index).buttonState.released.has(btn)
			},
			getStick: (stick: GamepadStick) => {
				return state.gamepadStates.get(browserGamepad.index).stickState.get(stick)
			},
		}

		state.gamepads.push(gamepad)

		state.gamepadStates.set(browserGamepad.index, {
			buttonState: new ButtonState(),
			stickState: new Map([
				["left", new Vec2(0)],
				["right", new Vec2(0)],
			]),
		})

		return gamepad

	}

	function removeGamepad(gamepad: Gamepad) {
		state.gamepads = state.gamepads.filter((g) => g.index !== gamepad.index)
		state.gamepadStates.delete(gamepad.index)
	}

	function processGamepad() {

		for (const browserGamepad of navigator.getGamepads()) {
			if (browserGamepad && !state.gamepadStates.has(browserGamepad.index)) {
				registerGamepad(browserGamepad)
			}
		}

		for (const gamepad of state.gamepads) {

			const browserGamepad = navigator.getGamepads()[gamepad.index]
			const customMap = opt.gamepads ?? {}
			const map = customMap[browserGamepad.id] ?? GAMEPAD_MAP[browserGamepad.id] ?? GAMEPAD_MAP["default"]
			const gamepadState = state.gamepadStates.get(gamepad.index)

			for (let i = 0; i < browserGamepad.buttons.length; i++) {
				if (browserGamepad.buttons[i].pressed) {
					if (!gamepadState.buttonState.down.has(map.buttons[i])) {
						state.mergedGamepadState.buttonState.press(map.buttons[i])
						gamepadState.buttonState.press(map.buttons[i])
						state.events.trigger("gamepadButtonPress", map.buttons[i])
					}
					state.events.trigger("gamepadButtonDown", map.buttons[i])
				} else {
					if (gamepadState.buttonState.down.has(map.buttons[i])) {
						state.mergedGamepadState.buttonState.release(map.buttons[i])
						gamepadState.buttonState.release(map.buttons[i])
						state.events.trigger("gamepadButtonRelease", map.buttons[i])
					}
				}
			}

			for (const stickName in map.sticks) {
				const stick = map.sticks[stickName]
				const value = new Vec2(
					browserGamepad.axes[stick.x],
					browserGamepad.axes[stick.y],
				)
				gamepadState.stickState.set(stickName as GamepadStick, value)
				state.mergedGamepadState.stickState.set(stickName as GamepadStick, value)
				state.events.trigger("gamepadStick", stickName, value)
			}

		}

	}

	type EventList<M> = {
		[event in keyof M]?: (event: M[event]) => void
	}

	const canvasEvents: EventList<HTMLElementEventMap> = {}
	const docEvents: EventList<DocumentEventMap> = {}
	const winEvents: EventList<WindowEventMap> = {}

	canvasEvents.mousemove = (e) => {
		const mousePos = new Vec2(e.offsetX, e.offsetY)
		const mouseDeltaPos = new Vec2(e.movementX, e.movementY)
		state.events.onOnce("input", () => {
			state.isMouseMoved = true
			state.mousePos = mousePos
			state.mouseDeltaPos = mouseDeltaPos
			state.events.trigger("mouseMove")
		})
	}

	const MOUSE_BUTTONS: MouseButton[] = [
		"left",
		"middle",
		"right",
		"back",
		"forward",
	]

	canvasEvents.mousedown = (e) => {
		state.events.onOnce("input", () => {
			const m = MOUSE_BUTTONS[e.button]
			if (!m) return
			state.mouseState.press(m)
			state.events.trigger("mousePress", m)
		})
	}

	canvasEvents.mouseup = (e) => {
		state.events.onOnce("input", () => {
			const m = MOUSE_BUTTONS[e.button]
			if (!m) return
			state.mouseState.release(m)
			state.events.trigger("mouseRelease", m)
		})
	}

	const PREVENT_DEFAULT_KEYS = new Set([
		" ",
		"ArrowLeft",
		"ArrowRight",
		"ArrowUp",
		"ArrowDown",
		"Tab",
	])

	// translate these key names to a simpler version
	const KEY_ALIAS = {
		"ArrowLeft": "left",
		"ArrowRight": "right",
		"ArrowUp": "up",
		"ArrowDown": "down",
		" ": "space",
	}

	canvasEvents.keydown = (e) => {
		if (PREVENT_DEFAULT_KEYS.has(e.key)) {
			e.preventDefault()
		}
		state.events.onOnce("input", () => {
			const k = KEY_ALIAS[e.key] || e.key.toLowerCase()
			if (k.length === 1) {
				state.events.trigger("charInput", k)
				state.charInputted.push(k)
			} else if (k === "space") {
				state.events.trigger("charInput", " ")
				state.charInputted.push(" ")
			}
			if (e.repeat) {
				state.keyState.pressRepeat(k)
				state.events.trigger("keyPressRepeat", k)
			} else {
				state.keyState.press(k)
				state.events.trigger("keyPressRepeat", k)
				state.events.trigger("keyPress", k)
			}
		})
	}

	canvasEvents.keyup = (e) => {
		state.events.onOnce("input", () => {
			const k = KEY_ALIAS[e.key] || e.key.toLowerCase()
			state.keyState.release(k)
			state.events.trigger("keyRelease", k)
		})
	}

	canvasEvents.touchstart = (e) => {
		// disable long tap context menu
		e.preventDefault()
		state.events.onOnce("input", () => {
			const touches = [...e.changedTouches]
			touches.forEach((t) => {
				state.events.trigger(
					"touchStart",
					new Vec2(t.clientX, t.clientY),
					t,
				)
			})
			if (opt.touchToMouse !== false) {
				state.mousePos = new Vec2(touches[0].clientX, touches[0].clientY)
				state.mouseState.press("left")
				state.events.trigger("mousePress", "left")
			}
		})
	}

	canvasEvents.touchmove = (e) => {
		// disable scrolling
		e.preventDefault()
		state.events.onOnce("input", () => {
			const touches = [...e.changedTouches]
			touches.forEach((t) => {
				state.events.trigger("touchMove", new Vec2(t.clientX, t.clientY), t)
			})
			if (opt.touchToMouse !== false) {
				state.mousePos = new Vec2(touches[0].clientX, touches[0].clientY)
				state.events.trigger("mouseMove")
			}
		})
	}

	canvasEvents.touchend = (e) => {
		state.events.onOnce("input", () => {
			const touches = [...e.changedTouches]
			touches.forEach((t) => {
				state.events.trigger("touchEnd", new Vec2(t.clientX, t.clientY), t)
			})
			if (opt.touchToMouse !== false) {
				state.mousePos = new Vec2(touches[0].clientX, touches[0].clientY)
				state.mouseState.release("left")
				state.events.trigger("mouseRelease", "left")
			}
		})
	}

	canvasEvents.touchcancel = (e) => {
		state.events.onOnce("input", () => {
			const touches = [...e.changedTouches]
			touches.forEach((t) => {
				state.events.trigger("touchEnd", new Vec2(t.clientX, t.clientY), t)
			})
			if (opt.touchToMouse !== false) {
				state.mousePos = new Vec2(touches[0].clientX, touches[0].clientY)
				state.mouseState.release("left")
				state.events.trigger("mouseRelease", "left")
			}
		})
	}

	// TODO: option to not prevent default?
	canvasEvents.wheel = (e) => {
		e.preventDefault()
		state.events.onOnce("input", () => {
			state.events.trigger("scroll", new Vec2(e.deltaX, e.deltaY))
		})
	}

	canvasEvents.contextmenu = (e) => e.preventDefault()

	docEvents.visibilitychange = () => {
		if (document.visibilityState === "visible") {
			// prevent a surge of dt when switch back after the tab being hidden for a while
			state.skipTime = true
		}
	}

	winEvents.gamepadconnected = (e) => {
		const kbGamepad = registerGamepad(e.gamepad)
		state.events.onOnce("input", () => {
			state.events.trigger("gamepadConnect", kbGamepad)
		})
	}

	winEvents.gamepaddisconnected = (e) => {
		const kbGamepad = getGamepads().filter((g) => g.index === e.gamepad.index)[0]
		removeGamepad(e.gamepad)
		state.events.onOnce("input", () => {
			state.events.trigger("gamepadDisconnect", kbGamepad)
		})
	}

	for (const name in canvasEvents) {
		state.canvas.addEventListener(name, canvasEvents[name])
	}

	for (const name in docEvents) {
		document.addEventListener(name, docEvents[name])
	}

	for (const name in winEvents) {
		window.addEventListener(name, winEvents[name])
	}

	const resizeObserver = new ResizeObserver((entries) => {
		for (const entry of entries) {
			if (entry.target !== state.canvas) continue
			if (
				state.lastWidth === state.canvas.offsetWidth
				&& state.lastHeight === state.canvas.offsetHeight
			) return
			state.lastWidth = state.canvas.offsetWidth
			state.lastHeight = state.canvas.offsetHeight
			state.events.onOnce("input", () => {
				state.events.trigger("resize")
			})
		}
	})

	resizeObserver.observe(state.canvas)

	return {
		dt,
		time,
		run,
		canvas,
		fps,
		numFrames,
		quit,
		setFullscreen,
		isFullscreen,
		setCursor,
		screenshot,
		getGamepads,
		getCursor,
		setCursorLocked,
		isCursorLocked,
		isTouchscreen,
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
		isGamepadButtonPressed,
		isGamepadButtonDown,
		isGamepadButtonReleased,
		getGamepadStick,
		charInputted,
		onResize,
		onKeyDown,
		onKeyPress,
		onKeyPressRepeat,
		onKeyRelease,
		onMouseDown,
		onMousePress,
		onMouseRelease,
		onMouseMove,
		onCharInput,
		onTouchStart,
		onTouchMove,
		onTouchEnd,
		onScroll,
		onGamepadButtonDown,
		onGamepadButtonPress,
		onGamepadButtonRelease,
		onGamepadStick,
		onGamepadConnect,
		onGamepadDisconnect,
		events: state.events,
		get paused() {
			return state.paused
		},
		set paused(p: boolean) {
			state.paused = p
		},
	}

}
