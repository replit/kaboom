import { IDList } from "./IDList"
import type { EventController } from "../types"

export class KaboomEvent<Args extends any[] = any[]> {
    private handlers: IDList<(...args: Args) => void> = new IDList()
    
    add(action: (...args: Args) => void): EventController {
        const cancel = this.handlers.pushd((...args: Args) => {
            if (handle.paused) return
            action(...args)
        })
        const handle = {
            paused: false,
            cancel: cancel,
        }
        return handle
    }
    addOnce(action: (...args) => void): EventController {
        const ev = this.add((...args) => {
            ev.cancel()
            action(...args)
        })
        return ev
    }
    next(): Promise<Args> {
        return new Promise((res) => this.addOnce(res))
    }
    trigger(...args: Args) {
        this.handlers.forEach((action) => action(...args))
    }
    numListeners(): number {
        return this.handlers.size
    }
}
