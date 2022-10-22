import { AssetData } from "../classes/AssetData"
import {
    ShaderData, RenderProps, assetsType, gfxType, KaboomOpt, glType, gcType, appType, GfxShader, Uniform, ShaderComp, gameType,
    Debug, RenderPropsType
} from "../types"
import { loadProgress, getShader } from "../utils"
import { DEF_VERT, DEF_FRAG, VERT_TEMPLATE, FRAG_TEMPLATE } from "../constants"

import type { ShaderCtx } from "../types/functions/shaders"

import { Mat4, Color, Vec2, Vec3 } from "../math"
import textFunc from "./text"

//shaders
export default (game: gameType, gfx: gfxType, gopt: KaboomOpt, assets: assetsType, gl: glType, gc: gcType, app: appType, debug: Debug, getRenderProps: RenderPropsType): ShaderCtx => {

    const defShader = makeShader(DEF_VERT, DEF_FRAG)

    function resolveShader(
        src: RenderProps["shader"],
    ): ShaderData | AssetData<ShaderData> | null {
        if (!src) {
            return defShader
        }
        if (typeof src === "string") {
            const shader = getShader(assets, src)
            if (shader) {
                return shader.data ? shader.data : shader
            } else if (loadProgress(assets) < 1) {
                return null
            } else {
                throw new Error(`Shader not found: ${src}`)
            }
        } else if (src instanceof AssetData) {
            return src.data ? src.data : src
        }
        // TODO: check type
        // @ts-ignore
        return src
    }

    function makeShader(
        vertSrc: string | null = DEF_VERT,
        fragSrc: string | null = DEF_FRAG,
    ): GfxShader {

        const vcode = VERT_TEMPLATE.replace("{{user}}", vertSrc ?? DEF_VERT)
        const fcode = FRAG_TEMPLATE.replace("{{user}}", fragSrc ?? DEF_FRAG)
        const vertShader = gl.createShader(gl.VERTEX_SHADER)
        const fragShader = gl.createShader(gl.FRAGMENT_SHADER)

        gl.shaderSource(vertShader, vcode)
        gl.shaderSource(fragShader, fcode)
        gl.compileShader(vertShader)
        gl.compileShader(fragShader)

        const prog = gl.createProgram()

        gc.push(() => gl.deleteProgram(prog))
        gl.attachShader(prog, vertShader)
        gl.attachShader(prog, fragShader)

        gl.bindAttribLocation(prog, 0, "a_pos")
        gl.bindAttribLocation(prog, 1, "a_uv")
        gl.bindAttribLocation(prog, 2, "a_color")

        gl.linkProgram(prog)

        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {

            const formatShaderError = (msg: string) => {
                const FMT = /^ERROR:\s0:(?<line>\d+):\s(?<msg>.+)/
                const match = msg.match(FMT)
                return {
                    line: Number(match.groups.line),
                    // seem to be a \n\0 at the end of error messages, causing unwanted line break
                    msg: match.groups.msg.replace(/\n\0$/, ""),
                }
            }

            const vertError = gl.getShaderInfoLog(vertShader)
            const fragError = gl.getShaderInfoLog(fragShader)
            let msg = ""

            if (vertError) {
                const err = formatShaderError(vertError)
                msg += `Vertex shader line ${err.line - 14}: ${err.msg}`
            }

            if (fragError) {
                const err = formatShaderError(fragError)
                msg += `Fragment shader line ${err.line - 14}: ${err.msg}`
            }

            throw new Error(msg)

        }

        gl.deleteShader(vertShader)
        gl.deleteShader(fragShader)

        return {

            bind() {
                gl.useProgram(prog)
            },

            unbind() {
                gl.useProgram(null)
            },

            free() {
                gl.deleteProgram(prog)
            },

            send(uniform: Uniform) {
                for (const name in uniform) {
                    const val = uniform[name]
                    const loc = gl.getUniformLocation(prog, name)
                    if (typeof val === "number") {
                        gl.uniform1f(loc, val)
                    } else if (val instanceof Mat4) {
                        gl.uniformMatrix4fv(loc, false, new Float32Array(val.m))
                    } else if (val instanceof Color) {
                        // TODO: opacity?
                        gl.uniform3f(loc, val.r, val.g, val.b)
                    } else if (val instanceof Vec3) {
                        gl.uniform3f(loc, val.x, val.y, val.z)
                    } else if (val instanceof Vec2) {
                        gl.uniform2f(loc, val.x, val.y)
                    }
                }
            },

        }

    }

    function loadShader(
        name: string | null,
        vert?: string,
        frag?: string,
        isUrl: boolean = false,
    ): AssetData<ShaderData> {
        const newText = textFunc(game, gfx, gopt, assets, gl, gc, app, debug, getRenderProps)

        return assets.shaders.add(name, new Promise<ShaderData>((resolve, reject) => {

            const resolveUrl = (url?: string) =>
                url
                    ? newText.fetchText(url)
                    : new Promise((r) => r(null))

            if (isUrl) {
                Promise.all([resolveUrl(vert), resolveUrl(frag)])
                    .then(([vcode, fcode]: [string | null, string | null]) => {
                        resolve(makeShader(vcode, fcode))
                    })
                    .catch(reject)
            } else {
                try {
                    resolve(makeShader(vert, frag))
                } catch (err) {
                    reject(err)
                }
            }
        }))
    }

    function shader(id: string, uniform: Uniform = {}): ShaderComp {
        return {
            id: "shader",
            shader: id,
            uniform: uniform,
        }
    }

    return {
        loadShader,
        resolveShader,
        defShader,
        shader,
    }
}
