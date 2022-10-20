import { EventList, KaboomOpt, gcType, RenderPropsType } from "../types"
import { rgb, Vec2 } from "../math"
import drawFunc from "./draw"
import textFunc from "./text"
import { DBG_FONT } from "../constants"

import {
    Vertex, RenderProps, Debug,
    DrawRectOpt, DrawLineOpt, DrawLinesOpt,
    DrawTriangleOpt, DrawPolygonOpt, DrawCircleOpt,
    DrawEllipseOpt, DrawUVQuadOpt, DrawSpriteOpt,
    DrawTextOpt, FormattedText, Uniform,
    VirtualButton, assetsType, gameType,
    Anchor, gfxType, appType,
} from "../types"

import { Texture } from "../classes/Texture"

export default (run,
    gopt: KaboomOpt, gfx: gfxType, assets: assetsType, game: gameType, app: appType, debug: Debug,
    gl: WebGLRenderingContext, gc: gcType, getRenderProps: RenderPropsType, width: number, height: number
): EventList<WindowEventMap> => {

    const winEvents: EventList<WindowEventMap> = {}


    function handleErr(err: Error) {

        // TODO: this should only run once
        run(() => {
            const DRAW = drawFunc(gopt, gfx, assets, game, app, debug, gl, gc, getRenderProps)
            const newText = textFunc(gopt, assets, gl, gc, app)

            DRAW.drawUnscaled(() => {

                const pad = 32
                const gap = 16
                const gw = width
                const gh = height

                const textStyle = {
                    size: 36,
                    width: gw - pad * 2,
                    letterSpacing: 4,
                    lineSpacing: 4,
                    font: DBG_FONT,
                    fixed: true,
                }

                DRAW.drawRect({
                    width: gw,
                    height: gh,
                    color: rgb([0, 0, 255]),
                    fixed: true,
                })

                const title = newText.formatText({
                    ...textStyle,
                    text: err.name,
                    pos: new Vec2(pad),
                    color: rgb([255, 128, 0]),
                    fixed: true,
                })

                DRAW.drawFormattedText(title)

                DRAW.drawText({
                    ...textStyle,
                    text: err.message,
                    pos: new Vec2(pad, pad + title.height + gap),
                    fixed: true,
                })

                DRAW.popTransform()
                game.ev.trigger("error", err)

            })

        })

    }

    winEvents.error = (e) => {
        if (e.error) {
            handleErr(e.error)
        } else {
            handleErr(new Error(e.message))
        }
    }

    winEvents.unhandledrejection = (e) => handleErr(e.reason)

    for (const name in winEvents) {
        window.addEventListener(name, winEvents[name])
    }

    return winEvents
}