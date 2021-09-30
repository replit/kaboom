import * as React from "react";
import { Theme, DEF_THEME } from "lib/ui";

export interface Tooltip {
	name?: string,
	desc: string,
}

interface Ctx {
	theme: Theme,
	setTheme(theme: Theme): void,
	nextTheme(): void,
	inspect: boolean,
	setInspect: (inspect: boolean) => void,
	pushTooltip: (tooltip: Tooltip) => Promise<number>,
	popTooltip: (id: number) => void,
}

export default React.createContext<Ctx>({
	theme: DEF_THEME,
	setTheme: () => {},
	nextTheme: () => {},
	inspect: false,
	setInspect: () => {},
	pushTooltip: () => Promise.reject(),
	popTooltip: () => {},
});
