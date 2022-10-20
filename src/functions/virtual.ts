import { VirtualButton, EventController, gameType, appType } from "../types"
import { VirtualCtx } from "../types/virtual"

export default (game: gameType, app: appType): VirtualCtx => {

    function isVirtualButtonPressed(btn: VirtualButton): boolean {
        return app.virtualButtonState.pressed.has(btn)
    }

    function isVirtualButtonDown(btn: VirtualButton): boolean {
        return app.virtualButtonState.down.has(btn)
    }

    function isVirtualButtonReleased(btn: VirtualButton): boolean {
        return app.virtualButtonState.released.has(btn)
    }

    function onVirtualButtonDown(btn: VirtualButton, action: () => void): EventController {
        return game.ev.on("virtualButtonDown", (b) => b === btn && action())
    }

    function onVirtualButtonPress(btn: VirtualButton, action: () => void): EventController {
        return game.ev.on("virtualButtonPress", (b) => b === btn && action())
    }

    function onVirtualButtonRelease(btn: VirtualButton, action: () => void): EventController {
        return game.ev.on("virtualButtonRelease", (b) => b === btn && action())
    }

    return {
        onVirtualButtonPress,
        onVirtualButtonDown,
        onVirtualButtonRelease,
		isVirtualButtonPressed,
		isVirtualButtonDown,
		isVirtualButtonReleased,
    }
}