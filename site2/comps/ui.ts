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

export type Theme =
	| "light"
	| "dark"
	;

export type FontSize =
	| "small"
	| "normal"
	| "big"
	| "huge"
	;

export type CSSVal = string;
export type ThemeDef = Record<Color, CSSVal>;
export type ThemeBook = Record<Theme, ThemeDef>;

export const fontSizes: Record<FontSize, CSSVal> = {
	"small": "16px",
	"normal": "20px",
	"big": "24px",
	"huge": "32px",
}

export const themes: ThemeBook = {
	"light": {
		"bg1": "#ffffff",
		"bg2": "#f8f8f8",
		"bg3": "#eaeaea",
		"bg4": "#e2e2e2",
		"outline": "#dadada",
//  		"outline": "#eaeaea",
		"fg1": "#333333",
		"fg2": "#666666",
		"fg3": "#999999",
		"fg4": "#cccccc",
		"highlight": "#0080ff",
		"title-bg": "#fff8bc",
	},
	"dark": {
		"bg1": "#111117",
		"bg2": "#15151f",
		"bg3": "#21212f",
		"bg4": "#2a2a3a",
		"outline": "#3f3f5f",
//  		"outline": "#25252f",
		"fg1": "#dfdfdf",
		"fg2": "#aaaaaf",
		"fg3": "#7a7a7f",
		"fg4": "#4a4a5f",
		"highlight": "#1090ef",
		"title-bg": "#132131",
	},
};

export const space = 8;
export const DEF_THEME: Theme = "light";

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
		code += `.${theme} {${buildCSSVars("color", themes[theme as Theme])}}`;
	}

	return code;

})();
