
import { KaboomCoreCtx, KaboomCtx, KaboomOpt, } from "./types"

import kaboomBrowser from "./kaboomBrowser"
import kaboomCore from "./kaboomCore"

// only exports one kaboom() which contains all the state
export default (gopt: KaboomOpt = {}): KaboomCoreCtx | KaboomCtx => {
	if (gopt.headless) {
		return kaboomCore(gopt)
	} else {
		return kaboomBrowser(gopt)
	}
}
