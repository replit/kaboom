import * as React from "react";
import { Global, css } from "@emotion/react"
import ThemeCtx from "comps/theme";

type Color =
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

type Theme =
	| "light"
	| "dark"
	;

type FontSize =
	| "small"
	| "normal"
	| "big"
	| "huge"
	;

type CSSVal = string;
type ThemeDef = Record<Color, CSSVal>;
type ThemeBook = Record<Theme, ThemeDef>;

const spaceUnit = 8;

const fontSizes: Record<FontSize, CSSVal> = {
	"small": "16px",
	"normal": "20px",
	"big": "24px",
	"huge": "32px",
}

const themes: ThemeBook = {
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

const defTheme: Theme = "light";

const vars = (() => {

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

interface PageProps {
	theme?: Theme,
}

const Page: React.FC<PageProps> = ({
	theme,
	children,
	...args
} = {
	theme: defTheme,
}) => {

	const [ curTheme, setCurTheme ] = React.useState<Theme>(theme ?? defTheme);

	React.useEffect(() => {
		if (theme) {
			return;
		}
		if (localStorage["theme"]) {
			setCurTheme(localStorage["theme"]);
		}
	}, [ theme ]);

	React.useEffect(() => {
		if (theme) {
			return;
		}
		localStorage["theme"] = curTheme;
	}, [ curTheme, setCurTheme, theme ]);

	const nextTheme = React.useCallback(() => {
		if (theme) {
			return;
		}
		const options = Object.keys(themes) as Array<Theme>;
		setCurTheme((prev: Theme) => {
			const idx = options.indexOf(prev);
			const nxt = (idx + 1) % options.length;
			return options[nxt];
		});
	}, [setCurTheme, theme]);

	return (
		<ThemeCtx.Provider value={{
			theme: curTheme,
			setTheme: setCurTheme,
			nextTheme: nextTheme,
		}}>
			<div
				className={curTheme}
				css={{
					background: `var(--color-bg1)`,
					width: "100%",
					height: "100%",
					overflow: "scroll",
				}}
//  				{...args}
			>
				<Global
					styles={css`
						${vars}
						@font-face {
							font-family: IBM Plex Sans;
							src: url(fonts/IBMPlexSans-Regular.ttf) format(truetype);
						}
						@font-face {
							font-family: IBM Plex Mono;
							src: url(fonts/IBMPlexMono-Regular.ttf) format(truetype);
						}
						@font-face {
							font-family: Necto Mono;
							src: url(fonts/NectoMono-Regular.otf) format(opentype);
						}
						* {
							margin: 0;
							padding: 0;
							box-sizing: border-box;
							font-family: inherit;
						}
						html {
							width: 100%;
							height: 100%;
							font-family: IBM Plex Sans;
						}
						h1,h2,h3,h4,h5,h6,p,pre,code,div {
							color: var(--color-fg1);
						}
						body {
							width: 100%;
							height: 100%;
						}
						pre {
							font-family: IBM Plex Mono;
						}
						code {
							font-family: IBM Plex Mono;
						}
						#__next {
							width: 100%;
							height: 100%;
						}
					`}
				/>
				{children}
			</div>
		</ThemeCtx.Provider>
	);

};

export default Page;
