import * as React from "react";
import { Theme, defTheme } from "lib/ui";
import { Tooltip } from "lib/tooltip";
import { Drag } from "lib/drag";
import { Doc } from "lib/doc";

interface Ctx {
	theme: Theme,
	setTheme(theme: Theme): void,
	inspect: boolean,
	setInspect: (inspect: boolean) => void,
	pushTooltip: (tooltip: Tooltip) => Promise<number>,
	popTooltip: (id: number) => void,
	doc: Doc | null,
	draggin: Drag | null,
	setDraggin: (d: Drag | null) => void,
}

export default React.createContext<Ctx>({
	theme: defTheme,
	setTheme: () => {},
	inspect: false,
	setInspect: () => {},
	pushTooltip: () => Promise.reject(),
	popTooltip: () => {},
	doc: null,
	draggin: null,
	setDraggin: () => {},
});
