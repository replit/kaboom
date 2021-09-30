export type Color =
	| "bg1"
	| "bg2"
	| "bg3"
	| "bg4"
	| "outline"
	| "fg1"
	| "fg2"
	| "fg3"
	| "fg4"
	| "highlight"
	| "title-bg"
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

export const themes = {
	"dark": {
		"bg1": "rgb(20, 20, 30)",
		"bg2": "rgb(32, 32, 46)",
		"bg3": "rgb(44, 44, 62)",
		"bg4": "rgb(56, 56, 78)",
		"outline": "rgb(64, 64, 96)",
		"fg1": "rgb(215, 225, 235)",
		"fg2": "rgb(170, 170, 190)",
		"fg3": "rgb(125, 135, 145)",
		"fg4": "rgb(80, 90, 100)",
		"highlight": "rgb(30, 140, 230)",
		"title-bg": "rgb(19, 33, 49)",
	},
	"purple": {
		"bg1": "rgb(31, 11, 61)",
		"bg2": "rgb(44, 24, 74)",
		"bg3": "rgb(57, 37, 87)",
		"bg4": "rgb(70, 50, 100)",
		"outline": "rgb(63, 63, 95)",
		"fg1": "rgb(233, 233, 233)",
		"fg2": "rgb(170, 170, 175)",
		"fg3": "rgb(125, 135, 153)",
		"fg4": "rgb(74, 74, 95)",
		"highlight": "rgb(32, 144, 239)",
		"title-bg": "rgb(19, 33, 49)",
	},
	"light": {
		"bg1": "rgb(255, 255, 255)",
		"bg2": "rgb(244, 244, 244)",
		"bg3": "rgb(233, 233, 233)",
		"bg4": "rgb(222, 222, 222)",
		"outline": "rgb(218, 218, 218)",
		"fg1": "rgb(51, 51, 51)",
		"fg2": "rgb(102, 102, 102)",
		"fg3": "rgb(153, 153, 153)",
		"fg4": "rgb(204, 204, 204)",
		"highlight": "rgb(0, 128, 255)",
		"title-bg": "rgb(255, 248, 188)",
	},
};

export const space = 8;
export const DEF_THEME = "dark";

export const cssVars = (() => {

	const buildCSSVars = (prefix: string, map: Record<string, CSSVal>): string => {
		let code = "";
		for (const k in map) {
			code += `--${prefix}-${k}: ${map[k]};`;
		}
		return code;
	}

	let code = `:root {${buildCSSVars("text", fontSizes)}${buildCSSVars("color", themes[DEF_THEME])}}`;

	for (const theme in themes) {
		code += `.${theme} {${buildCSSVars("color", themes[theme])}}`;
	}

	return code;

})();
