import { Mat4, Quad, Rect, Vec2, testRectPoint } from "../math"
import { BG_GRID_SIZE, DEF_OFFSCREEN_DIS } from "../constants"

import {
    GameObj, EventController, PosComp, OffScreenCompOpt, OffScreenComp, gfxType, gameType, appType,
    KaboomOpt, glType, assetsType, Debug, gcType, RenderPropsType
} from "../types"

import drawFunc from "./draw"
import camFunc from "./cam"

import type { ScreenCtx } from "../types/functions/screen"

export default (game: gameType, app: appType, gfx: gfxType, gopt: KaboomOpt, gl: glType, assets: assetsType, debug: Debug, gc: gcType, getRenderProps: RenderPropsType): ScreenCtx => {

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

    function getViewportScale() {
        return (gfx.viewport.width + gfx.viewport.height) / (gfx.width + gfx.height)
    }

    // update viewport based on user setting and fullscreen state
    function updateViewport() {

        // content size (scaled content size, with scale, stretch and letterbox)
        // view size (unscaled viewport size)
        // window size (will be the same as view size except letterbox mode)

        // check for resize
        if (app.stretchToParent && !isFullscreen()) {
            // TODO: update cam pos
            // TODO: if <html>/<body> height not set to 100% the height keeps growing
            const pw = app.canvas.parentElement.offsetWidth
            const ph = app.canvas.parentElement.offsetHeight
            if (pw !== app.lastParentWidth || ph !== app.lastParentHeight) {
                app.canvas.width = pw * app.pixelDensity
                app.canvas.height = ph * app.pixelDensity
                app.canvas.style.width = pw + "px"
                app.canvas.style.height = ph + "px"
                const prevWidth = gfx.width
                const prevHeight = gfx.height
                // trigger "resize" on frame end so width() and height() will get the updated value
                game.ev.onOnce("frameEnd", () => {
                    // should we also pass window / view size?
                    game.ev.trigger("resize", prevWidth, prevHeight, gfx.width, gfx.height)
                })
            }
            app.lastParentWidth = pw
            app.lastParentHeight = ph
        }

        // canvas size
        const pd = app.pixelDensity
        const cw = gl.drawingBufferWidth / pd
        const ch = gl.drawingBufferHeight / pd

        if (isFullscreen()) {
            // TODO: doesn't work with letterbox
            const ww = window.innerWidth
            const wh = window.innerHeight
            const rw = ww / wh
            const rc = cw / ch
            if (rw > rc) {
                const sw = window.innerHeight * rc
                gfx.viewport = {
                    x: (ww - sw) / 2,
                    y: 0,
                    width: sw,
                    height: wh,
                }
            } else {
                const sh = window.innerWidth / rc
                gfx.viewport = {
                    x: 0,
                    y: (wh - sh) / 2,
                    width: ww,
                    height: sh,
                }
            }
            return
        }

        if (gopt.letterbox) {

            if (!gopt.width || !gopt.height) {
                throw new Error("Letterboxing requires width and height defined.")
            }

            const rc = cw / ch
            const rg = gopt.width / gopt.height

            if (rc > rg) {
                if (!gopt.stretch) {
                    gfx.width = ch * rg
                    gfx.height = ch
                }
                const sw = ch * rg
                const sh = ch
                const x = (cw - sw) / 2
                gl.scissor(x * pd, 0, sw * pd, sh * pd)
                gl.viewport(x * pd, 0, sw * pd, ch * pd)
                gfx.viewport = {
                    x: x,
                    y: 0,
                    width: sw,
                    height: ch,
                }
            } else {
                if (!gopt.stretch) {
                    gfx.width = cw
                    gfx.height = cw / rg
                }
                const sw = cw
                const sh = cw / rg
                const y = (ch - sh) / 2
                gl.scissor(0, y * pd, sw * pd, sh * pd)
                gl.viewport(0, y * pd, cw * pd, sh * pd)
                gfx.viewport = {
                    x: 0,
                    y: y,
                    width: cw,
                    height: sh,
                }
            }

            return

        }

        if (gopt.stretch) {

            if (!gopt.width || !gopt.height) {
                throw new Error("Stretching requires width and height defined.")
            }

            gl.viewport(0, 0, cw * pd, ch * pd)

            gfx.viewport = {
                x: 0,
                y: 0,
                width: cw,
                height: ch,
            }

            return
        }

        const scale = gopt.scale ?? 1

        gfx.width = cw / scale
        gfx.height = ch / scale
        gl.viewport(0, 0, cw * pd, ch * pd)

        gfx.viewport = {
            x: 0,
            y: 0,
            width: cw,
            height: ch,
        }

    }

    // start a rendering frame, reset some states
    function frameStart() {

        // running this every frame now mainly because isFullscreen() is not updated real time when requested fullscreen
        updateViewport()

        gl.clear(gl.COLOR_BUFFER_BIT)

        if (!gopt.background) {
            const drawStuff = drawFunc(gopt, gfx, assets, game, app, debug, gl, gc, getRenderProps)

            drawStuff.drawUnscaled(() => {
                drawStuff.drawUVQuad({
                    width: gfx.width,
                    height: gfx.height,
                    quad: new Quad(
                        0,
                        0,
                        gfx.width / BG_GRID_SIZE,
                        gfx.height / BG_GRID_SIZE,
                    ),
                    tex: gfx.bgTex,
                    fixed: true,
                })
            })
        }

        gfx.drawCalls = 0
        gfx.transformStack = []
        gfx.transform = new Mat4()

    }

    function frameEnd() {
        const drawStuff = drawFunc(gopt, gfx, assets, game, app, debug, gl, gc, getRenderProps)
        drawStuff.flush()
        gfx.lastDrawCalls = gfx.drawCalls
    }

    // get a base64 png image of canvas
    function screenshot(): string {
        return app.canvas.toDataURL()
    }

    function setFullscreen(f: boolean = true) {
        if (f) {
            enterFullscreen(app.canvas)
        } else {
            exitFullscreen()
        }
    }

    function isFullscreen(): boolean {
        return Boolean(getFullscreenElement())
    }

    function offscreen(opt: OffScreenCompOpt = {}): OffScreenComp {
        const width = gfx.width
        const height = gfx.height

        const camStuff = camFunc(game, width, height)

        const distance = opt.distance ?? DEF_OFFSCREEN_DIS
        let isOut = false
        return {
            id: "offscreen",
            require: ["pos"],
            isOffScreen(this: GameObj<PosComp>): boolean {
                const pos = camStuff.toScreen(this.pos)
                const screenRect = new Rect(new Vec2(0), width, height)
                return !testRectPoint(screenRect, pos)
                    && screenRect.distToPoint(pos) > distance
            },
            onExitScreen(this: GameObj, action: () => void): EventController {
                return this.on("exitView", action)
            },
            onEnterScreen(this: GameObj, action: () => void): EventController {
                return this.on("enterView", action)
            },
            update(this: GameObj) {
                if (this.isOffScreen()) {
                    if (!isOut) {
                        this.trigger("exitView")
                        isOut = true
                    }
                    if (opt.hide) this.hidden = true
                    if (opt.pause) this.paused = true
                    if (opt.destroy) this.destroy()
                } else {
                    if (isOut) {
                        this.trigger("enterView")
                        isOut = false
                    }
                    if (opt.hide) this.hidden = false
                    if (opt.pause) this.paused = false
                }
            },
            inspect() {
                return `${this.isOffScreen()}`
            },
        }
    }

    return {
		screenshot,
		setFullscreen,
		isFullscreen,
		offscreen,
        updateViewport,
        getViewportScale,
        frameStart,
        frameEnd,
    }
}
