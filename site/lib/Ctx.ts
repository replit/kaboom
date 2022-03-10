import * as React from "react"
import { DEF_THEME } from "lib/ui"
import { Tooltip } from "lib/tooltip"

interface PageCtx {
	theme: string,
	setTheme(theme: string): void,
	inspect: boolean,
	setInspect: (inspect: boolean) => void,
	pushTooltip: (tooltip: Tooltip) => Promise<number>,
	popTooltip: (id: number) => void,
}

export default React.createContext<PageCtx>({
	theme: DEF_THEME,
	setTheme: () => {},
	inspect: false,
	setInspect: () => {},
	pushTooltip: () => Promise.reject(),
	popTooltip: () => {},
})
