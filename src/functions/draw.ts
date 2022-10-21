import {
    Quad, vec3, rgb, deg2rad, Color, rand, lerp, Mat4,
    wave, Rect, Vec2
} from "../math"

import { AssetData } from "../classes/AssetData"

import {
    Vertex, RenderProps, Debug, RenderPropsType,
    DrawRectOpt, DrawLineOpt, DrawLinesOpt,
    DrawTriangleOpt, DrawPolygonOpt, DrawCircleOpt,
    DrawEllipseOpt, DrawUVQuadOpt, DrawSpriteOpt,
    DrawTextOpt, FormattedText, Uniform,
    VirtualButton, assetsType, gameType,
    Anchor, gfxType, appType, gcType, KaboomOpt,
} from "../types"

import { deepEq, anchorPt, dt, center, loadProgress } from "../utils"

import { STRIDE, MAX_BATCHED_VERTS, MAX_BATCHED_INDICES, DEF_ANCHOR, UV_PAD, DBG_FONT } from "../constants"

import shaderFunc from "./shaders"
import textFunc from "./text"
import spriteFunc from "./sprite"

import { Texture } from "../classes/Texture"

import type { DrawCtx } from "../types/draw"

type DrawTextureOpt = RenderProps & {
    tex: Texture,
    width?: number,
    height?: number,
    tiled?: boolean,
    flipX?: boolean,
    flipY?: boolean,
    quad?: Quad,
    anchor?: Anchor | Vec2,
}

export default (gopt: KaboomOpt, gfx: gfxType, assets: assetsType, game: gameType, app: appType, debug: Debug, gl: WebGLRenderingContext, gc: gcType, getRenderProps: RenderPropsType): DrawCtx => {
    // convert a screen space coordinate to webgl normalized device coordinate
    function screen2ndc(pt: Vec2): Vec2 {
        return new Vec2(
            pt.x / gfx.width * 2 - 1,
            -pt.y / gfx.height * 2 + 1,
        )
    }

    function pushTransform() {
        gfx.transformStack.push(gfx.transform.clone())
    }

    /*
    function pushTranslate(...args) {
        if (args[0] === undefined) return
        const p = vec2(...args)
        if (p.x === 0 && p.y === 0) return
        gfx.transform = gfx.transform.translate(p)
    }
    */
    function pushTranslate(x: Vec2 | number, y?: number) {
        if (x === undefined) return
        const p = x instanceof Vec2 ? new Vec2(x) : new Vec2(x, y)
        if (p.x === 0 && p.y === 0) return
        gfx.transform = gfx.transform.translate(p)
    }

    /*
    function pushScale(...args) {
        if (args[0] === undefined) return
        const p = vec2(...args)
        if (p.x === 1 && p.y === 1) return
        gfx.transform = gfx.transform.scale(p)
    }
    */
    function pushScale(x: Vec2 | number, y?: number) {
        if (x === undefined) return
        const p = x instanceof Vec2 ? new Vec2(x) : new Vec2(x, y)
        if (p.x === 1 && p.y === 1) return
        gfx.transform = gfx.transform.scale(p)
    }

    function pushRotateX(a: number) {
        if (!a) {
            return
        }
        gfx.transform = gfx.transform.rotateX(a)
    }

    function pushRotateY(a: number) {
        if (!a) {
            return
        }
        gfx.transform = gfx.transform.rotateY(a)
    }

    function pushRotateZ(a: number) {
        if (!a) {
            return
        }
        gfx.transform = gfx.transform.rotateZ(a)
    }

    const pushRotate = pushRotateZ

    function popTransform() {
        if (gfx.transformStack.length > 0) {
            gfx.transform = gfx.transformStack.pop()
        }
    }

    // TODO: expose
    function drawRaw(
        verts: Vertex[],
        indices: number[],
        fixed: boolean,
        tex: Texture = gfx.defTex,
        shaderSrc: RenderProps["shader"] = gfx.defShader,
        uniform: Uniform = {},
    ) {

        const shaderStuff = shaderFunc(game, gfx, gopt, assets, gl, gc, app, debug, getRenderProps)
        const shader = shaderStuff.resolveShader(shaderSrc)

        if (!shader || shader instanceof AssetData) {
            return
        }

        // flush on texture / shader change and overflow
        if (
            tex !== gfx.curTex
            || shader !== gfx.curShader
            || !deepEq(gfx.curUniform, uniform)
            || gfx.vqueue.length + verts.length * STRIDE > MAX_BATCHED_VERTS
            || gfx.iqueue.length + indices.length > MAX_BATCHED_INDICES
        ) {
            flush()
        }

        for (const v of verts) {

            // TODO: cache camTransform * gfxTransform?
            const transform = fixed ? gfx.transform : game.cam.transform.mult(gfx.transform)

            // normalized world space coordinate [-1.0 ~ 1.0]
            const pt = screen2ndc(transform.multVec2(v.pos.xy()))

            gfx.vqueue.push(
                pt.x, pt.y, v.pos.z,
                v.uv.x, v.uv.y,
                v.color.r / 255, v.color.g / 255, v.color.b / 255, v.opacity,
            )

        }

        for (const i of indices) {
            gfx.iqueue.push(i + gfx.vqueue.length / STRIDE - verts.length)
        }

        gfx.curTex = tex
        gfx.curShader = shader
        gfx.curUniform = uniform

    }

    // draw a uv textured quad
    function drawUVQuad(opt: DrawUVQuadOpt) {

        if (opt.width === undefined || opt.height === undefined) {
            throw new Error("drawUVQuad() requires property \"width\" and \"height\".")
        }

        if (opt.width <= 0 || opt.height <= 0) {
            return
        }

        const w = opt.width
        const h = opt.height
        const anchor = anchorPt(opt.anchor || DEF_ANCHOR)
        const offset = anchor.scale(new Vec2(w, h).scale(-0.5))
        const q = opt.quad || new Quad(0, 0, 1, 1)
        const color = opt.color || rgb([255, 255, 255])
        const opacity = opt.opacity ?? 1

        // apply uv padding to avoid artifacts
        const uvPadX = opt.tex ? UV_PAD / opt.tex.width : 0
        const uvPadY = opt.tex ? UV_PAD / opt.tex.height : 0
        const qx = q.x + uvPadX
        const qy = q.y + uvPadY
        const qw = q.w - uvPadX * 2
        const qh = q.h - uvPadY * 2

        pushTransform()
        pushTranslate(opt.pos)
        pushRotateZ(opt.angle)
        pushScale(opt.scale)
        pushTranslate(offset)

        drawRaw([
            {
                pos: vec3(-w / 2, h / 2, 0),
                uv: new Vec2(opt.flipX ? qx + qw : qx, opt.flipY ? qy : qy + qh),
                color: color,
                opacity: opacity,
            },
            {
                pos: vec3(-w / 2, -h / 2, 0),
                uv: new Vec2(opt.flipX ? qx + qw : qx, opt.flipY ? qy + qh : qy),
                color: color,
                opacity: opacity,
            },
            {
                pos: vec3(w / 2, -h / 2, 0),
                uv: new Vec2(opt.flipX ? qx : qx + qw, opt.flipY ? qy + qh : qy),
                color: color,
                opacity: opacity,
            },
            {
                pos: vec3(w / 2, h / 2, 0),
                uv: new Vec2(opt.flipX ? qx : qx + qw, opt.flipY ? qy : qy + qh),
                color: color,
                opacity: opacity,
            },
        ], [0, 1, 3, 1, 2, 3], opt.fixed, opt.tex, opt.shader, opt.uniform)

        popTransform()

    }

    // TODO: clean
    function drawTexture(opt: DrawTextureOpt) {

        if (!opt.tex) {
            throw new Error("drawTexture() requires property \"tex\".")
        }

        const q = opt.quad ?? new Quad(0, 0, 1, 1)
        const w = opt.tex.width * q.w
        const h = opt.tex.height * q.h
        const scale = new Vec2(1)

        if (opt.tiled) {

            // TODO: draw fract
            const repX = Math.ceil((opt.width || w) / w)
            const repY = Math.ceil((opt.height || h) / h)
            const anchor = anchorPt(opt.anchor || DEF_ANCHOR).add(new Vec2(1, 1)).scale(0.5)
            const offset = anchor.scale(new Vec2(repX * w, repY * h))

            // TODO: rotation
            for (let i = 0; i < repX; i++) {
                for (let j = 0; j < repY; j++) {
                    drawUVQuad({
                        ...opt,
                        pos: (opt.pos || new Vec2(0)).add(new Vec2(w * i, h * j)).sub(offset),
                        scale: scale.scale(opt.scale || new Vec2(1)),
                        tex: opt.tex,
                        quad: q,
                        width: w,
                        height: h,
                        anchor: "topleft",
                    })
                }
            }
        } else {

            // TODO: should this ignore scale?
            if (opt.width && opt.height) {
                scale.x = opt.width / w
                scale.y = opt.height / h
            } else if (opt.width) {
                scale.x = opt.width / w
                scale.y = scale.x
            } else if (opt.height) {
                scale.y = opt.height / h
                scale.x = scale.y
            }

            drawUVQuad({
                ...opt,
                scale: scale.scale(opt.scale || new Vec2(1)),
                tex: opt.tex,
                quad: q,
                width: w,
                height: h,
            })

        }

    }

    function drawSprite(opt: DrawSpriteOpt) {
        const spriteSuff = spriteFunc(gl, gc, gopt, assets, gfx, game, app, debug, getRenderProps)

        if (!opt.sprite) {
            throw new Error("drawSprite() requires property \"sprite\"")
        }

        const spr = spriteSuff.resolveSprite(opt.sprite)

        if (!spr || !spr.data) {
            return
        }

        const q = spr.data.frames[opt.frame ?? 0]

        if (!q) {
            throw new Error(`Frame not found: ${opt.frame ?? 0}`)
        }

        drawTexture({
            ...opt,
            tex: spr.data.tex,
            quad: q.scale(opt.quad || new Quad(0, 0, 1, 1)),
        })

    }

    // generate vertices to form an arc
    function getArcPts(
        pos: Vec2,
        radiusX: number,
        radiusY: number,
        start: number,
        end: number,
        res: number = 1,
    ): Vec2[] {

        // normalize and turn start and end angles to radians
        start = deg2rad(start % 360)
        end = deg2rad(end % 360)
        if (end <= start) end += Math.PI * 2

        // TODO: better way to get this?
        // the number of vertices is sqrt(r1 + r2) * 3 * res with a minimum of 16
        const nverts = Math.ceil(Math.max(Math.sqrt(radiusX + radiusY) * 3 * (res || 1), 16))
        const step = (end - start) / nverts
        const pts = []

        // calculate vertices
        for (let a = start; a < end; a += step) {
            pts.push(pos.add(new Vec2(radiusX * Math.cos(a), radiusY * Math.sin(a))))
        }

        // doing this on the side due to possible floating point inaccuracy
        pts.push(pos.add(new Vec2(radiusX * Math.cos(end), radiusY * Math.sin(end))))

        return pts

    }

    function drawRect(opt: DrawRectOpt) {

        if (opt.width === undefined || opt.height === undefined) {
            throw new Error("drawRect() requires property \"width\" and \"height\".")
        }

        if (opt.width <= 0 || opt.height <= 0) {
            return
        }

        const w = opt.width
        const h = opt.height
        const anchor = anchorPt(opt.anchor || DEF_ANCHOR).add(new Vec2(1, 1))
        const offset = anchor.scale(new Vec2(w, h).scale(-0.5))

        let pts = [
            new Vec2(0, 0),
            new Vec2(w, 0),
            new Vec2(w, h),
            new Vec2(0, h),
        ]

        // TODO: gradient for rounded rect
        // TODO: drawPolygon should handle generic rounded corners
        if (opt.radius) {

            // maxium radius is half the shortest side
            const r = Math.min(Math.min(w, h) / 2, opt.radius)

            pts = [
                new Vec2(r, 0),
                new Vec2(w - r, 0),
                ...getArcPts(new Vec2(w - r, r), r, r, 270, 360),
                new Vec2(w, r),
                new Vec2(w, h - r),
                ...getArcPts(new Vec2(w - r, h - r), r, r, 0, 90),
                new Vec2(w - r, h),
                new Vec2(r, h),
                ...getArcPts(new Vec2(r, h - r), r, r, 90, 180),
                new Vec2(0, h - r),
                new Vec2(0, r),
                ...getArcPts(new Vec2(r, r), r, r, 180, 270),
            ]

        }

        drawPolygon({
            ...opt,
            offset,
            pts,
            ...(opt.gradient ? {
                colors: opt.horizontal ? [
                    opt.gradient[0],
                    opt.gradient[1],
                    opt.gradient[1],
                    opt.gradient[0],
                ] : [
                    opt.gradient[0],
                    opt.gradient[0],
                    opt.gradient[1],
                    opt.gradient[1],
                ],
            } : {}),
        })

    }

    function drawLine(opt: DrawLineOpt) {

        const { p1, p2 } = opt

        if (!p1 || !p2) {
            throw new Error("drawLine() requires properties \"p1\" and \"p2\".")
        }

        const w = opt.width || 1

        // the displacement from the line end point to the corner point
        const dis = p2.sub(p1).unit().normal().scale(w * 0.5)

        // calculate the 4 corner points of the line polygon
        const verts = [
            p1.sub(dis),
            p1.add(dis),
            p2.add(dis),
            p2.sub(dis),
        ].map((p) => ({
            pos: vec3(p.x, p.y, 0),
            uv: new Vec2(0),
            color: opt.color ?? Color.WHITE,
            opacity: opt.opacity ?? 1,
        }))

        drawRaw(verts, [0, 1, 3, 1, 2, 3], opt.fixed, gfx.defTex, opt.shader, opt.uniform)

    }

    function drawLines(opt: DrawLinesOpt) {

        const pts = opt.pts

        if (!pts) {
            throw new Error("drawLines() requires property \"pts\".")
        }

        if (pts.length < 2) {
            return
        }

        if (opt.radius && pts.length >= 3) {

            // TODO: line joines
            // TODO: rounded vertices for arbitury polygonic shape
            let minLen = pts[0].dist(pts[1])

            for (let i = 1; i < pts.length - 1; i++) {
                minLen = Math.min(pts[i].dist(pts[i + 1]), minLen)
            }

            // eslint-disable-next-line
            const radius = Math.min(opt.radius, minLen / 2)

            drawLine({ ...opt, p1: pts[0], p2: pts[1] })

            for (let i = 1; i < pts.length - 2; i++) {
                const p1 = pts[i]
                const p2 = pts[i + 1]
                drawLine({
                    ...opt,
                    p1: p1,
                    p2: p2,
                })
            }

            drawLine({ ...opt, p1: pts[pts.length - 2], p2: pts[pts.length - 1] })

        } else {

            for (let i = 0; i < pts.length - 1; i++) {
                drawLine({
                    ...opt,
                    p1: pts[i],
                    p2: pts[i + 1],
                })
                // TODO: other line join types
                if (opt.join !== "none") {
                    drawCircle({
                        ...opt,
                        pos: pts[i],
                        radius: opt.width / 2,
                    })
                }
            }

        }

    }

    function drawTriangle(opt: DrawTriangleOpt) {
        if (!opt.p1 || !opt.p2 || !opt.p3) {
            throw new Error("drawPolygon() requires properties \"p1\", \"p2\" and \"p3\".")
        }
        return drawPolygon({
            ...opt,
            pts: [opt.p1, opt.p2, opt.p3],
        })
    }

    // TODO: anchor
    function drawCircle(opt: DrawCircleOpt) {

        if (!opt.radius) {
            throw new Error("drawCircle() requires property \"radius\".")
        }

        if (opt.radius === 0) {
            return
        }

        drawEllipse({
            ...opt,
            radiusX: opt.radius,
            radiusY: opt.radius,
            angle: 0,
        })

    }

    function drawEllipse(opt: DrawEllipseOpt) {

        if (opt.radiusX === undefined || opt.radiusY === undefined) {
            throw new Error("drawEllipse() requires properties \"radiusX\" and \"radiusY\".")
        }

        if (opt.radiusX === 0 || opt.radiusY === 0) {
            return
        }

        const start = opt.start ?? 0
        const end = opt.end ?? 360

        const pts = getArcPts(
            new Vec2(0),
            opt.radiusX,
            opt.radiusY,
            start,
            end,
            opt.resolution,
        )

        // center
        pts.unshift(new Vec2(0))

        const polyOpt = {
            ...opt,
            pts,
            radius: 0,
            ...(opt.gradient ? {
                colors: [
                    opt.gradient[0],
                    ...Array(pts.length - 1).fill(opt.gradient[1]),
                ],
            } : {}),
        }

        // full circle with outline shouldn't have the center point
        if (end - start >= 360 && opt.outline) {
            if (opt.fill !== false) {
                drawPolygon({
                    ...polyOpt,
                    outline: null,
                })
            }
            drawPolygon({
                ...polyOpt,
                pts: pts.slice(1),
                fill: false,
            })
            return
        }

        drawPolygon(polyOpt)

    }

    function drawPolygon(opt: DrawPolygonOpt) {

        if (!opt.pts) {
            throw new Error("drawPolygon() requires property \"pts\".")
        }

        const npts = opt.pts.length

        if (npts < 3) {
            return
        }

        pushTransform()
        pushTranslate(opt.pos)
        pushScale(opt.scale)
        pushRotateZ(opt.angle)
        pushTranslate(opt.offset)

        if (opt.fill !== false) {

            const color = opt.color ?? Color.WHITE

            const verts = opt.pts.map((pt, i) => ({
                pos: vec3(pt.x, pt.y, 0),
                uv: new Vec2(0, 0),
                color: opt.colors ? (opt.colors[i] ?? color) : color,
                opacity: opt.opacity ?? 1,
            }))

            // TODO: better triangulation
            const indices = [...Array(npts - 2).keys()]
                .map((n) => [0, n + 1, n + 2])
                .flat()

            drawRaw(verts, opt.indices ?? indices, opt.fixed, gfx.defTex, opt.shader, opt.uniform)

        }

        if (opt.outline) {
            drawLines({
                pts: [...opt.pts, opt.pts[0]],
                radius: opt.radius,
                width: opt.outline.width,
                color: opt.outline.color,
                join: opt.outline.join,
                uniform: opt.uniform,
                fixed: opt.fixed,
                opacity: opt.opacity,
            })
        }

        popTransform()

    }

    function drawStenciled(content: () => void, mask: () => void, test: number) {

        flush()
        gl.clear(gl.STENCIL_BUFFER_BIT)
        gl.enable(gl.STENCIL_TEST)

        // don't perform test, pure write
        gl.stencilFunc(
            gl.NEVER,
            1,
            0xFF,
        )

        // always replace since we're writing to the buffer
        gl.stencilOp(
            gl.REPLACE,
            gl.REPLACE,
            gl.REPLACE,
        )

        mask()
        flush()

        // perform test
        gl.stencilFunc(
            test,
            1,
            0xFF,
        )

        // don't write since we're only testing
        gl.stencilOp(
            gl.KEEP,
            gl.KEEP,
            gl.KEEP,
        )

        content()
        flush()
        gl.disable(gl.STENCIL_TEST)

    }

    function drawMasked(content: () => void, mask: () => void) {
        drawStenciled(content, mask, gl.EQUAL)
    }

    function drawSubtracted(content: () => void, mask: () => void) {
        drawStenciled(content, mask, gl.NOTEQUAL)
    }

    function drawUnscaled(content: () => void) {
        flush()
        const ow = gfx.width
        const oh = gfx.height
        gfx.width = gfx.viewport.width
        gfx.height = gfx.viewport.height
        content()
        flush()
        gfx.width = ow
        gfx.height = oh
    }

    function drawText(opt: DrawTextOpt) {
        const textStuff = textFunc(game, gfx, gopt, assets, gl, gc, app, debug, getRenderProps)
        drawFormattedText(textStuff.formatText(opt))
    }

    function drawFormattedText(ftext: FormattedText) {
        pushTransform()
        pushTranslate(ftext.opt.pos)
        pushRotateZ(ftext.opt.angle)
        pushTranslate(anchorPt(ftext.opt.anchor ?? "topleft").add(new Vec2(1, 1)).scale(new Vec2(ftext.width, ftext.height)).scale(-0.5))
        ftext.chars.forEach((ch) => {
            drawUVQuad({
                tex: ch.tex,
                width: ch.width,
                height: ch.height,
                pos: ch.pos,
                scale: ch.scale,
                angle: ch.angle,
                color: ch.color,
                opacity: ch.opacity,
                quad: ch.quad,
                anchor: "center",
                uniform: ftext.opt.uniform,
                shader: ftext.opt.shader,
                fixed: ftext.opt.fixed,
            })
        })
        popTransform()
    }


    function drawFrame() {

        // calculate camera matrix
        const cam = game.cam
        const shake = Vec2.fromAngle(rand(0, 360) as number).scale(cam.shake)

        cam.shake = lerp(cam.shake, 0, 5 * dt(app, debug))
        cam.transform = new Mat4()
            .translate(center(gfx))
            .scale(cam.scale)
            .rotateZ(cam.angle)
            .translate((cam.pos ?? center(gfx)).scale(-1).add(shake))

        game.root.draw()
        flush()
    }

    function width() {
        return gfx.width
    }

    function height() {
        return gfx.height
    }

    function drawLoadScreen() {

        const progress = loadProgress(assets)

        drawUnscaled(() => {

            const w = width() / 2
            const h = 24
            const pos = new Vec2(width() / 2, height() / 2).sub(new Vec2(w / 2, h / 2))

            drawRect({
                pos: new Vec2(0),
                width: width(),
                height: height(),
                color: rgb([0, 0, 0]),
            })

            drawRect({
                pos: pos,
                width: w,
                height: h,
                fill: false,
                outline: {
                    width: 4,
                },
            })

            drawRect({
                pos: pos,
                width: w * progress,
                height: h,
            })

        })

        game.ev.trigger("loading", progress)

    }

    function drawInspectText(pos, txt) {

        drawUnscaled(() => {

            const pad = new Vec2(8)

            pushTransform()
            pushTranslate(pos)

            const textStuff = textFunc(game, gfx, gopt, assets, gl, gc, app, debug, getRenderProps)

            const ftxt = textStuff.formatText({
                text: txt,
                font: DBG_FONT,
                size: 16,
                pos: pad,
                color: rgb([255, 255, 255]),
                fixed: true,
            })

            const bw = ftxt.width + pad.x * 2
            const bh = ftxt.height + pad.x * 2

            if (pos.x + bw >= width()) {
                pushTranslate(new Vec2(-bw, 0))
            }

            if (pos.y + bh >= height()) {
                pushTranslate(new Vec2(0, -bh))
            }

            drawRect({
                width: bw,
                height: bh,
                color: rgb([0, 0, 0]),
                radius: 4,
                opacity: 0.8,
                fixed: true,
            })

            drawFormattedText(ftxt)
            popTransform()

        })

    }

    // transform a point from content space to view space
    function contentToView(pt: Vec2) {
        return new Vec2(
            pt.x * gfx.viewport.width / gfx.width,
            pt.y * gfx.viewport.height / gfx.height,
        )
    }

    function drawDebug(getAll, mousePos, time) {
        const textStuff = textFunc(game, gfx, gopt, assets, gl, gc, app, debug, getRenderProps)

        if (debug.inspect) {

            let inspecting = null

            for (const obj of getAll()) {
                if (obj.c("area") && obj.isHovering()) {
                    inspecting = obj
                    break
                }
            }

            game.root.drawInspect()

            if (inspecting) {

                const lines = []
                const data = inspecting.inspect()

                for (const tag in data) {
                    if (data[tag]) {
                        lines.push(`${tag}: ${data[tag]}`)
                    } else {
                        lines.push(`${tag}`)
                    }
                }

                drawInspectText(contentToView(mousePos()), lines.join("\n"))

            }

            drawInspectText(new Vec2(8), `FPS: ${debug.fps()}`)

        }

        if (debug.paused) {

            drawUnscaled(() => {

                // top right corner
                pushTransform()
                pushTranslate(width(), 0)
                pushTranslate(-8, 8)

                const size = 32

                // bg
                drawRect({
                    width: size,
                    height: size,
                    anchor: "topright",
                    color: rgb([0, 0, 0]),
                    opacity: 0.8,
                    radius: 4,
                    fixed: true,
                })

                // pause icon
                for (let i = 1; i <= 2; i++) {
                    drawRect({
                        width: 4,
                        height: size * 0.6,
                        anchor: "center",
                        pos: new Vec2(-size / 3 * i, size * 0.5),
                        color: rgb([255, 255, 255]),
                        radius: 2,
                        fixed: true,
                    })
                }

                popTransform()

            })

        }

        if (debug.timeScale !== 1) {

            drawUnscaled(() => {

                // bottom right corner
                pushTransform()
                pushTranslate(width(), height())
                pushTranslate(-8, -8)

                const pad = 8

                // format text first to get text size
                const ftxt = textStuff.formatText({
                    text: debug.timeScale.toFixed(1),
                    font: DBG_FONT,
                    size: 16,
                    color: rgb([255, 255, 255]),
                    pos: new Vec2(-pad),
                    anchor: "botright",
                    fixed: true,
                })

                // bg
                drawRect({
                    width: ftxt.width + pad * 2 + pad * 4,
                    height: ftxt.height + pad * 2,
                    anchor: "botright",
                    color: rgb([0, 0, 0]),
                    opacity: 0.8,
                    radius: 4,
                    fixed: true,
                })

                // fast forward / slow down icon
                for (let i = 0; i < 2; i++) {
                    const flipped = debug.timeScale < 1
                    drawTriangle({
                        p1: new Vec2(-ftxt.width - pad * (flipped ? 2 : 3.5), -pad),
                        p2: new Vec2(-ftxt.width - pad * (flipped ? 2 : 3.5), -pad - ftxt.height),
                        p3: new Vec2(-ftxt.width - pad * (flipped ? 3.5 : 2), -pad - ftxt.height / 2),
                        pos: new Vec2(-i * pad * 1 + (flipped ? -pad * 0.5 : 0), 0),
                        color: rgb([255, 255, 255]),
                        fixed: true,
                    })
                }

                // text
                drawFormattedText(ftxt)

                popTransform()

            })

        }

        if (debug.curRecording) {

            drawUnscaled(() => {

                pushTransform()
                pushTranslate(0, height())
                pushTranslate(24, -24)

                drawCircle({
                    radius: 12,
                    color: rgb([255, 0, 0]),
                    opacity: wave(0, 1, time() * 4),
                    fixed: true,
                })

                popTransform()

            })

        }

        if (debug.showLog && game.logs.length > 0) {

            drawUnscaled(() => {

                pushTransform()
                pushTranslate(0, height())
                pushTranslate(8, -8)

                const pad = 8

                const ftext = textStuff.formatText({
                    text: game.logs.join("\n"),
                    font: DBG_FONT,
                    pos: new Vec2(pad, -pad),
                    anchor: "botleft",
                    size: 16,
                    width: width() * 0.6,
                    lineSpacing: pad / 2,
                    fixed: true,
                    styles: {
                        "time": { color: rgb([127, 127, 127]) },
                        "info": { color: rgb([255, 255, 255]) },
                        "error": { color: rgb([255, 0, 127]) },
                    },
                })

                drawRect({
                    width: ftext.width + pad * 2,
                    height: ftext.height + pad * 2,
                    anchor: "botleft",
                    color: rgb([0, 0, 0]),
                    radius: 4,
                    opacity: 0.8,
                    fixed: true,
                })

                drawFormattedText(ftext)
                popTransform()

            })

        }

    }

    function drawVirtualControls(mousePos, isMousePressed, isMouseReleased, testCirclePoint, Circle, testRectPoint) {

        // TODO: mousePos incorrect in "stretch" mode
        const mpos = mousePos()

        const drawCircleButton = (pos: Vec2, btn: VirtualButton, text?: string) => {

            const size = 80

            drawCircle({
                radius: size / 2,
                pos: pos,
                outline: { width: 4, color: rgb([0, 0, 0]) },
                opacity: 0.5,
            })

            if (text) {
                drawText({
                    text: text,
                    pos: pos,
                    color: rgb([0, 0, 0]),
                    size: 40,
                    anchor: "center",
                    opacity: 0.5,
                })
            }

            // TODO: touch
            if (isMousePressed("left")) {
                if (testCirclePoint(new Circle(pos, size / 2), mpos)) {
                    game.ev.onOnce("input", () => {
                        // TODO: caller specify another value as connected key?
                        app.virtualButtonState.press(btn)
                        game.ev.trigger("virtualButtonPress", btn)
                        app.keyState.press(btn)
                        game.ev.trigger("keyPress", btn)
                    })
                }
            }

            if (isMouseReleased("left")) {
                game.ev.onOnce("input", () => {
                    app.virtualButtonState.release(btn)
                    game.ev.trigger("virtualButtonRelease", btn)
                    app.keyState.release(btn)
                    game.ev.trigger("keyRelease", btn)
                })
            }
        }

        const drawSquareButton = (pos: Vec2, btn: VirtualButton, text?: string) => {

            // TODO: mousePos incorrect in "stretch" mode
            const size = 64

            drawRect({
                width: size,
                height: size,
                pos: pos,
                outline: { width: 4, color: rgb([0, 0, 0]) },
                radius: 4,
                anchor: "center",
                opacity: 0.5,
            })

            if (text) {
                drawText({
                    text: text,
                    pos: pos,
                    color: rgb([0, 0, 0]),
                    size: 40,
                    anchor: "center",
                    opacity: 0.5,
                })
            }

            // TODO: touch
            if (isMousePressed("left")) {
                if (testRectPoint(new Rect(pos.add(new Vec2(-size / 2, -size / 2)), size, size), mpos)) {
                    game.ev.onOnce("input", () => {
                        // TODO: caller specify another value as connected key?
                        app.virtualButtonState.press(btn)
                        game.ev.trigger("virtualButtonPress", btn)
                        app.keyState.press(btn)
                        game.ev.trigger("keyPress", btn)
                    })
                }
            }

            if (isMouseReleased("left")) {
                game.ev.onOnce("input", () => {
                    app.virtualButtonState.release(btn)
                    game.ev.trigger("virtualButtonRelease", btn)
                    app.keyState.release(btn)
                    game.ev.trigger("keyRelease", btn)
                })
            }

        }

        drawUnscaled(() => {
            drawCircleButton(new Vec2(width() - 80, height() - 160), "a")
            drawCircleButton(new Vec2(width() - 160, height() - 80), "b")
            drawSquareButton(new Vec2(60, height() - 124), "left")
            drawSquareButton(new Vec2(188, height() - 124), "right")
            drawSquareButton(new Vec2(124, height() - 188), "up")
            drawSquareButton(new Vec2(124, height() - 60), "down")
        })

    }

    // draw all batched shapes
    function flush() {

        if (
            !gfx.curTex
            || !gfx.curShader
            || gfx.vqueue.length === 0
            || gfx.iqueue.length === 0
        ) {
            return
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, gfx.vbuf)
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(gfx.vqueue))
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gfx.ibuf)
        gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, new Uint16Array(gfx.iqueue))
        gfx.curShader.bind()
        gfx.curShader.send(gfx.curUniform)
        gfx.curTex.bind()
        gl.drawElements(gl.TRIANGLES, gfx.iqueue.length, gl.UNSIGNED_SHORT, 0)
        gfx.curTex.unbind()
        gfx.curShader.unbind()
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

        gfx.vqueue = []
        gfx.iqueue = []

        gfx.drawCalls++

    }

    return {
        drawText, drawRect, drawLine, drawLines,
        drawTriangle, drawCircle, drawEllipse, drawPolygon,
        drawUVQuad, drawFormattedText, drawMasked, drawSubtracted,
        drawSprite,
        pushTransform,
        pushTranslate,
        pushScale,
        pushRotateX,
        pushRotateY,
        pushRotateZ,
        pushRotate,
        popTransform,
        drawUnscaled,
        drawLoadScreen,
        drawFrame,
        drawDebug,
        drawVirtualControls,
        flush,
    }
}