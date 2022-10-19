import { EventList, appType, Debug, } from "../types"

export default (app: appType, debug: Debug, audio) => {
    const docEvents: EventList<DocumentEventMap> = {}

    docEvents.visibilitychange = () => {
        switch (document.visibilityState) {
            case "visible":
                // prevent a surge of dt() when switch back after the tab being hidden for a while
                app.skipTime = true
                if (!debug.paused) {
                    audio.ctx.resume()
                }
                break
            case "hidden":
                audio.ctx.suspend()
                break
        }
    }

    for (const name in docEvents) {
        document.addEventListener(name, docEvents[name])
    }

    return docEvents
}