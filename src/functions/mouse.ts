import { Vec2 } from "../math"
import { appType, MouseButton, GameObj, EventController, Tag, gameType, Cursor } from "../types"
import type { MouseCtx } from "../types/mouse"

type onType = (event: string, tag: Tag, cb: (obj: GameObj, ...args: any[]) => void) => EventController

export default (app: appType, game: gameType, on: onType): MouseCtx => {
    const get = game.root.get.bind(game.root)

    function onAdd(tag: Tag | ((obj: GameObj) => void), action?: (obj: GameObj) => void) {
        if (typeof tag === "function" && action === undefined) {
            return game.ev.on("add", tag)
        } else if (typeof tag === "string") {
            return on("add", tag, action)
        }
    }

    function forAllCurrentAndFuture(t: Tag, action: (obj: GameObj) => void) {
        get(t).forEach(action)
        onAdd(t, action)
    }

    function joinEventControllers(events: EventController[]): EventController {
        return {
            get paused() {
                return events[0].paused
            },
            set paused(p) {
                events.forEach((e) => e.paused = p)
            },
            cancel: () => events.forEach((e) => e.cancel()),
        }
    }

    function mousePos(): Vec2 {
        return app.mousePos.clone()
    }

    function mouseDeltaPos(): Vec2 {
        return app.mouseDeltaPos.clone()
    }

    function isMousePressed(m: MouseButton = "left"): boolean {
        return app.mouseState.pressed.has(m)
    }

    function isMouseDown(m: MouseButton = "left"): boolean {
        return app.mouseState.down.has(m)
    }

    function isMouseReleased(m: MouseButton = "left"): boolean {
        return app.mouseState.released.has(m)
    }

    function isMouseMoved(): boolean {
        return app.isMouseMoved
    }

    // add an event that runs when objs with tag t is clicked
    function onClick(tag: Tag | (() => void), action?: (obj: GameObj) => void): EventController {
        if (typeof tag === "function") {
            return onMousePress(tag)
        } else {
            const events = []
            forAllCurrentAndFuture(tag, (obj) => {
                if (!obj.area)
                    throw new Error("onClick() requires the object to have area() component")
                events.push(obj.onClick(() => action(obj)))
            })
            return joinEventControllers(events)
        }
    }

    // add an event that runs once when objs with tag t is hovered
    function onHover(t: Tag, action: (obj: GameObj) => void): EventController {
        const events = []
        forAllCurrentAndFuture(t, (obj) => {
            if (!obj.area)
                throw new Error("onHover() requires the object to have area() component")
            events.push(obj.onHover(() => action(obj)))
        })
        return joinEventControllers(events)
    }

    // add an event that runs once when objs with tag t is hovered
    function onHoverUpdate(t: Tag, action: (obj: GameObj) => void): EventController {
        const events = []
        forAllCurrentAndFuture(t, (obj) => {
            if (!obj.area)
                throw new Error("onHoverUpdate() requires the object to have area() component")
            events.push(obj.onHoverUpdate(() => action(obj)))
        })
        return joinEventControllers(events)
    }

    // add an event that runs once when objs with tag t is unhovered
    function onHoverEnd(t: Tag, action: (obj: GameObj) => void): EventController {
        const events = []
        forAllCurrentAndFuture(t, (obj) => {
            if (!obj.area)
                throw new Error("onHoverEnd() requires the object to have area() component")
            events.push(obj.onHoverEnd(() => action(obj)))
        })
        return joinEventControllers(events)
    }

    function onMouseDown(
        mouse: MouseButton | ((m: MouseButton) => void),
        action?: (m: MouseButton) => void,
    ): EventController {
        if (typeof mouse === "function") {
            return game.ev.on("mouseDown", (m) => mouse(m))
        } else {
            return game.ev.on("mouseDown", (m) => m === mouse && action(m))
        }
    }

    function onMousePress(
        mouse: MouseButton | ((m: MouseButton) => void),
        action?: (m: MouseButton) => void,
    ): EventController {
        if (typeof mouse === "function") {
            return game.ev.on("mousePress", (m) => mouse(m))
        } else {
            return game.ev.on("mousePress", (m) => m === mouse && action(m))
        }
    }

    function onMouseRelease(
        mouse: MouseButton | ((m: MouseButton) => void),
        action?: (m: MouseButton) => void,
    ): EventController {
        if (typeof mouse === "function") {
            return game.ev.on("mouseRelease", (m) => mouse(m))
        } else {
            return game.ev.on("mouseRelease", (m) => m === mouse && action(m))
        }
    }

    function onMouseMove(f: (pos: Vec2, dpos: Vec2) => void): EventController {
        return game.ev.on("mouseMove", () => f(mousePos(), mouseDeltaPos()))
    }

	function setCursor(c?: Cursor): Cursor {
		if (c) {
			app.canvas.style.cursor = c
		}
		return app.canvas.style.cursor
	}
    return {
        get,
        onAdd, onClick, onHover,
        onHoverUpdate,
        onHoverEnd,
        onMouseDown,
        onMousePress,
        onMouseRelease,
        onMouseMove,
        mousePos,
        mouseDeltaPos,
        isMouseDown,
        isMousePressed,
        isMouseReleased,
        isMouseMoved,
		setCursor,
    }
}