import {
    sat, Vec2, Rect, Polygon, Line, Circle,
    Color, Mat4, Quad, RNG, quad, rgb, hsl2rgb,
    rand, randi, randSeed, chance, choose, lerp, map,
    mapc, wave, testLineLine, testRectRect,
    testRectLine, testRectPoint, testPolygonPoint,
    deg2rad, rad2deg, easings,
} from "./math"

import {
    download, onLoad, calcTransform,
    downloadText, downloadJSON, downloadBlob,
    uid, loadProgress, anchorPt, getBitmapFont, getShader
} from "./utils"

import {
    GridComp, gfxCoreType, gameCoreType, DebugCore, GameCoreObj, FontData, BitmapFontData, ShaderData,
    KaboomCoreCtx, KaboomOpt, EventController, SceneID, SceneDef, CompList,
    Comp, Tag, PosCoreComp, ScaleComp, RotateComp, ColorComp, OpacityComp, Anchor,
    AnchorComp, ZComp, FollowCompCore, MoveComp, AreaCompOpt, AreaCompCore,
    RectCompCore, RectCompOpt,
    UVQuadCompCore, CircleCompCore, OutlineComp, TimerComp, BodyCompCore, BodyCompOpt, FixedComp,
    StayComp, HealthComp, LifespanComp, LifespanCompOpt, StateComp, LevelCompCore, LevelOpt,
    Shape, DoubleJumpComp, TimerController, TweenController,
    assetsCoreType, gcType, appCoreType
} from "./types"

import {
    VERSION, ASCII_CHARS, DEF_JUMP_FORCE, MAX_VEL, DEF_ANCHOR,
    LOG_MAX, COMP_DESC, COMP_EVENTS, DEF_HASH_GRID_SIZE
} from "./constants"

import { EventHandler } from "./classes/EventHandler"
import { IDList } from "./classes/IDList"
import { CollisionCore } from "./classes/Collision"
import { KaboomEvent } from "./classes/KaboomEvent"
/*
import { SpriteData } from "./classes/SpriteData"
import { SoundData } from "./classes/SoundData"
import { AssetData } from "./classes/AssetData"
import { ButtonState } from "./classes/ButtonState"
*/

import FPSCounter from "./fps"
import Timer from "./timer"

// only exports one kaboom() which contains all the state
export default (gopt: KaboomOpt = {}): KaboomCoreCtx => {
    const gc: gcType = []

    const app: appCoreType = (() => {
        return {
            // total time elapsed
            time: 0,
            // real total time elapsed (including paused time)
            realTime: 0,
            // if we should skip next dt, to prevent the massive dt surge if user switch to another tab for a while and comeback
            skipTime: false,
            // how much time last frame took
            dt: 0.0,
            // total frames elapsed
            numFrames: 0,

            // requestAnimationFrame id
            loopID: null,
            // if our game loop is currently stopped / paused
            stopped: false,
            paused: false,
        }
    })()

    const assets: assetsCoreType = {
        // prefix for when loading from a url
        urlPrefix: "",
        // if we finished initially loading all assets
        loaded: false,
    }

    const gfx: gfxCoreType = (() => {
        return {
            // local vertex / index buffer queue
            vqueue: [],
            iqueue: [],

            transform: new Mat4(),
            transformStack: [],

            width: gopt.width,
            height: gopt.height,
        }
    })()

    const game: gameCoreType = {

        // general events
        ev: new EventHandler(),
        // object events
        objEvents: new EventHandler(),

        // root game object
        root: make([]),

        // misc
        gravity: 0,
        scenes: {},

        // on screen log
        logs: [],
    }

    // global load path prefix
    function loadRoot(path?: string): string {
        if (path !== undefined) {
            assets.urlPrefix = path
        }
        return assets.urlPrefix
    }

    const debug: DebugCore = {
        inspect: false,
        timeScale: 1,
        showLog: true,
        numFrames: () => app.numFrames,
        stepFrame: updateFrame,
        clearLog: () => game.logs = [],
        log: (msg) => {
            const max = gopt.logMax ?? LOG_MAX
            game.logs.unshift(`${`[${time().toFixed(2)}].time `}[${msg?.toString ? msg.toString() : msg}].${msg instanceof Error ? "error" : "info"}`)
            if (game.logs.length > max) {
                game.logs = game.logs.slice(0, max)
            }
        },
        error: (msg) => debug.log(new Error(msg.toString ? msg.toString() : msg as string)),
        curRecording: null,
        get paused() {
            return app.paused
        },
        set paused(v) {
            app.paused = v
        },
    }

    function pushMatrix(m: Mat4) {
        gfx.transform = m.clone()
    }

    // get game width
    function width(): number {
        return gfx.width
    }

    // get game height
    function height(): number {
        return gfx.height
    }

    function time(): number {
        return app.time
    }

    function dt() {
        return app.dt * debug.timeScale
    }

    function make<T>(comps: CompList<T>): GameCoreObj<T> {

        const compStates = new Map()
        const customState = {}
        const ev = new EventHandler()

        // TODO: "this" should be typed here
        const obj = {

            id: uid(),
            // TODO: a nice way to hide / pause when add()-ing
            hidden: false,
            paused: false,
            transform: new Mat4(),
            children: [],
            parent: null,

            add<T2>(a: CompList<T2> | GameCoreObj<T2>): GameCoreObj<T2> {
                const obj = (() => {
                    if (Array.isArray(a)) {
                        return make(a)
                    }
                    if (a.parent) {
                        throw new Error("Cannot add a game obj that already has a parent.")
                    }
                    return a
                })()
                obj.parent = this
                obj.transform = calcTransform(obj)
                this.children.push(obj)
                obj.trigger("add", this)
                game.ev.trigger("add", this)
                return obj
            },

            readd(obj: GameCoreObj): GameCoreObj {
                const idx = this.children.indexOf(obj)
                if (idx !== -1) {
                    this.children.splice(idx, 1)
                    this.children.push(obj)
                }
                return obj
            },

            remove(obj: GameCoreObj): void {
                const idx = this.children.indexOf(obj)
                if (idx !== -1) {
                    obj.parent = null
                    obj.trigger("destroy")
                    game.ev.trigger("destroy", obj)
                    this.children.splice(idx, 1)
                }
            },

            removeAll(tag: Tag) {
                this.get(tag).forEach((obj) => this.remove(obj))
            },

            update() {
                if (this.paused) return
                this.get().forEach((child) => child.update())
                this.trigger("update")
            },

            // use a comp, or tag
            use(comp: Comp | Tag) {

                if (!comp) {
                    return
                }

                // tag
                if (typeof comp === "string") {
                    return this.use({
                        id: comp,
                    })
                }

                // clear if overwrite
                if (comp.id) {
                    this.unuse(comp.id)
                    compStates.set(comp.id, {
                        cleanups: [],
                    })
                }

                // state source location
                const state = comp.id ? compStates.get(comp.id) : customState
                const cleanups = comp.id ? state.cleanups : []

                // check for component dependencies
                const checkDeps = () => {
                    if (comp.require) {
                        for (const dep of comp.require) {
                            if (!this.c(dep)) {
                                throw new Error(`Component "${comp.id}" requires component "${dep}"`)
                            }
                        }
                    }
                }

                if (comp.destroy) {
                    cleanups.push(comp.destroy)
                }

                if (comp.require && !this.exists() && state.cleanups) {
                    cleanups.push(this.on("add", checkDeps))
                }

                for (const k in comp) {

                    if (COMP_DESC.has(k)) {
                        continue
                    }

                    // event / custom method
                    if (typeof comp[k] === "function") {
                        const func = comp[k].bind(this)
                        if (COMP_EVENTS.has(k)) {
                            cleanups.push(this.on(k, func))
                            state[k] = func
                            // don't bind to game object if it's an event
                            continue
                        } else {
                            state[k] = func
                        }
                    } else {
                        state[k] = comp[k]
                    }

                    if (this[k] === undefined) {
                        // assign comp fields to game obj
                        Object.defineProperty(this, k, {
                            get: () => state[k],
                            set: (val) => state[k] = val,
                            configurable: true,
                            enumerable: true,
                        })
                    } else {
                        throw new Error(`Duplicate component property: "${k}"`)
                    }

                }

                // manually trigger add event if object already exist
                if (this.exists()) {
                    checkDeps()
                    if (comp.add) {
                        comp.add.call(this)
                    }
                }

            },

            unuse(id: Tag) {
                if (compStates.has(id)) {
                    const comp = compStates.get(id)
                    comp.cleanups.forEach((e) => e.cancel())
                    for (const k in comp) {
                        delete comp[k]
                    }
                }
                compStates.delete(id)
            },

            c(id: Tag): Comp {
                return compStates.get(id)
            },

            // TODO: cache sorted list? update each frame?
            get(t?: Tag | Tag[]): GameCoreObj[] {
                return this.children
                    .filter((child) => t ? child.is(t) : true)
                    .sort((o1, o2) => (o1.z ?? 0) - (o2.z ?? 0))
            },

            getAll(t?: Tag | Tag[]): GameCoreObj[] {
                return this.children
                    .sort((o1, o2) => (o1.z ?? 0) - (o2.z ?? 0))
                    .flatMap((child) => [child, ...child.getAll(t)])
                    .filter((child) => t ? child.is(t) : true)
            },

            isAncestorOf(obj: GameCoreObj) {
                if (!obj.parent) {
                    return false
                }
                return obj.parent === this || this.isAncestorOf(obj.parent)
            },

            exists(): boolean {
                return game.root.isAncestorOf(this)
            },

            is(tag: Tag | Tag[]): boolean {
                if (tag === "*") {
                    return true
                }
                if (Array.isArray(tag)) {
                    for (const t of tag) {
                        if (!this.c(t)) {
                            return false
                        }
                    }
                    return true
                } else {
                    return this.c(tag) != null
                }
            },

            on(name: string, action: (...args) => void): EventController {
                return ev.on(name, action.bind(this))
            },

            trigger(name: string, ...args): void {
                ev.trigger(name, ...args)
                game.objEvents.trigger(name, this, ...args)
            },

            destroy() {
                if (this.parent) {
                    this.parent.remove(this)
                }
            },

            inspect() {
                const info = {}
                for (const [tag, comp] of compStates) {
                    info[tag] = comp.inspect ? comp.inspect() : null
                }
                return info
            },

            onAdd(cb: () => void): EventController {
                return this.on("add", cb)
            },

            onUpdate(cb: () => void): EventController {
                return this.on("update", cb)
            },

            onDestroy(action: () => void): EventController {
                return this.on("destroy", action)
            },

            clearEvents() {
                ev.clear()
            },

        }

        for (const comp of comps) {
            obj.use(comp)
        }

        return obj as unknown as GameCoreObj<T>

    }

    // add an event to a tag
    function on(event: string, tag: Tag, cb: (obj: GameCoreObj, ...args) => void): EventController {
        if (!game.objEvents[event]) {
            game.objEvents[event] = new IDList()
        }
        return game.objEvents.on(event, (obj, ...args) => {
            if (obj.is(tag)) {
                cb(obj, ...args)
            }
        })
    }

    // add update event to a tag or global update
    const onUpdate = ((tag: Tag | (() => void), action?: (obj: GameCoreObj) => void) => {
        if (typeof tag === "function" && action === undefined) {
            const obj = add([{ update: tag }])
            return {
                get paused() {
                    return obj.paused
                },
                set paused(p) {
                    obj.paused = p
                },
                cancel: () => obj.destroy(),
            }
        } else if (typeof tag === "string") {
            return on("update", tag, action)
        }
    }) as KaboomCoreCtx["onUpdate"]

    // add draw event to a tag or global draw
    const onDraw = ((tag: Tag | (() => void), action?: (obj: GameCoreObj) => void) => {
        if (typeof tag === "function" && action === undefined) {
            const obj = add([{ draw: tag }])
            return {
                get paused() {
                    return obj.hidden
                },
                set paused(p) {
                    obj.hidden = p
                },
                cancel: () => obj.destroy(),
            }
        } else if (typeof tag === "string") {
            return on("draw", tag, action)
        }
    }) as KaboomCoreCtx["onDraw"]


    function onDestroy(tag: Tag | ((obj: GameCoreObj) => void), action?: (obj: GameCoreObj) => void) {
        if (typeof tag === "function" && action === undefined) {
            return game.ev.on("destroy", tag)
        } else if (typeof tag === "string") {
            return on("destroy", tag, action)
        }
    }

    // add an event that runs with objs with t1 collides with objs with t2
    function onCollide(
        t1: Tag,
        t2: Tag,
        f: (a: GameCoreObj, b: GameCoreObj, col?: CollisionCore) => void,
    ): EventController {
        return on("collide", t1, (a, b, col) => b.is(t2) && f(a, b, col))
    }

    // TODO: use PromiseLike?
    // add an event that'd be run after t
    function wait(time: number, action?: () => void): TimerController {
        let t = 0
        const actions = []
        if (action) actions.push(action)
        const ev = onUpdate(() => {
            t += dt()
            if (t >= time) {
                ev.cancel()
                actions.forEach((action) => action())
            }
        })
        return {
            paused: ev.paused,
            cancel: ev.cancel,
            onFinish(action) {
                actions.push(action)
            },
            then(action) {
                this.onFinish(action)
                return this
            },
        }
    }

    // add an event that's run every t seconds
    function loop(t: number, action: () => void): EventController {

        let curTimer: null | TimerController = null

        const newAction = () => {
            // TODO: should f be execute right away as loop() is called?
            action()
            curTimer = wait(t, newAction)
        }

        newAction()

        return {
            get paused() {
                return curTimer.paused
            },
            set paused(p) {
                curTimer.paused = p
            },
            cancel: () => curTimer.cancel(),
        }

    }

    // get / set gravity
    function gravity(g?: number): number {
        if (g !== undefined) {
            game.gravity = g
        }
        return game.gravity
    }

    // TODO: manage global velocity here?
    function pos(...args): PosCoreComp {

        return {

            id: "pos",
            pos: new Vec2(...args),

            moveBy(...args) {
                this.pos = this.pos.add(new Vec2(...args))
            },

            // move with velocity (pixels per second)
            move(...args) {
                const delta = dt()
                this.moveBy(new Vec2(...args).scale(new Vec2(delta, delta)))
            },

            // move to a destination, with optional speed
            moveTo(...args) {
                if (typeof args[0] === "number" && typeof args[1] === "number") {
                    return this.moveTo(new Vec2(args[0], args[1]), args[2])
                }
                const dest = args[0]
                const speed = args[1]
                if (speed === undefined) {
                    this.pos = new Vec2(dest)
                    return
                }
                const diff = dest.sub(this.pos)
                if (diff.len() <= speed * dt()) {
                    this.pos = new Vec2(dest)
                    return
                }
                this.move(diff.unit().scale(speed))
            },

            inspect() {
                return `(${Math.round(this.pos.x)}, ${Math.round(this.pos.y)})`
            },
        }

    }

    // TODO: allow single number assignment
    function scale(...args): ScaleComp {
        if (args.length === 0) {
            return scale(1)
        }
        return {
            id: "scale",
            scale: new Vec2(...args),
            scaleTo(...args) {
                this.scale = new Vec2(...args)
            },
            inspect() {
                if (typeof this.scale === "number") {
                    return `${toFixed(this.scale, 2)}`
                } else {
                    return `(${toFixed(this.scale.x, 2)}, ${toFixed(this.scale.y, 2)})`
                }
            },
        }
    }

    function rotate(r: number): RotateComp {
        return {
            id: "rotate",
            angle: r ?? 0,
            rotate(angle: number) {
                this.rotateBy(angle * dt())
            },
            rotateBy(angle: number) {
                this.angle += angle
            },
            inspect() {
                return `${Math.round(this.angle)}`
            },
        }
    }

    function color(...args): ColorComp {
        return {
            id: "color",
            color: rgb(...args),
            inspect() {
                return this.color.toString()
            },
        }
    }

    function toFixed(n: number, f: number) {
        return Number(n.toFixed(f))
    }

    // TODO: fadeIn here?
    function opacity(a: number): OpacityComp {
        return {
            id: "opacity",
            opacity: a ?? 1,
            inspect() {
                return `${toFixed(this.opacity, 1)}`
            },
            fadeOut(time, easeFunc = easings.linear) {
                return tween(this.opacity, 0, time, (a) => this.opacity = a, easeFunc)
            },
        }
    }

    function anchor(o: Anchor | Vec2): AnchorComp {
        if (!o) {
            throw new Error("Please define an anchor")
        }
        return {
            id: "anchor",
            anchor: o,
            inspect() {
                if (typeof this.anchor === "string") {
                    return this.anchor
                } else {
                    return this.anchor.toString()
                }
            },
        }
    }

    function z(z: number): ZComp {
        return {
            id: "z",
            z: z,
            inspect() {
                return `${this.z}`
            },
        }
    }

    function follow(obj: GameCoreObj, offset?: Vec2): FollowCompCore {
        return {
            id: "follow",
            require: ["pos"],
            follow: {
                obj: obj,
                offset: offset ?? new Vec2(0),
            },
            add(this: GameCoreObj<FollowCompCore | PosCoreComp>) {
                if (obj.exists()) {
                    this.pos = this.follow.obj.pos.add(this.follow.offset)
                }
            },
            update(this: GameCoreObj<FollowCompCore | PosCoreComp>) {
                if (obj.exists()) {
                    this.pos = this.follow.obj.pos.add(this.follow.offset)
                }
            },
        }
    }

    function move(dir: number | Vec2, speed: number): MoveComp {
        const d = typeof dir === "number" ? Vec2.fromAngle(dir) : dir.unit()
        return {
            id: "move",
            require: ["pos"],
            update(this: GameCoreObj<PosCoreComp>) {
                this.move(d.scale(speed))
            },
        }
    }

    function area(opt: AreaCompOpt = {}): AreaCompCore {

        const events: Array<EventController> = []

        return {

            id: "area",
            colliding: {},
            collisionIgnore: opt.collisionIgnore ?? [],

            add(this: GameCoreObj<AreaCompCore>) {
                events.push(this.onCollideUpdate((obj, col) => {
                    if (!this.colliding[obj.id]) {
                        this.trigger("collide", obj, col)
                    }
                    this.colliding[obj.id] = col
                }))
            },

            update(this: GameCoreObj) {
                for (const id in this.colliding) {
                    const col = this.colliding[id]
                    if (!this.checkCollision(col.target as GameCoreObj<AreaCompCore>)) {
                        delete this.colliding[id]
                        this.trigger("collideEnd", col.target, col)
                    }
                }
            },

            destroy() {
                events.forEach((e) => e.cancel())
            },

            area: {
                shape: opt.shape ?? null,
                scale: opt.scale ?? new Vec2(1),
                offset: opt.offset ?? new Vec2(0),
                cursor: opt.cursor ?? null,
            },

            checkCollision(this: GameCoreObj, other: GameCoreObj<AreaCompCore>) {
                if (this === other || !other.area || !other.exists()) {
                    return null
                }
                // if (this.colliding[other.id]) {
                // return this.colliding[other.id]
                // }
                const a1 = this.worldArea()
                const a2 = other.worldArea()
                return sat(a1, a2)
            },

            isColliding(other: GameCoreObj<AreaCompCore>) {
                const res = this.checkCollision(other)
                return res && !res.isZero()
            },

            isTouching(other) {
                return Boolean(this.checkCollision(other))
            },

            onClick(this: GameCoreObj, f: () => void): EventController {
                return this.onUpdate(() => {
                    if (this.isClicked()) {
                        f()
                    }
                })
            },

            onCollide(
                this: GameCoreObj,
                tag: Tag | ((obj: GameCoreObj, col?: CollisionCore) => void),
                cb?: (obj: GameCoreObj, col?: CollisionCore) => void,
            ): EventController {
                if (typeof tag === "function" && cb === undefined) {
                    return this.on("collide", tag)
                } else if (typeof tag === "string") {
                    return this.onCollide((obj, col) => {
                        if (obj.is(tag)) {
                            cb(obj, col)
                        }
                    })
                }
            },

            onCollideUpdate(
                this: GameCoreObj<AreaCompCore>,
                tag: Tag | ((obj: GameCoreObj, col?: CollisionCore) => void),
                cb?: (obj: GameCoreObj, col?: CollisionCore) => void,
            ): EventController {
                if (typeof tag === "function" && cb === undefined) {
                    return this.on("collideUpdate", tag)
                } else if (typeof tag === "string") {
                    return this.on("collideUpdate", (obj, col) => obj.is(tag) && cb(obj, col))
                }
            },

            onCollideEnd(
                this: GameCoreObj<AreaCompCore>,
                tag: Tag | ((obj: GameCoreObj) => void),
                cb?: (obj: GameCoreObj) => void,
            ): EventController {
                if (typeof tag === "function" && cb === undefined) {
                    return this.on("collideEnd", tag)
                } else if (typeof tag === "string") {
                    return this.on("collideEnd", (obj) => obj.is(tag) && cb(obj))
                }
            },

            hasPoint(pt: Vec2): boolean {
                return testPolygonPoint(this.worldArea(), pt)
            },

            // push an obj out of another if they're overlapped
            pushOut(this: GameCoreObj<AreaCompCore | PosCoreComp>, obj: GameCoreObj<AreaCompCore>) {
                const res = this.checkCollision(obj)
                if (res) {
                    this.pos = this.pos.add(res)
                }
            },

            // TODO: recursive
            // push object out of other solid objects
            pushOutAll() {
                game.root.getAll().forEach(this.pushOut)
            },

            localArea(this: GameCoreObj<AreaCompCore | { renderArea(): Shape }>): Shape {
                return this.area.shape
                    ? this.area.shape
                    : this.renderArea()
            },

            // TODO: cache
            worldArea(this: GameCoreObj<AreaCompCore | AnchorComp>): Polygon {

                const localArea = this.localArea()

                if (!(localArea instanceof Polygon || localArea instanceof Rect)) {
                    throw new Error("Only support polygon and rect shapes for now")
                }

                let transform = this.transform
                    .scale(new Vec2(this.area.scale ?? 1))
                    .translate(this.area.offset)

                if (localArea instanceof Rect) {
                    const bbox = localArea.bbox()
                    const offset = anchorPt(this.anchor || DEF_ANCHOR)
                        .add(new Vec2(1, 1))
                        .scale(-0.5)
                        .scale(new Vec2(bbox.width, bbox.height))
                    transform = transform.translate(offset)
                }

                return localArea.transform(transform) as Polygon

            },
        }
    }

    function rect(w: number, h: number, opt: RectCompOpt = {}): RectCompCore {
        return {
            id: "rect",
            width: w,
            height: h,
            radius: opt.radius || 0,
            renderArea() {
                return new Rect(new Vec2(0), this.width, this.height)
            },
            inspect() {
                return `${Math.ceil(this.width)}, ${Math.ceil(this.height)}`
            },
        }
    }

    function uvquad(w: number, h: number): UVQuadCompCore {
        return {
            id: "rect",
            width: w,
            height: h,
            renderArea() {
                return new Rect(new Vec2(0), this.width, this.height)
            },
            inspect() {
                return `${Math.ceil(this.width)}, ${Math.ceil(this.height)}`
            },
        }
    }

    function circle(radius: number): CircleCompCore {
        return {
            id: "circle",
            radius: radius,
            renderArea() {
                return new Circle(new Vec2(0), this.radius)
            },
            inspect() {
                return `${Math.ceil(this.radius)}`
            },
        }
    }

    function outline(width: number = 1, color: Color = rgb([0, 0, 0])): OutlineComp {
        return {
            id: "outline",
            outline: {
                width,
                color,
            },
        }
    }

    function timer(time?: number, action?: () => void): TimerComp {
        const timers: IDList<Timer> = new IDList()
        if (time && action) {
            timers.pushd(new Timer(time, action))
        }
        return {
            id: "timer",
            wait(time: number, action: () => void): TimerController {
                const actions = [action]
                const timer = new Timer(time, () => actions.forEach((f) => f()))
                const cancel = timers.pushd(timer)
                return {
                    get paused() {
                        return timer.paused
                    },
                    set paused(p) {
                        timer.paused = p
                    },
                    cancel: cancel,
                    onFinish(action) {
                        actions.push(action)
                    },
                    then(action) {
                        this.onFinish(action)
                        return this
                    },
                }
            },
            update() {
                timers.forEach((timer, id) => {
                    if (timer.tick(dt())) {
                        timers.delete(id)
                    }
                })
            },
        }
    }

    // TODO: land on wall
    function body(opt: BodyCompOpt = {}): BodyCompCore {

        let velY = 0
        let curPlatform: GameCoreObj<PosCoreComp | AreaCompCore | BodyCompCore> | null = null
        let lastPlatformPos = null
        let wantFall = false
        const events: Array<EventController> = []

        return {

            id: "body",
            require: ["pos", "area"],
            jumpForce: opt.jumpForce ?? DEF_JUMP_FORCE,
            gravityScale: opt.gravityScale ?? 1,
            isStatic: opt.isStatic ?? false,
            mass: opt.mass ?? 0,

            add(this: GameCoreObj<BodyCompCore | AreaCompCore>) {

                // TODO
                // static vs static: don't resolve
                // static vs non-static: always resolve non-static
                // non-static vs non-static: resolve the first one
                events.push(this.onCollideUpdate((other, col) => {

                    if (!other.is("body")) {
                        return
                    }

                    if (col.resolved) {
                        return
                    }

                    if (this.isStatic && other.isStatic) {
                        return
                    }

                    // TODO: if both not static, use mass, or use velocity?

                    // resolve the non static one
                    const col2 = (!this.isStatic && other.isStatic) ? col : col.reverse()
                    col2.source.trigger("beforePhysicsResolve", col2)
                    col2.target.trigger("beforePhysicsResolve", col2.reverse())

                    // user can mark 'resolved' in beforePhysicsResolve to stop a resolution
                    if (col.resolved) {
                        return
                    }

                    col2.source.pos = col2.source.pos.add(col2.displacement)
                    // TODO: update all children transform?
                    col2.source.transform = calcTransform(col2.source)
                    col.resolved = true
                    col2.source.trigger("physicsResolve", col2)
                    col2.target.trigger("physicsResolve", col2.reverse())

                }))

                events.push(this.onPhysicsResolve((col) => {
                    if (game.gravity) {
                        if (col.isBottom() && this.isFalling()) {
                            velY = 0
                            curPlatform = col.target as GameCoreObj<PosCoreComp | BodyCompCore | AreaCompCore>
                            lastPlatformPos = col.target.pos
                            if (wantFall) {
                                wantFall = false
                            } else {
                                this.trigger("ground", curPlatform)
                            }
                        } else if (col.isTop() && this.isJumping()) {
                            velY = 0
                            this.trigger("headbutt", col.target)
                        }
                    }
                }))

            },

            update(this: GameCoreObj<PosCoreComp | BodyCompCore | AreaCompCore>) {

                if (!game.gravity) {
                    return
                }

                if (this.isStatic) {
                    return
                }

                if (wantFall) {
                    curPlatform = null
                    lastPlatformPos = null
                    this.trigger("fallOff")
                    wantFall = false
                }

                if (curPlatform) {
                    if (
                        !this.isTouching(curPlatform)
                        || !curPlatform.exists()
                        || !curPlatform.is("body")
                    ) {
                        wantFall = true
                    } else {
                        if (
                            !curPlatform.pos.eq(lastPlatformPos)
                            && opt.stickToPlatform !== false
                        ) {
                            this.moveBy(curPlatform.pos.sub(lastPlatformPos))
                        }
                        lastPlatformPos = curPlatform.pos
                        return
                    }
                }

                const prevVelY = velY
                velY += game.gravity * this.gravityScale * dt()
                velY = Math.min(velY, opt.maxVelocity ?? MAX_VEL)
                if (prevVelY < 0 && velY >= 0) {
                    this.trigger("fall")
                }
                this.move(0, velY)

            },

            destroy() {
                events.forEach((e) => e.cancel())
            },

            onPhysicsResolve(this: GameCoreObj, action) {
                return this.on("physicsResolve", action)
            },

            onBeforePhysicsResolve(this: GameCoreObj, action) {
                return this.on("beforePhysicsResolve", action)
            },

            curPlatform(): GameCoreObj | null {
                return curPlatform
            },

            isGrounded() {
                return curPlatform !== null
            },

            isFalling(): boolean {
                return velY > 0
            },

            isJumping(): boolean {
                return velY < 0
            },

            jump(force: number) {
                curPlatform = null
                lastPlatformPos = null
                velY = -force || -this.jumpForce
            },

            onGround(this: GameCoreObj, action: () => void): EventController {
                return this.on("ground", action)
            },

            onFall(this: GameCoreObj, action: () => void): EventController {
                return this.on("fall", action)
            },

            onFallOff(this: GameCoreObj, action: () => void): EventController {
                return this.on("fallOff", action)
            },

            onHeadbutt(this: GameCoreObj, action: () => void): EventController {
                return this.on("headbutt", action)
            },

        }

    }

    function doubleJump(numJumps: number = 2): DoubleJumpComp {
        let jumpsLeft = numJumps
        const events = []
        return {
            id: "doubleJump",
            require: ["body"],
            numJumps: numJumps,
            add(this: GameCoreObj<BodyCompCore | DoubleJumpComp>) {
                events.push(this.onGround(() => {
                    jumpsLeft = this.numJumps
                }))
            },
            destroy() {
                events.forEach((e) => e.cancel())
            },
            doubleJump(this: GameCoreObj<BodyCompCore | DoubleJumpComp>, force?: number) {
                if (jumpsLeft <= 0) {
                    return
                }
                if (jumpsLeft < this.numJumps) {
                    this.trigger("doubleJump")
                }
                jumpsLeft--
                this.jump(force)
            },
            onDoubleJump(this: GameCoreObj, action: () => void): EventController {
                return this.on("doubleJump", action)
            },
            inspect(this: GameCoreObj<BodyCompCore | DoubleJumpComp>) {
                return `${jumpsLeft}`
            },
        }
    }

    // TODO: all children should be fixed
    function fixed(): FixedComp {
        return {
            id: "fixed",
            fixed: true,
        }
    }

    function stay(scenesToStay?: string[]): StayComp {
        return {
            id: "stay",
            stay: true,
            scenesToStay: scenesToStay,
        }
    }

    function health(hp: number): HealthComp {
        if (hp == null) {
            throw new Error("health() requires the initial amount of hp")
        }
        return {
            id: "health",
            hurt(this: GameCoreObj, n: number = 1) {
                this.setHP(hp - n)
                this.trigger("hurt")
            },
            heal(this: GameCoreObj, n: number = 1) {
                this.setHP(hp + n)
                this.trigger("heal")
            },
            hp(): number {
                return hp
            },
            setHP(this: GameCoreObj, n: number) {
                hp = n
                if (hp <= 0) {
                    this.trigger("death")
                }
            },
            onHurt(this: GameCoreObj, action: () => void): EventController {
                return this.on("hurt", action)
            },
            onHeal(this: GameCoreObj, action: () => void): EventController {
                return this.on("heal", action)
            },
            onDeath(this: GameCoreObj, action: () => void): EventController {
                return this.on("death", action)
            },
            inspect() {
                return `${hp}`
            },
        }
    }

    function lifespan(time: number, opt: LifespanCompOpt = {}): LifespanComp {
        if (time == null) {
            throw new Error("lifespan() requires time")
        }
        const fade = opt.fade ?? 0
        return {
            id: "lifespan",
            async add(this: GameCoreObj<OpacityComp>) {
                await wait(time)
                // TODO: this secretively requires opacity comp, make opacity on every game obj?
                if (fade > 0 && this.opacity) {
                    await tween(this.opacity, 0, fade, (a) => this.opacity = a, easings.linear)
                }
                this.destroy()
            },
        }
    }

    function state(
        initState: string,
        stateList?: string[],
        transitions?: Record<string, string | string[]>,
    ): StateComp {

        if (!initState) {
            throw new Error("state() requires an initial state")
        }

        const events = {}

        function initStateEvents(state: string) {
            if (!events[state]) {
                events[state] = {
                    enter: new KaboomEvent(),
                    end: new KaboomEvent(),
                    update: new KaboomEvent(),
                    draw: new KaboomEvent(),
                }
            }
        }

        function on(event, state, action) {
            initStateEvents(state)
            return events[state][event].add(action)
        }

        function trigger(event, state, ...args) {
            initStateEvents(state)
            events[state][event].trigger(...args)
        }

        let didFirstEnter = false

        return {

            id: "state",
            state: initState,

            enterState(state: string, ...args) {

                didFirstEnter = true

                if (stateList && !stateList.includes(state)) {
                    throw new Error(`State not found: ${state}`)
                }

                const oldState = this.state

                if (transitions) {

                    // check if the transition is legal, if transition graph is defined
                    if (!transitions?.[oldState]) {
                        return
                    }

                    const available = typeof transitions[oldState] === "string"
                        ? [transitions[oldState]]
                        : transitions[oldState] as string[]

                    if (!available.includes(state)) {
                        throw new Error(`Cannot transition state from "${oldState}" to "${state}". Available transitions: ${available.map((s) => `"${s}"`).join(", ")}`)
                    }

                }

                trigger("end", oldState, ...args)
                this.state = state
                trigger("enter", state, ...args)
                trigger("enter", `${oldState} -> ${state}`, ...args)

            },

            onStateTransition(from: string, to: string, action: () => void): EventController {
                return on("enter", `${from} -> ${to}`, action)
            },

            onStateEnter(state: string, action: () => void): EventController {
                return on("enter", state, action)
            },

            onStateUpdate(state: string, action: () => void): EventController {
                return on("update", state, action)
            },

            onStateDraw(state: string, action: () => void): EventController {
                return on("draw", state, action)
            },

            onStateEnd(state: string, action: () => void): EventController {
                return on("end", state, action)
            },

            update() {
                // execute the enter event for initState
                if (!didFirstEnter) {
                    trigger("enter", initState)
                    didFirstEnter = true
                }
                trigger("update", this.state)
            },

            draw() {
                trigger("draw", this.state)
            },

            inspect() {
                return this.state
            },

        }

    }

    function fadeIn(time: number = 1): Comp {
        let t = 0
        let done = false
        return {
            require: ["opacity"],
            add(this: GameCoreObj<OpacityComp>) {
                this.opacity = 0
            },
            update(this: GameCoreObj<OpacityComp>) {
                if (done) return
                t += dt()
                this.opacity = map(t, 0, time, 0, 1)
                if (t >= time) {
                    this.opacity = 1
                    done = true
                }
            },
        }
    }

    function scene(id: SceneID, def: SceneDef) {
        game.scenes[id] = def
    }

    function go(id: SceneID, ...args) {

        if (!game.scenes[id]) {
            throw new Error(`Scene not found: ${id}`)
        }

        game.ev.onOnce("frameEnd", () => {

            game.ev = new EventHandler()
            game.objEvents = new EventHandler()

            game.root.get().forEach((obj) => {
                if (
                    !obj.stay
                    || (obj.scenesToStay && !obj.scenesToStay.includes(id))
                ) {
                    game.root.remove(obj)
                }
            })

            game.root.clearEvents()

            game.gravity = 0
            game.scenes[id](...args)
        })

    }

    function getData<T>(key: string, def?: T): T {
        try {
            return JSON.parse(window.localStorage[key])
        } catch {
            if (def) {
                setData(key, def)
                return def
            } else {
                return null
            }
        }
    }

    function setData(key: string, data: any) {
        window.localStorage[key] = JSON.stringify(data)
    }

    function grid(level: GameCoreObj<LevelCompCore>, p: Vec2): GridComp {

        return {

            id: "grid",
            gridPos: p.clone(),

            setGridPos(this: GameCoreObj<GridComp | PosCoreComp>, ...args) {
                const p = new Vec2(...args)
                this.gridPos = p.clone()
                this.pos = new Vec2(
                    this.gridPos.x * level.gridWidth(),
                    this.gridPos.y * level.gridHeight(),
                )
            },

            moveLeft() {
                this.setGridPos(this.gridPos.add(new Vec2(-1, 0)))
            },

            moveRight() {
                this.setGridPos(this.gridPos.add(new Vec2(1, 0)))
            },

            moveUp() {
                this.setGridPos(this.gridPos.add(new Vec2(0, -1)))
            },

            moveDown() {
                this.setGridPos(this.gridPos.add(new Vec2(0, 1)))
            },

        }

    }

    function addLevel(map: string[], opt: LevelOpt): GameCoreObj<PosCoreComp | LevelCompCore> {

        if (!opt.width || !opt.height) {
            throw new Error("Must provide level grid width & height.")
        }

        const level = add([
            pos(opt.pos ?? new Vec2(0)),
        ])

        let maxRowLen = 0

        const levelComp: LevelCompCore = {

            id: "level",

            gridWidth() {
                return opt.width
            },

            gridHeight() {
                return opt.height
            },

            getPos(...args): Vec2 {
                const p = new Vec2(...args)
                return new Vec2(
                    p.x * opt.width,
                    p.y * opt.height,
                )
            },

            spawn(this: GameCoreObj<LevelCompCore>, key: string, ...args): GameCoreObj {

                const p = new Vec2(...args)

                const comps = (() => {
                    if (opt[key]) {
                        if (typeof opt[key] !== "function") {
                            throw new Error("Level symbol def must be a function returning a component list")
                        }
                        return opt[key](p)
                    } else if (opt.any) {
                        return opt.any(key, p)
                    }
                })()

                if (!comps) {
                    return
                }

                const posComp = new Vec2(
                    p.x * opt.width,
                    p.y * opt.height,
                )

                for (const comp of comps) {
                    if (comp.id === "pos") {
                        posComp.x += comp.pos.x
                        posComp.y += comp.pos.y
                        break
                    }
                }

                comps.push(pos(posComp))
                comps.push(grid(this, p))

                return level.add(comps)

            },

            levelWidth() {
                return maxRowLen * opt.width
            },

            levelHeight() {
                return map.length * opt.height
            },

        }

        level.use(levelComp)

        map.forEach((row, i) => {

            const keys = row.split("")

            maxRowLen = Math.max(keys.length, maxRowLen)

            keys.forEach((key, j) => {
                level.spawn(key, new Vec2(j, i))
            })

        })

        return level

    }

    function destroy(obj: GameCoreObj) {
        obj.destroy()
    }

    // aliases for root game obj operations
    const add = game.root.add.bind(game.root)
    const readd = game.root.readd.bind(game.root)
    const destroyAll = game.root.removeAll.bind(game.root)
    //const get = game.root.get.bind(game.root)
    const getAll = game.root.getAll.bind(game.root)

    // TODO: expose this
    function boom(speed: number = 2, size: number = 1): Comp {
        let time = 0
        return {
            id: "boom",
            require: ["scale"],
            update(this: GameCoreObj<ScaleComp>) {
                const s = Math.sin(time * speed) * size
                if (s < 0) {
                    this.destroy()
                }
                this.scale = new Vec2(s)
                time += dt()
            },
        }
    }

    function updateFrame() {
        // update every obj
        game.root.update()
    }

    function checkFrame() {

        // TODO: persistent grid?
        // start a spatial hash grid for more efficient collision detection
        const grid: Record<number, Record<number, GameCoreObj<AreaCompCore>[]>> = {}
        const cellSize = gopt.hashGridSize || DEF_HASH_GRID_SIZE

        // current transform
        let tr = new Mat4()

        // a local transform stack
        const stack = []

        function checkObj(obj: GameCoreObj) {

            stack.push(tr)

            // Update object transform here. This will be the transform later used in rendering.
            if (obj.pos) tr = tr.translate(obj.pos)
            if (obj.scale) tr = tr.scale(obj.scale)
            if (obj.angle) tr = tr.rotateZ(obj.angle)
            obj.transform = tr.clone()

            if (obj.c("area") && !obj.paused) {

                // TODO: only update worldArea if transform changed
                const aobj = obj as GameCoreObj<AreaCompCore>
                const area = aobj.worldArea()
                const bbox = area.bbox()

                // Get spatial hash grid coverage
                const xmin = Math.floor(bbox.pos.x / cellSize)
                const ymin = Math.floor(bbox.pos.y / cellSize)
                const xmax = Math.ceil((bbox.pos.x + bbox.width) / cellSize)
                const ymax = Math.ceil((bbox.pos.y + bbox.height) / cellSize)

                // Cache objs that are already checked
                const checked = new Set()

                // insert & check against all covered grids
                for (let x = xmin; x <= xmax; x++) {
                    for (let y = ymin; y <= ymax; y++) {
                        if (!grid[x]) {
                            grid[x] = {}
                            grid[x][y] = [aobj]
                        } else if (!grid[x][y]) {
                            grid[x][y] = [aobj]
                        } else {
                            const cell = grid[x][y]
                            for (const other of cell) {
                                if (!other.exists()) {
                                    continue
                                }
                                if (checked.has(other.id)) {
                                    continue
                                }
                                // TODO: is this too slow
                                for (const tag of aobj.collisionIgnore) {
                                    if (other.is(tag)) {
                                        continue
                                    }
                                }
                                for (const tag of other.collisionIgnore) {
                                    if (aobj.is(tag)) {
                                        continue
                                    }
                                }
                                const res = aobj.checkCollision(other)
                                if (res && !res.isZero()) {
                                    // TODO: rehash if the object position is changed after resolution?
                                    const col1 = new CollisionCore(aobj, other, res)
                                    aobj.trigger("collideUpdate", other, col1)
                                    const col2 = col1.reverse()
                                    // resolution only has to happen once
                                    col2.resolved = col1.resolved
                                    other.trigger("collideUpdate", aobj, col2)
                                }
                                checked.add(other.id)
                            }
                            cell.push(aobj)
                        }
                    }
                }

            }

            obj.get().forEach(checkObj)
            tr = stack.pop()

        }

        checkObj(game.root)

    }

    function onLoadUpdate(action: (err: Error) => void) {
        game.ev.on("loading", action)
    }

    function onResize(action: (
        prevWidth: number,
        prevHeight: number,
        curWidth: number,
        curHeight: number,
    ) => void) {
        game.ev.on("resize", action)
    }

    function onError(action: (err: Error) => void) {
        game.ev.on("error", action)
    }

    function requestHeadlessFrame(f) {
        try {
            setImmediate(() => f(Date.now()))
        } catch (e) {
            console.log("Kaboom Core Loop Error")
            quit()
        }
        return Date.now()
    }

    function run(f: () => void) {
        /*
        if (app.loopID !== null) {
            cancelAnimationFrame(app.loopID)
        }
        */

        const frame = (t: number) => {

            if (app.stopped) return

            /*
            if (document.visibilityState !== "visible") {
                app.loopID = requestAnimationFrame(frame)
                return
            }
            */

            const realTime = t / 1000
            const realDt = realTime - app.realTime

            app.realTime = realTime

            if (!app.skipTime) {
                app.dt = realDt
                app.time += dt()
            }

            app.skipTime = false
            app.numFrames++

            f()

            game.ev.trigger("frameEnd")
            // app.loopID = requestAnimationFrame(frame)
            app.loopID = requestHeadlessFrame(frame)
        }
        
		app.realTime = Date.now()
		frame(app.realTime)
        //frame(0)
    }

    function quit() {

        game.ev.onOnce("frameEnd", () => {

            // stop the loop
            app.stopped = true

            // run all scattered gc events
            gc.forEach((f) => f())
        })
    }

    // TODO: tween vec2
    function tween(
        min: number,
        max: number,
        duration: number,
        setValue: (value: number) => void,
        easeFunc = easings.linear,
    ): TweenController {
        let curTime = 0
        const onFinishEvents: Array<() => void> = []
        const ev = onUpdate(() => {
            curTime += dt()
            const t = Math.min(curTime / duration, 1)
            setValue(lerp(min, max, easeFunc(t)))
            if (t === 1) {
                ev.cancel()
                setValue(max)
                onFinishEvents.forEach((action) => action())
            }
        })
        return {
            get paused() {
                return ev.paused
            },
            set paused(p) {
                ev.paused = p
            },
            onFinish(action: () => void) {
                onFinishEvents.push(action)
            },
            then(action: () => void) {
                this.onFinish(action)
                return this
            },
            cancel() {
                ev.cancel()
            },
            finish() {
                ev.cancel()
                setValue(max)
                onFinishEvents.forEach((action) => action())
            },
        }
    }

    // main game loop
    run(() => {
        if (!debug.paused) updateFrame()
        checkFrame()
    })

    // the exported ctx handle
    const ctx: KaboomCoreCtx = {
        VERSION,
        // asset load
        loadRoot,
        loadProgress,
        getBitmapFont,
        getShader,
        // query
        width,
        height,
        dt,
        time,
        onLoad,
        onLoadUpdate,
        onResize,
        onError,
        gravity,
        // obj
        add,
        destroy,
        destroyAll,
        getAll,
        readd,
        // comps
        pos,
        scale,
        rotate,
        color,
        opacity,
        anchor,
        area,
        rect,
        circle,
        uvquad,
        outline,
        body,
        doubleJump,
        timer,
        fixed,
        stay,
        health,
        lifespan,
        z,
        move,
        follow,
        state,
        fadeIn,
        // group events
        on,
        onUpdate,
        onDraw,
        onDestroy,
        onCollide,
        // timer
        loop,
        wait,
        // math
        Timer,
        Line,
        Rect,
        Circle,
        Polygon,
        Vec2,
        Color,
        Mat4,
        Quad,
        RNG,
        rand,
        randi,
        randSeed,
        rgb,
        hsl2rgb,
        quad,
        choose,
        chance,
        lerp,
        tween,
        easings,
        map,
        mapc,
        wave,
        deg2rad,
        rad2deg,
        testLineLine,
        testRectRect,
        testRectLine,
        testRectPoint,
        pushMatrix,
        // debug
        debug,
        // scene
        scene,
        go,
        // level
        addLevel,
        // storage
        getData,
        setData,
        download,
        downloadJSON,
        downloadText,
        downloadBlob,
        // char sets
        ASCII_CHARS,
        // dirs
        LEFT: Vec2.LEFT,
        RIGHT: Vec2.RIGHT,
        UP: Vec2.UP,
        DOWN: Vec2.DOWN,
        // colors
        RED: Color.RED,
        GREEN: Color.GREEN,
        BLUE: Color.BLUE,
        YELLOW: Color.YELLOW,
        MAGENTA: Color.MAGENTA,
        CYAN: Color.CYAN,
        WHITE: Color.WHITE,
        BLACK: Color.BLACK,
        quit,
        // helpers
        KaboomEvent,
        EventHandler,
    }

    return ctx

}
