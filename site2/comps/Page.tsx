import * as React from "react";
import { Global, css } from "@emotion/react"
import ThemeCtx from "lib/ThemeCtx";
import { Theme, DEF_THEME, themes, cssVars } from "lib/ui";

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
							outline: none;
						}
						html {
							width: 100%;
							height: 100%;
							font-family: IBM Plex Sans;
						}
						body {
							width: 100%;
							height: 100%;
						}
						#__next {
							width: 100%;
							height: 100%;
						}
						h1 {
							font-size: 48px;
						}
						h2 {
							font-size: 36px;
						}
						h3,h4,h5,h6 {
							font-size: 24px;
						}
						h1,h2,h3,h4,h5,h6,p {
							color: var(--color-fg1);
						}
						p {
							font-size: var(--text-normal);
							line-height: 1.6;
						}
						ul,ol {
							line-height: 2;
							color: var(--color-fg1);
							margin-left: 24px;
						}
						a {
							color: var(--color-highlight);
						}
						a:visited {
							color: var(--color-highlight);
						}
						pre {
							width: 100%;
							background: var(--color-bg2);
							padding: 16px;
							border-radius: 8px;
							border: solid 2px var(--color-outline);
							flex: 1,
						}
						code {
							font-family: IBM Plex Mono;
						}
						p > code {
							padding: 2px 6px;
							border-radius: 8px;
							background: var(--color-bg2);
						}
						.cm-editor {
							width: 100% !important;
							height: 100% !important;
						}
						.hljs-comment,
						.hljs-quote {
							color: var(--color-fg4);
						}
						/* red */
						.hljs-variable,
						.hljs-template-variable,
						.hljs-tag,
						.hljs-name,
						.hljs-selector-id,
						.hljs-selector-class,
						.hljs-regexp,
						.hljs-link,
						.hljs-meta {
							color: #ef6155;
						}
						/* orange */
						.hljs-number,
						.hljs-built_in,
						.hljs-builtin-name,
						.hljs-literal,
						.hljs-type,
						.hljs-params,
						.hljs-deletion {
							color: #f99b15;
						}
						/* yellow */
						.hljs-section,
						.hljs-attribute {
							color: #fec418;
						}
						/* green */
						.hljs-string,
						.hljs-symbol,
						.hljs-bullet,
						.hljs-addition {
							color: #48b685;
						}
						/* purple */
						.hljs-keyword,
						.hljs-selector-tag {
							color: #815ba4;
						}
						code {
							color: var(--color-fg2);
						}
						.hljs {
							display: block;
							overflow-x: auto;
							background: #e7e9db;
							color: var(--color-fg2);
							padding: 0.5em;
						}
						.hljs-emphasis {
							font-style: italic;
						}
						.hljs-strong {
							font-weight: bold;
						}
					`}
				/>
				{children}
			</div>
		</ThemeCtx.Provider>
	);

};

export default Page;
