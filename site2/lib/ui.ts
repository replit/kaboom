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

export type ThemeBook = Record<string, ThemeDef>;

// TODO: figure out a way to gen type like this would be nice
// genColor(name: string, count: number)
// genColor("bg", 4)

// {
// 	"bg1": string,
// 	"bg2": string,
// 	"bg3": string,
// 	"bg4": string,
// }

const genColors = (
	name: string, num: number,
	r: number, g: number, b: number,
	dr: number, dg: number, db: number,
): Record<string, CSSVal> => {
	const map = {};
	for (let i = 0; i < num; i++) {
		// @ts-ignore
		map[`${name}${i + 1}`] = `rgb(${r + dr * i}, ${g + dg * i}, ${b + db * i})`;
	}
	return map;
};

export const themes: ThemeBook = {
	// @ts-ignore
	"dark": {
		...genColors(
			"bg", 4,
			20, 20, 30,
			12, 12, 16
		),
		...genColors(
			"fg", 4,
			215, 225, 235,
			-50, -50, -45,
		),
		"outline": "var(--color-bg4)",
		"bgpat": "rgb(16, 16, 26)",
		"fghl": "rgb(215, 225, 235)",
		"highlight": "rgb(30, 140, 230)",
		"accent": "rgb(19, 33, 49)",
		"danger": "rgb(240, 90, 90)",
		"errbg": "rgb(40, 25, 35)",
	},
	// @ts-ignore
	"black": {
		...genColors(
			"bg", 4,
			0, 0, 0,
			15, 15, 15
		),
		...genColors(
			"fg", 4,
			215, 215, 215,
			-40, -40, -40,
		),
		"outline": "var(--color-bg4)",
		"bgpat": "rgb(15, 15, 15)",
		"fghl": "rgb(215, 215, 215)",
		"highlight": "rgb(30, 140, 200)",
		"accent": "rgb(19, 33, 49)",
		"danger": "rgb(255, 80, 80)",
		"errbg": "rgb(30, 10, 10)",
	},
	// @ts-ignore
	"violet": {
		...genColors(
			"bg", 4,
			50, 30, 90,
			12, 12, 15
		),
		...genColors(
			"fg", 4,
			220, 200, 240,
			-20, -20, -10,
		),
		"outline": "var(--color-bg4)",
		"bgpat": "rgb(45, 25, 85)",
		"fghl": "rgb(255, 255, 255)",
		"highlight": "rgb(120, 120, 230)",
		"accent": "rgb(19, 33, 49)",
		"danger": "rgb(255, 90, 90)",
		"errbg": "rgb(30, 10, 10)",
	},
	// @ts-ignore
	"grass": {
		...genColors(
			"bg", 4,
			20, 120, 100,
			10, 15, 12,
		),
		...genColors(
			"fg", 4,
			210, 240, 230,
			-15, -10, -10,
		),
		"outline": "var(--color-bg4)",
		"bgpat": "rgb(10, 110, 90)",
		"fghl": "rgb(255, 255, 255)",
		"highlight": "rgb(40, 160, 160)",
		"accent": "rgb(19, 33, 49)",
		"danger": "rgb(255, 90, 90)",
		"errbg": "rgb(30, 10, 10)",
	},
	// @ts-ignore
	"vibrant": {
		...genColors(
			"bg", 4,
			110, 50, 30,
			15, 12, 12,
		),
		...genColors(
			"fg", 4,
			240, 230, 210,
			-10, -15, -15,
		),
		"outline": "var(--color-bg4)",
		"bgpat": "rgb(100, 40, 20)",
		"fghl": "rgb(255, 255, 255)",
		"highlight": "rgb(180, 120, 100)",
		"accent": "rgb(19, 33, 49)",
		"danger": "rgb(255, 90, 90)",
		"errbg": "rgb(30, 10, 10)",
	},
	// @ts-ignore
	"ice": {
		...genColors(
			"bg", 4,
			230, 240, 255,
			-10, -10, -5
		),
		...genColors(
			"fg", 4,
			60, 65, 80,
			35, 40, 45,
		),
		"outline": "var(--color-bg4)",
		"bgpat": "rgb(220, 230, 245)",
		"fghl": "rgb(250, 250, 250)",
		"highlight": "rgb(70, 180, 240)",
		"accent": "rgb(19, 33, 49)",
		"danger": "rgb(255, 90, 90)",
		"errbg": "rgb(30, 10, 10)",
	},
	// @ts-ignore
	"light": {
		...genColors(
			"bg", 4,
			250, 250, 250,
			-10, -10, -10
		),
		...genColors(
			"fg", 4,
			60, 60, 60,
			40, 40, 40,
		),
		"outline": "var(--color-bg4)",
		"bgpat": "rgb(240, 240, 240)",
		"fghl": "rgb(250, 250, 250)",
		"highlight": "rgb(60, 160, 220)",
		"accent": "rgb(19, 33, 49)",
		"danger": "rgb(255, 90, 90)",
		"errbg": "rgb(30, 10, 10)",
	},
	// @ts-ignore
	"spring": {
		...genColors(
			"bg", 4,
			255, 230, 240,
			-5, -10, -10
		),
		...genColors(
			"fg", 4,
			80, 60, 65,
			45, 35, 40,
		),
		"outline": "var(--color-bg4)",
		"bgpat": "rgb(245, 220, 230)",
		"fghl": "rgb(250, 250, 250)",
		"highlight": "rgb(30, 140, 230)",
		"accent": "rgb(19, 33, 49)",
		"danger": "rgb(255, 90, 90)",
		"errbg": "rgb(30, 10, 10)",
	},
};

export const commonThemes = [
	"dark",
	"black",
	"ice",
];

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
