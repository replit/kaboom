import * as React from "react";
import { DEF_THEME } from "lib/ui";
import { Tooltip } from "lib/tooltip";
import { Drag } from "lib/drag";

interface Ctx {
	theme: string,
	setTheme(theme: string): void,
	inspect: boolean,
	setInspect: (inspect: boolean) => void,
	pushTooltip: (tooltip: Tooltip) => Promise<number>,
	popTooltip: (id: number) => void,
	draggin: Drag | null,
	setDraggin: (d: Drag | null) => void,
}

export default React.createContext<Ctx>({
	theme: DEF_THEME,
	setTheme: () => {},
	inspect: false,
	setInspect: () => {},
	pushTooltip: () => Promise.reject(),
	popTooltip: () => {},
	draggin: null,
	setDraggin: () => {},
});
