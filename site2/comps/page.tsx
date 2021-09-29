import * as React from "react";
import { Global, css } from "@emotion/react"
import ThemeCtx from "comps/theme";
import { Theme, DEF_THEME, themes, cssVars } from "comps/ui";

interface PageProps {
	theme?: Theme,
}

const Page: React.FC<PageProps> = ({
	theme,
	children,
} = {
	theme: DEF_THEME,
}) => {

	const [ curTheme, setCurTheme ] = React.useState<Theme>(theme ?? DEF_THEME);

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
			>
				<Global
					styles={css`
						${cssVars}
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
						.cm-focused {
							outline: solid 2px var(--color-highlight) !important;
						}
					`}
				/>
				{children}
			</div>
		</ThemeCtx.Provider>
	);

};

export default Page;
