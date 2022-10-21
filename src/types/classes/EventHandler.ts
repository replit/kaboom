
import { EventController } from "../../types"

export declare class EventHandler<E = string> {
    on(name: E, action: (...args) => void): EventController
    onOnce(name: E, action: (...args) => void): EventController
    next(name: E): Promise<unknown>
    trigger(name: E, ...args)
    remove(name: E)
    clear()
    numListeners(name: E): number
}
