import { gameType, appType, Key, EventController } from "../types"
import { KeyCtx } from "../types/key"

export default (game: gameType, app: appType): KeyCtx => {
    function isKeyPressed(k?: Key): boolean {
        return k === undefined
            ? app.keyState.pressed.size > 0
            : app.keyState.pressed.has(k)
    }

    function isKeyPressedRepeat(k?: Key): boolean {
        return k === undefined
            ? app.keyState.pressedRepeat.size > 0
            : app.keyState.pressedRepeat.has(k)
    }

    function isKeyDown(k?: Key): boolean {
        return k === undefined
            ? app.keyState.down.size > 0
            : app.keyState.down.has(k)
    }

    function isKeyReleased(k?: Key): boolean {
        return k === undefined
            ? app.keyState.released.size > 0
            : app.keyState.released.has(k)
    }

    // input callbacks
    const onKeyDown = ((
        key?: Key | ((k: Key) => void),
        action?: (k: Key) => void,
    ) => {
        if (typeof key === "function") {
            return game.ev.on("keyDown", key)
        } else if (typeof key === "string" && typeof action === "function") {
            return game.ev.on("keyDown", (k) => k === key && action(key))
        }
    }) as KeyCtx["onKeyDown"]

    const onKeyPress = ((
        key?: Key | ((k: Key) => void),
        action?: (k: Key) => void,
    ) => {
        if (typeof key === "function") {
            return game.ev.on("keyPress", key)
        } else if (typeof key === "string" && typeof action === "function") {
            return game.ev.on("keyPress", (k) => k === key && action(key))
        }
    }) as KeyCtx["onKeyPress"]

    const onKeyPressRepeat = ((
        key?: Key | ((k: Key) => void),
        action?: (k: Key) => void,
    ) => {
        if (typeof key === "function") {
            return game.ev.on("keyPressRepeat", key)
        } else if (typeof key === "string" && typeof action === "function") {
            return game.ev.on("keyPressRepeat", (k) => k === key && action(key))
        }
    }) as KeyCtx["onKeyPressRepeat"]

    const onKeyRelease = ((
        key?: Key | ((k: Key) => void),
        action?: (k: Key) => void,
    ) => {
        if (typeof key === "function") {
            return game.ev.on("keyRelease", key)
        } else if (typeof key === "string" && typeof action === "function") {
            return game.ev.on("keyRelease", (k) => k === key && action(key))
        }
    }) as KeyCtx["onKeyRelease"]

    function charInputted(): string[] {
        return [...app.charInputted]
    }

    function onCharInput(action: (ch: string) => void): EventController {
        return game.ev.on("charInput", action)
    }

    return {
        // input
        onKeyDown,
        onKeyPress,
        onKeyPressRepeat,
        onKeyRelease,
        onCharInput,
		isKeyDown,
		isKeyPressed,
		isKeyPressedRepeat,
		isKeyReleased,
		charInputted,
    }
}