import {
	KaboomCtx,
	KaboomCoreCtx,
	KaboomOpt,
} from "./types"
import kaboomClient from "./kaboomClient"
import kaboomCore from "./kaboomCore"

// only exports one kaboom() which contains all the state
export default (gopt: KaboomOpt = {}): KaboomCoreCtx | KaboomCtx => {
	if (gopt.headless) {
		return kaboomCore(gopt)
	} else {
		return kaboomClient(gopt)
	}
}
