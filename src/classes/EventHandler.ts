import { EventController } from "../types"
import { KaboomEvent } from "./KaboomEvent"

// TODO: be able to type each event
export class EventHandler<E = string> {
    private handlers: Map<E, KaboomEvent> = new Map()
    on(name: E, action: (...args) => void): EventController {
        if (!this.handlers.get(name)) {
            this.handlers.set(name, new KaboomEvent())
        }
        return this.handlers.get(name).add(action)
    }
    onOnce(name: E, action: (...args) => void): EventController {
        const ev = this.on(name, (...args) => {
            ev.cancel()
            action(...args)
        })
        return ev
    }
    next(name: E): Promise<unknown> {
        return new Promise((res) => {
            this.onOnce(name, res)
        })
    }
    trigger(name: E, ...args) {
        if (this.handlers.get(name)) {
            this.handlers.get(name).trigger(...args)
        }
    }
    remove(name: E) {
        this.handlers.delete(name)
    }
    clear() {
        this.handlers = new Map()
    }
    numListeners(name: E): number {
        return this.handlers.get(name)?.numListeners() ?? 0
    }
}