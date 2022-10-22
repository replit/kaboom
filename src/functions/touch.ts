import { Vec2 } from "../math"
import { EventController, gameType, appType } from "../types"
import { TouchCtx } from "../types/functions/touch"

export default (game: gameType, app: appType): TouchCtx => {
    function isTouchScreen() {
        return app.isTouchScreen
    }

    function onTouchStart(f: (pos: Vec2, t: Touch) => void): EventController {
        return game.ev.on("onTouchStart", f)
    }

    function onTouchMove(f: (pos: Vec2, t: Touch) => void): EventController {
        return game.ev.on("onTouchMove", f)
    }

    function onTouchEnd(f: (pos: Vec2, t: Touch) => void): EventController {
        return game.ev.on("onTouchEnd", f)
    }

    return {
        isTouchScreen,
		onTouchStart,
		onTouchMove,
		onTouchEnd,
    }
}
