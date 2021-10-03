export type Color =
	| "bg1"
	| "bg2"
	| "bg3"
	| "bg4"
	| "bgpat"
	| "outline"
	| "fg1"
	| "fg2"
	| "fg3"
	| "fg4"
	| "fghl"
	| "highlight"
	| "accent"
	| "danger"
	| "errbg"
	;

export type FontSize =
	| "small"
	| "normal"
	| "big"
	| "huge"
	;

export type CSSVal = string;
export type ThemeDef = Record<Color, CSSVal>;

export const fontSizes: Record<FontSize, CSSVal> = {
	"small": "16px",
	"normal": "20px",
	"big": "24px",
	"huge": "32px",
}

export type Theme =
	| "dark"
	| "black"
	;

export type ThemeBook = Record<Theme, ThemeDef>;

export const themes: ThemeBook = {
	"dark": {
		"bg1": "rgb(20, 20, 30)",
		"bg2": "rgb(32, 32, 46)",
		"bg3": "rgb(44, 44, 62)",
		"bg4": "rgb(56, 56, 78)",
		"bgpat": "rgb(16, 16, 26)",
		"outline": "rgb(64, 64, 96)",
		"fg1": "rgb(215, 225, 235)",
		"fg2": "rgb(170, 170, 190)",
		"fg3": "rgb(125, 135, 155)",
		"fg4": "rgb(80, 90, 110)",
		"fghl": "rgb(215, 225, 235)",
		"highlight": "rgb(30, 140, 230)",
		"accent": "rgb(19, 33, 49)",
		"danger": "rgb(230, 90, 90)",
		"errbg": "rgb(40, 25, 35)",
	},
	"black": {
		"bg1": "rgb(0, 0, 0)",
		"bg2": "rgb(15, 15, 15)",
		"bg3": "rgb(30, 30, 30)",
		"bg4": "rgb(45, 45, 45)",
		"bgpat": "rgb(15, 15, 15)",
		"outline": "rgb(55, 55, 55)",
		"fg1": "rgb(215, 215, 215)",
		"fg2": "rgb(175, 175, 175)",
		"fg3": "rgb(135, 135, 135)",
		"fg4": "rgb(95, 95, 95)",
		"fghl": "rgb(215, 215, 215)",
		"highlight": "rgb(30, 140, 230)",
		"accent": "rgb(19, 33, 49)",
		"danger": "rgb(255, 128, 128)",
		"errbg": "rgb(30, 10, 10)",
	},
};

export const space = 8;
export const defTheme = "dark";

export const cssVars = (() => {

	const buildCSSVars = (prefix: string, map: Record<string, CSSVal>): string => {
		let code = "";
		for (const k in map) {
			code += `--${prefix}-${k}: ${map[k]};`;
		}
		return code;
	}

	let code = `:root {${buildCSSVars("text", fontSizes)}${buildCSSVars("color", themes[defTheme])}}`;

	for (const theme in themes) {
		code += `.${theme} {${buildCSSVars("color", themes[theme as Theme])}}`;
	}

	return code;

})();
