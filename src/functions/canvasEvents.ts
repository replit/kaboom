import { Vec2 } from "../math"
import { EventList, gfxType, appType, gameType } from "../types"
import { MOUSE_BUTTONS, PREVENT_DEFAULT_KEYS, KEY_ALIAS } from "../constants"

export default (game: gameType, app: appType, gfx: gfxType, gopt): EventList<HTMLElementEventMap> => {

    const canvasEvents: EventList<HTMLElementEventMap> = {}

	function width() {
        return gfx.width
    }

	function height() {
        return gfx.height
    }

	// transform a point from window space to content space
	function windowToContent(pt: Vec2) {
		return new Vec2(
			(pt.x - gfx.viewport.x) * width() / gfx.viewport.width,
			(pt.y - gfx.viewport.y) * height() / gfx.viewport.height,
		)
	}

    // set game mouse pos from window mouse pos
    function setMousePos(x: number, y: number) {
        const mpos = windowToContent(new Vec2(x, y))
        if (app.mouseStarted) {
            app.mouseDeltaPos = mpos.sub(app.mousePos)
        }
        app.mousePos = mpos
        app.mouseStarted = true
        app.isMouseMoved = true
    }

    canvasEvents.mousemove = (e) => {
        game.ev.onOnce("input", () => {
            setMousePos(e.offsetX, e.offsetY)
            game.ev.trigger("mouseMove")
        })
    }

    canvasEvents.mousedown = (e) => {
        game.ev.onOnce("input", () => {
            const m = MOUSE_BUTTONS[e.button]
            if (m) app.mouseState.press(m)
            game.ev.trigger("mousePress", m)
        })
    }

    canvasEvents.mouseup = (e) => {
        game.ev.onOnce("input", () => {
            const m = MOUSE_BUTTONS[e.button]
            if (m) app.mouseState.release(m)
            game.ev.trigger("mouseRelease", m)
        })
    }

    canvasEvents.keydown = (e) => {
        if (PREVENT_DEFAULT_KEYS.has(e.key)) {
            e.preventDefault()
        }
        game.ev.onOnce("input", () => {
            const k = KEY_ALIAS[e.key] || e.key.toLowerCase()
            if (k.length === 1) {
                game.ev.trigger("charInput", k)
                app.charInputted.push(k)
            } else if (k === "space") {
                game.ev.trigger("charInput", " ")
                app.charInputted.push(" ")
            }
            if (e.repeat) {
                app.keyState.pressRepeat(k)
                game.ev.trigger("keyPressRepeat", k)
            } else {
                app.keyState.press(k)
                game.ev.trigger("keyPressRepeat", k)
                game.ev.trigger("keyPress", k)
            }
        })
    }

    canvasEvents.keyup = (e) => {
        game.ev.onOnce("input", () => {
            const k = KEY_ALIAS[e.key] || e.key.toLowerCase()
            app.keyState.release(k)
            game.ev.trigger("keyRelease", k)
        })
    }

    canvasEvents.touchstart = (e) => {
        // disable long tap context menu
        e.preventDefault()
        game.ev.onOnce("input", () => {
            const touches = [...e.changedTouches]
            touches.forEach((t) => {
                game.ev.trigger(
                    "onTouchStart",
                    windowToContent(new Vec2(t.clientX, t.clientY)),
                    t,
                )
            })
            if (gopt.touchToMouse !== false) {
                setMousePos(touches[0].clientX, touches[0].clientY)
                app.mouseState.press("left")
                game.ev.trigger("mousePress", "left")
            }
        })
    }

    canvasEvents.touchmove = (e) => {
        // disable scrolling
        e.preventDefault()
        game.ev.onOnce("input", () => {
            const touches = [...e.changedTouches]
            touches.forEach((t) => {
                game.ev.trigger(
                    "onTouchMove",
                    windowToContent(new Vec2(t.clientX, t.clientY)),
                    t,
                )
            })
            if (gopt.touchToMouse !== false) {
                game.ev.trigger("mouseMove", "left")
                setMousePos(touches[0].clientX, touches[0].clientY)
            }
        })
    }

    canvasEvents.touchend = (e) => {
        game.ev.onOnce("input", () => {
            const touches = [...e.changedTouches]
            touches.forEach((t) => {
                game.ev.trigger(
                    "onTouchEnd",
                    windowToContent(new Vec2(t.clientX, t.clientY)),
                    t,
                )
            })
            if (gopt.touchToMouse !== false) {
                app.mouseState.release("left")
                game.ev.trigger("mouseRelease", "left")
            }
        })
    }

    canvasEvents.touchcancel = (e) => {
        game.ev.onOnce("input", () => {
            const touches = [...e.changedTouches]
            touches.forEach((t) => {
                game.ev.trigger(
                    "onTouchEnd",
                    windowToContent(new Vec2(t.clientX, t.clientY)),
                    t,
                )
            })
            if (gopt.touchToMouse !== false) {
                app.mouseState.release("left")
                game.ev.trigger("mouseRelease", "left")
            }
        })
    }

    canvasEvents.contextmenu = (e) => e.preventDefault()

    for (const name in canvasEvents) {
        app.canvas.addEventListener(name, canvasEvents[name])
    }

    return canvasEvents
}