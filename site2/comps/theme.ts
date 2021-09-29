import * as React from "react";
import { Theme, DEF_THEME } from "comps/ui";

const ThemeCtx = React.createContext<{
	theme: Theme,
	setTheme(theme: Theme): void,
	nextTheme(): void,
}>({
	theme: DEF_THEME,
	setTheme: () => {},
	nextTheme: () => {},
});

export default ThemeCtx;
