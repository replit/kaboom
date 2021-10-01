import * as React from "react";
import { Theme, defTheme } from "lib/ui";

export interface Tooltip {
	name?: string,
	desc: string,
}

interface Ctx {
	theme: Theme,
	setTheme(theme: Theme): void,
	inspect: boolean,
	setInspect: (inspect: boolean) => void,
	pushTooltip: (tooltip: Tooltip) => Promise<number>,
	popTooltip: (id: number) => void,
}

export default React.createContext<Ctx>({
	theme: defTheme,
	setTheme: () => {},
	inspect: false,
	setInspect: () => {},
	pushTooltip: () => Promise.reject(),
	popTooltip: () => {},
});
