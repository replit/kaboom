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
	| "highlight"
	| "accent"
	| "err"
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
	| "yellow"
	| "light"
	;

export type ThemeBook = Record<Theme, ThemeDef>;

export const themes: ThemeBook = {
	"dark": {
		"bg1": "rgb(20, 20, 30)",
		"bg2": "rgb(32, 32, 46)",
		"bg3": "rgb(44, 44, 62)",
		"bg4": "rgb(56, 56, 78)",
		"bgpat": "rgb(17, 17, 27)",
		"outline": "rgb(64, 64, 96)",
		"fg1": "rgb(215, 225, 235)",
		"fg2": "rgb(170, 170, 190)",
		"fg3": "rgb(125, 135, 155)",
		"fg4": "rgb(80, 90, 110)",
		"highlight": "rgb(30, 140, 230)",
		"accent": "rgb(19, 33, 49)",
		"err": "rgb(230, 90, 90)",
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
		"highlight": "rgb(30, 140, 230)",
		"accent": "rgb(19, 33, 49)",
		"err": "rgb(255, 128, 128)",
		"errbg": "rgb(30, 10, 10)",
	},
	"yellow": {
		"bg1": "rgb(255, 235, 170)",
		"bg2": "rgb(245, 225, 160)",
		"bg3": "rgb(235, 215, 150)",
		"bg4": "rgb(225, 205, 140)",
		"bgpat": "rgb(248, 228, 163)",
		"outline": "rgb(220, 200, 135)",
		"fg1": "rgb(60, 60, 40)",
		"fg2": "rgb(100, 100, 80)",
		"fg3": "rgb(140, 140, 120)",
		"fg4": "rgb(180, 180, 140)",
		"highlight": "rgb(30, 140, 230)",
		"accent": "rgb(19, 33, 49)",
		"err": "rgb(255, 128, 128)",
		"errbg": "rgb(255, 205, 140)",
	},
	"light": {
		"bg1": "rgb(255, 255, 255)",
		"bg2": "rgb(244, 244, 244)",
		"bg3": "rgb(233, 233, 233)",
		"bg4": "rgb(222, 222, 222)",
		"bgpat": "rgb(248, 248, 248)",
		"outline": "rgb(218, 218, 218)",
		"fg1": "rgb(51, 51, 51)",
		"fg2": "rgb(102, 102, 102)",
		"fg3": "rgb(153, 153, 153)",
		"fg4": "rgb(190, 190, 190)",
		"highlight": "rgb(0, 128, 255)",
		"accent": "rgb(255, 248, 188)",
		"err": "rgb(255, 128, 128)",
		"errbg": "rgb(255, 215, 215)",
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
