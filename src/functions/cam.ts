import { vec2, Vec2 } from "../math"
import { gameType, assetsType } from "../types"
import { CamCtx } from "../types/cam"

export default (game: gameType, width: number, height: number): CamCtx => {

    function center(): Vec2 {
        return vec2(width / 2, height / 2)
    }

    function camPos(...pos): Vec2 {
        if (pos.length > 0) {
            game.cam.pos = vec2(...pos)
        }
        return game.cam.pos ? game.cam.pos.clone() : center()
    }

    function camScale(...scale): Vec2 {
        if (scale.length > 0) {
            game.cam.scale = vec2(...scale)
        }
        return game.cam.scale.clone()
    }

    function camRot(angle: number): number {
        if (angle !== undefined) {
            game.cam.angle = angle
        }
        return game.cam.angle
    }

    function shake(intensity: number = 12) {
        game.cam.shake = intensity
    }

    function toScreen(p: Vec2): Vec2 {
        return game.cam.transform.multVec2(p)
    }

    function toWorld(p: Vec2): Vec2 {
        return game.cam.transform.invert().multVec2(p)
    }

    return {
        center,
        camPos,
        camScale,
        camRot,
        shake,
        toScreen,
        toWorld,
    }
}