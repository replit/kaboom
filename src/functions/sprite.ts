import {
    LoadSpriteSrc, SpriteAtlasData, GfxFont, DrawSpriteOpt, SpriteCurAnim,
    DrawTextOpt, FormattedText, FontData, BitmapFontData, FormattedChar,
    TextAlign, CharTransform, assetsType, appType, KaboomOpt, GameObj,
    glType, gcType, LoadSpriteOpt, PeditFile, SpriteCompOpt, SpriteComp,
    gfxType, gameType, Debug, RenderPropsType, SpriteAnimPlayOpt, EventController,
    BoomOpt
} from "../types"
import { Vec2, Quad, Rect } from "../math"
import { DEF_FONT, DEF_TEXT_CACHE_SIZE, ASCII_CHARS } from "../constants"
import { loadProgress, getBitmapFont, loadImg, fetchURL, dt } from "../utils"

import { Texture } from "../classes/Texture"
import { SpriteData } from "../classes/SpriteData"

import { SpriteCtx } from "../types/sprite"

import { AssetData } from "../classes/AssetData"
import drawFunc from "./draw"

// @ts-ignore
import beanSpriteSrc from "../assets/bean.png"
// @ts-ignore
import kaSpriteSrc from "../assets/ka.png"
// @ts-ignore
import boomSpriteSrc from "../assets/boom.png"

export default (gl: glType, gc: gcType, gopt: KaboomOpt, assets: assetsType, gfx: gfxType, game: gameType, app: appType, debug: Debug, getRenderProps: RenderPropsType): SpriteCtx => {


    // get an array of frames based on configuration on how to slice the image
    function slice(x = 1, y = 1, dx = 0, dy = 0, w = 1, h = 1): Quad[] {
        const frames = []
        const qw = w / x
        const qh = h / y
        for (let j = 0; j < y; j++) {
            for (let i = 0; i < x; i++) {
                frames.push(new Quad(
                    dx + i * qw,
                    dy + j * qh,
                    qw,
                    qh,
                ))
            }
        }
        return frames
    }

    // TODO: accept Asset<T>?
    // wrap individual loaders with global loader counter, for stuff like progress bar
    function load<T>(prom: Promise<T>): AssetData<T> {
        return assets.custom.add(null, prom)
    }

    function fetchJSON(path: string) {
        return fetchURL(assets, path).then((res) => res.json())
    }

    function getSprite(handle: string): AssetData<SpriteData> | void {
        return assets.sprites.get(handle)
    }

    function resolveSprite(src: DrawSpriteOpt["sprite"]): AssetData<SpriteData> | null {
        if (typeof src === "string") {
            const spr = getSprite(src)
            if (spr) {
                // if it's already loaded or being loading, return it
                return spr
            } else if (loadProgress(assets) < 1) {
                // if there's any other ongoing loading task we return empty and don't error yet
                return null
            } else {
                // if all other assets are loaded and we still haven't found this sprite, throw
                throw new Error(`Sprite not found: ${src}`)
            }
        } else if (src instanceof SpriteData) {
            return AssetData.loaded(src)
        } else if (src instanceof AssetData) {
            return src
        } else {
            throw new Error(`Invalid sprite: ${src}`)
        }
    }


    function loadSpriteAtlas(
        src: LoadSpriteSrc,
        data: SpriteAtlasData | string,
    ): AssetData<Record<string, SpriteData>> {
        if (typeof data === "string") {
            return load(new Promise((res, rej) => {
                fetchJSON(data).then((data2) => {
                    loadSpriteAtlas(src, data2).then(res).catch(rej)
                })
            }))
        }
        return load(SpriteData.from(src, assets, gl, gc, gopt, slice).then((atlas) => {
            const map = {}
            for (const name in data) {
                const w = atlas.tex.width
                const h = atlas.tex.height
                const info = data[name]
                const spr = new SpriteData(
                    atlas.tex,
                    slice(
                        info.sliceX,
                        info.sliceY,
                        info.x / w,
                        info.y / h,
                        info.width / w,
                        info.height / h,
                    ),
                    info.anims,
                )
                assets.sprites.addLoaded(name, spr)
                map[name] = spr
            }
            return map
        }))
    }

    // load a sprite to asset manager
    function loadSprite(
        name: string | null,
        src: LoadSpriteSrc,
        opt: LoadSpriteOpt = {
            sliceX: 1,
            sliceY: 1,
            anims: {},
        },
    ): AssetData<SpriteData> {
        return assets.sprites.add(
            name,
            typeof src === "string"
                ? SpriteData.fromURL(src, assets, gl, gc, gopt, slice, opt)
                : Promise.resolve(SpriteData.fromImage(src, gl, gc, gopt, slice, opt),
                ),
        )
    }

    function loadPedit(name: string | null, src: string | PeditFile): AssetData<SpriteData> {

        // eslint-disable-next-line
        return assets.sprites.add(name, new Promise(async (resolve) => {

            const data = typeof src === "string" ? await fetchJSON(src) : src
            const images = await Promise.all(data.frames.map(loadImg))
            const canvas = document.createElement("canvas")
            canvas.width = data.width
            canvas.height = data.height * data.frames.length

            const ctx = canvas.getContext("2d")

            images.forEach((img: HTMLImageElement, i) => {
                ctx.drawImage(img, 0, i * data.height)
            })

            const spr = await loadSprite(null, canvas, {
                sliceY: data.frames.length,
                anims: data.anims,
            })

            resolve(spr)

        }))

    }

    function loadAseprite(
        name: string | null,
        imgSrc: LoadSpriteSrc,
        jsonSrc: string,
    ): AssetData<SpriteData> {
        // eslint-disable-next-line
        return assets.sprites.add(name, new Promise(async (resolve) => {
            const spr = await loadSprite(null, imgSrc)
            const data = typeof jsonSrc === "string" ? await fetchJSON(jsonSrc) : jsonSrc
            const size = data.meta.size
            spr.frames = data.frames.map((f: any) => {
                return new Quad(
                    f.frame.x / size.w,
                    f.frame.y / size.h,
                    f.frame.w / size.w,
                    f.frame.h / size.h,
                )
            })
            for (const anim of data.meta.frameTags) {
                if (anim.from === anim.to) {
                    spr.anims[anim.name] = anim.from
                } else {
                    spr.anims[anim.name] = {
                        from: anim.from,
                        to: anim.to,
                        speed: 10,
                        loop: true,
                        pingpong: anim.direction === "pingpong",
                    }
                }
            }
            resolve(spr)
        }))
    }

    function loadBean(name: string = "bean"): AssetData<SpriteData> {
        return loadSprite(name, beanSpriteSrc)
    }


    // TODO: clean
    function sprite(
        src: string | SpriteData | AssetData<SpriteData>,
        opt: SpriteCompOpt = {},
    ): SpriteComp {

        let spriteData: SpriteData | null = null
        let curAnim: SpriteCurAnim | null = null

        if (!src) {
            throw new Error("Please pass the resource name or data to sprite()")
        }

        const calcTexScale = (tex: Texture, q: Quad, w?: number, h?: number): Vec2 => {
            const scale = new Vec2(1, 1)
            if (w && h) {
                scale.x = w / (tex.width * q.w)
                scale.y = h / (tex.height * q.h)
            } else if (w) {
                scale.x = w / (tex.width * q.w)
                scale.y = scale.x
            } else if (h) {
                scale.y = h / (tex.height * q.h)
                scale.x = scale.y
            }
            return scale
        }

        return {

            id: "sprite",
            // TODO: allow update
            width: 0,
            height: 0,
            frame: opt.frame || 0,
            quad: opt.quad || new Quad(0, 0, 1, 1),
            animSpeed: opt.animSpeed ?? 1,

            draw(this: GameObj<SpriteComp>) {
                if (!spriteData) return
                const DRAW = drawFunc(gopt, gfx, assets, game, app, debug, gl, gc, getRenderProps)

                DRAW.drawSprite({
                    ...getRenderProps(this),
                    sprite: spriteData,
                    frame: this.frame,
                    quad: this.quad,
                    flipX: opt.flipX,
                    flipY: opt.flipY,
                    tiled: opt.tiled,
                    width: opt.width,
                    height: opt.height,
                })
            },

            update(this: GameObj<SpriteComp>) {

                if (!spriteData) {

                    const spr = resolveSprite(src)

                    if (!spr || !spr.data) {
                        return
                    }

                    let q = spr.data.frames[0].clone()

                    if (opt.quad) {
                        q = q.scale(opt.quad)
                    }

                    const scale = calcTexScale(spr.data.tex, q, opt.width, opt.height)

                    this.width = spr.data.tex.width * q.w * scale.x
                    this.height = spr.data.tex.height * q.h * scale.y

                    if (opt.anim) {
                        this.play(opt.anim)
                    }

                    spriteData = spr.data
                    this.trigger("spriteLoaded", spriteData)

                }

                if (!curAnim) {
                    return
                }

                const anim = spriteData.anims[curAnim.name]

                if (typeof anim === "number") {
                    this.frame = anim
                    return
                }

                if (anim.speed === 0) {
                    throw new Error("Sprite anim speed cannot be 0")
                }

                curAnim.timer += dt(app, debug) * this.animSpeed

                if (curAnim.timer >= (1 / curAnim.speed)) {
                    curAnim.timer = 0
                    // TODO: clean up
                    if (anim.from > anim.to) {
                        this.frame--
                        if (this.frame < anim.to) {
                            if (curAnim.loop) {
                                this.frame = anim.from
                            } else {
                                this.frame++
                                curAnim.onEnd()
                                this.stop()
                            }
                        }
                    } else {
                        this.frame++
                        if (this.frame > anim.to) {
                            if (curAnim.loop) {
                                this.frame = anim.from
                            } else {
                                this.frame--
                                curAnim.onEnd()
                                this.stop()
                            }
                        }
                    }
                }

            },

            play(this: GameObj<SpriteComp>, name: string, opt: SpriteAnimPlayOpt = {}) {

                if (!spriteData) {
                    this.on("spriteLoaded", () => {
                        this.play(name, opt)
                    })
                    return
                }

                const anim = spriteData.anims[name]

                if (!anim) {
                    throw new Error(`Anim not found: ${name}`)
                }

                if (curAnim) {
                    this.stop()
                }

                curAnim = typeof anim === "number"
                    ? {
                        name: name,
                        timer: 0,
                        loop: false,
                        pingpong: false,
                        speed: 0,
                        onEnd: () => { },
                    }
                    : {
                        name: name,
                        timer: 0,
                        loop: opt.loop ?? anim.loop ?? false,
                        pingpong: opt.pingpong ?? anim.pingpong ?? false,
                        speed: opt.speed ?? anim.speed ?? 10,
                        onEnd: opt.onEnd ?? (() => { }),
                    }

                this.frame = typeof anim === "number"
                    ? anim
                    : anim.from

                this.trigger("animStart", name)

            },

            stop(this: GameObj<SpriteComp>) {
                if (!curAnim) {
                    return
                }
                const prevAnim = curAnim.name
                curAnim = null
                this.trigger("animEnd", prevAnim)
            },

            numFrames() {
                if (!spriteData) {
                    return 0
                }
                return spriteData.frames.length
            },

            curAnim() {
                return curAnim?.name
            },

            flipX(b: boolean) {
                opt.flipX = b
            },

            flipY(b: boolean) {
                opt.flipY = b
            },

            onAnimEnd(
                this: GameObj<SpriteComp>,
                name: string,
                action: () => void,
            ): EventController {
                return this.on("animEnd", (anim) => {
                    if (anim === name) {
                        action()
                    }
                })
            },

            onAnimStart(
                this: GameObj<SpriteComp>,
                name: string,
                action: () => void,
            ): EventController {
                return this.on("animStart", (anim) => {
                    if (anim === name) {
                        action()
                    }
                })
            },

            renderArea() {
                return new Rect(new Vec2(0), this.width, this.height)
            },

            inspect() {
                if (typeof src === "string") {
                    return `"${src}"`
                }
            },
        }
    }

    return {
        loadSprite,
        loadSpriteAtlas,
		loadAseprite,
		loadPedit,
		loadBean,
		load,
		getSprite,
		sprite,
        resolveSprite,
    }
}