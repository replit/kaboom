
import { EventController } from "../../types"

export declare class KaboomEvent<Args extends any[] = any[]> {
    add(action: (...args: Args) => void): EventController
    addOnce(action: (...args) => void): EventController
    next(): Promise<Args>
    trigger(...args: Args)
    numListeners(): number
}
