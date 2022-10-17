import {
    Vec2,
    Quad,
} from "./math"

import {
    Event,
    isDataURL,
    dataURLToArrayBuffer,
    fetchURL
} from "./utils"

import {
    TextureOpt,
    LoadSpriteSrc,
    LoadSpriteOpt,
    GameObj,
    GameObjCore,
    Comp,
    SpriteAnims,
} from "./types"


export class TextureCore {
    width: number
    height: number

    constructor(w: number, h: number, opt: TextureOpt = {}) {
        this.width = w
        this.height = h
    }

    static fromImage(img: TexImageSource, gopt: any, gl: any, gc: any, opt: TextureOpt = {}): TextureCore {
        const tex = new TextureCore(0, 0, opt)
        tex.width = img.width
        tex.height = img.height
        return tex
    }
}

export class Texture extends TextureCore {

    glTex: WebGLTexture

    constructor(w: number, h: number, gopt: any, gl: any, gc: any, opt: TextureOpt = {}) {
        super(w, h, opt)

        this.glTex = gl.createTexture()
        gc.push(() => this.free(gl))
        this.bind(gl)

        if (w && h) {
            gl.texImage2D(
                gl.TEXTURE_2D,
                0, gl.RGBA,
                w,
                h,
                0,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                null,
            )
        }

        const filter = (() => {
            switch (opt.filter ?? gopt.texFilter) {
                case "linear": return gl.LINEAR
                case "nearest": return gl.NEAREST
                default: return gl.NEAREST
            }
        })()

        const wrap = (() => {
            switch (opt.wrap) {
                case "repeat": return gl.REPEAT
                case "clampToEdge": return gl.CLAMP_TO_EDGE
                default: return gl.CLAMP_TO_EDGE
            }
        })()

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap)
        this.unbind(gl)

    }

    static fromImage(img: TexImageSource, gopt: any, gl: any, gc: any, opt: TextureOpt = {}): Texture {
        const tex = new Texture(0, 0, gopt, gl, gc, opt)
        tex.bind(gl)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
        tex.width = img.width
        tex.height = img.height
        tex.unbind(gl)
        return tex
    }

    update(x: number, y: number, gl: any, img: TexImageSource) {
        this.bind(gl)
        gl.texSubImage2D(gl.TEXTURE_2D, 0, x, y, gl.RGBA, gl.UNSIGNED_BYTE, img)
        this.unbind(gl)
    }

    bind(gl: any) {
        gl.bindTexture(gl.TEXTURE_2D, this.glTex)
    }

    unbind(gl: any) {
        gl.bindTexture(gl.TEXTURE_2D, null)
    }

    free(gl: any) {
        gl.deleteTexture(this.glTex)
    }

}


export class SpriteDataCore {

    tex: TextureCore

    constructor(tex: TextureCore) {
        this.tex = tex
    }

    static from(src: LoadSpriteSrc, gopt: any, gl: any, gc: any, opt: LoadSpriteOpt = {}): Promise<SpriteDataCore> {
        return typeof src === "string"
            ? SpriteDataCore.fromURL(src, gopt, gl, gc, opt)
            : Promise.resolve(SpriteDataCore.fromImage(src, gopt, gl, gc, opt),
            )
    }

    static fromImage(data: TexImageSource, gopt: any, gl: any, gc: any, opt: LoadSpriteOpt = {}): SpriteDataCore {
        return new SpriteDataCore(
            TextureCore.fromImage(data, gopt, gl, gc, opt)
        )
    }

    static fromURL(url: string, assets: any, gopt: any, gl: any, gc: any, opt: LoadSpriteOpt = {}): Promise<SpriteDataCore> {
        return this.loadImg(url, assets).then((img) => SpriteDataCore.fromImage(img, gopt, gl, gc, opt))
    }

    // get an array of frames based on configuration on how to slice the image
    static slice(x = 1, y = 1, dx = 0, dy = 0, w = 1, h = 1): Quad[] {
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

    // wrapper around image loader to get a Promise
    static loadImg(src: string, assets: any): Promise<HTMLImageElement> {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.src = isDataURL(src) ? src : assets.urlPrefix + src
        return new Promise<HTMLImageElement>((resolve, reject) => {
            img.onload = () => resolve(img)
            img.onerror = () => reject(new Error(`Failed to load image from "${src}"`))
        })
    }
}

export class SpriteData extends SpriteDataCore {

    declare tex: Texture
    frames: Quad[] = [new Quad(0, 0, 1, 1)]
    anims: SpriteAnims = {}

    constructor(tex: Texture, frames?: Quad[], anims: SpriteAnims = {}) {
        super(tex)

        this.tex = tex
        if (frames) this.frames = frames
        this.anims = anims
    }

    static from(src: LoadSpriteSrc, gopt: any, gl: any, gc: any, opt: LoadSpriteOpt = {}): Promise<SpriteData> {
        return typeof src === "string"
            ? SpriteData.fromURL(src, gopt, gl, gc, opt)
            : Promise.resolve(SpriteData.fromImage(src, gopt, gl, gc, opt),
            )
    }

    static fromImage(data: TexImageSource, gopt: any, gl: any, gc: any, opt: LoadSpriteOpt = {}): SpriteData {
        return new SpriteData(
            Texture.fromImage(data, gopt, gl, gc, opt),
            this.slice(opt.sliceX || 1, opt.sliceY || 1),
            opt.anims ?? {},
        )
    }

    static fromURL(url: string, assets: any, gopt: any, gl: any, gc: any, opt: LoadSpriteOpt = {}): Promise<SpriteData> {
        return this.loadImg(url, assets).then((img) => SpriteData.fromImage(img, gopt, gl, gc, opt))
    }
}

export class SoundData {

    buf: AudioBuffer

    constructor(buf: AudioBuffer) {
        this.buf = buf
    }

    static fromArrayBuffer(buf: ArrayBuffer, audio: any): Promise<SoundData> {
        return new Promise((resolve, reject) =>
            audio.ctx.decodeAudioData(buf, resolve, reject),
        ).then((buf: AudioBuffer) => new SoundData(buf))
    }

    static fromURL(url: string, assets: any, audio: any): Promise<SoundData> {
        if (isDataURL(url)) {
            return SoundData.fromArrayBuffer(dataURLToArrayBuffer(url), audio)
        } else {
            return this.fetchArrayBuffer(url, assets).then((buf) => SoundData.fromArrayBuffer(buf, audio))
        }
    }

    static fetchArrayBuffer(path: string, assets: any) {
        return fetchURL(path, assets).then((res) => res.arrayBuffer())
    }
}

export class Asset<D> {
    done: boolean = false
    data: D | null = null
    error: Error | null = null
    private onLoadEvents: Event<[D]> = new Event()
    private onErrorEvents: Event<[Error]> = new Event()
    private onFinishEvents: Event<[]> = new Event()
    constructor(loader: Promise<D>) {
        loader.then((data) => {
            this.data = data
            this.onLoadEvents.trigger(data)
        }).catch((err) => {
            this.error = err
            if (this.onErrorEvents.numListeners() > 0) {
                this.onErrorEvents.trigger(err)
            } else {
                throw err
            }
        }).finally(() => {
            this.onFinishEvents.trigger()
            this.done = true
        })
    }
    static loaded<D>(data: D): Asset<D> {
        const asset = new Asset(Promise.resolve(data))
        asset.data = data
        asset.done = true
        return asset
    }
    onLoad(action: (data: D) => void) {
        this.onLoadEvents.add(action)
        return this
    }
    onError(action: (err: Error) => void) {
        this.onErrorEvents.add(action)
        return this
    }
    onFinish(action: () => void) {
        this.onFinishEvents.add(action)
        return this
    }
    then(action: (data: D) => void): Asset<D> {
        return this.onLoad(action)
    }
    catch(action: (err: Error) => void): Asset<D> {
        return this.onError(action)
    }
    finally(action: () => void): Asset<D> {
        return this.onFinish(action)
    }
}

export class AssetBucket<D> {
    assets: Map<string, Asset<D>> = new Map()
    lastUID: number = 0
    add(name: string | null, loader: Promise<D>): Asset<D> {
        // if user don't provide a name we use a generated one
        const id = name ?? (this.lastUID++ + "")
        const asset = new Asset(loader)
        this.assets.set(id, asset)
        return asset
    }
    addLoaded(name: string | null, data: D) {
        const id = name ?? (this.lastUID++ + "")
        const asset = Asset.loaded(data)
        this.assets.set(id, asset)
    }
    get(handle: string): Asset<D> | void {
        return this.assets.get(handle)
    }
    progress(): number {
        if (this.assets.size === 0) {
            return 1
        }
        let loaded = 0
        this.assets.forEach((asset) => {
            if (asset.done) {
                loaded++
            }
        })
        return loaded / this.assets.size
    }
}

export interface SpriteCurAnim {
	name: string,
	timer: number,
	loop: boolean,
	speed: number,
	pingpong: boolean,
	onEnd: () => void,
}

export class CollisionCore {
    source: GameObjCore
    target: GameObjCore
    displacement: Vec2
    resolved: boolean = false

    constructor(source: GameObjCore, target: GameObjCore, dis: Vec2, resolved = false) {
        this.source = source
        this.target = target
        this.displacement = dis
        this.resolved = resolved
    }

    reverse() {
        return new CollisionCore(
            this.target,
            this.source,
            this.displacement.scale(-1),
            this.resolved,
        )
    }
    isLeft() {
        return this.displacement.x > 0
    }
    isRight() {
        return this.displacement.x < 0
    }
    isTop() {
        return this.displacement.y > 0
    }
    isBottom() {
        return this.displacement.y < 0
    }
    preventResolve() {
        this.resolved = true
    }
}

export class Collision extends CollisionCore {
    declare source: GameObj
    declare target: GameObj

    constructor(source: GameObj, target: GameObj, dis: Vec2, resolved = false) {
        super(source, target, dis, resolved)

        this.source = source
        this.target = target
        this.displacement = dis
        this.resolved = resolved
    }

    reverse() {
        return new Collision(
            this.target,
            this.source,
            this.displacement.scale(-1),
            this.resolved,
        )
    }
}

export interface GridComp extends Comp {
    gridPos: Vec2,
    setGridPos(...args),
    moveLeft(),
    moveRight(),
    moveUp(),
    moveDown(),
}