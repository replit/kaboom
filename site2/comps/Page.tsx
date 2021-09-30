import * as React from "react";
import { Global, css } from "@emotion/react"
import Ctx, { Tooltip } from "lib/Ctx";
import View from "comps/View";
import Button from "comps/Button";
import Text from "comps/Text";
import { Theme, DEF_THEME, themes, cssVars } from "lib/ui";
import useMousePos from "hooks/useMousePos";

interface PageProps {
	theme?: Theme,
}

const Page: React.FC<PageProps> = ({
	theme: initTheme,
	children,
} = {
	theme: DEF_THEME,
}) => {

	const [ theme, setTheme ] = React.useState<Theme>(initTheme ?? DEF_THEME);
	const [ inspect, setInspect ] = React.useState(false);
	const [ tooltip, setTooltip ] = React.useState<Tooltip | null>(null);
	const [ mouseX, mouseY ] = useMousePos();

	React.useEffect(() => {
		if (initTheme) {
			return;
		}
		if (localStorage["theme"]) {
			setTheme(localStorage["theme"]);
		}
	}, [ initTheme ]);

	React.useEffect(() => {
		if (initTheme) {
			return;
		}
		localStorage["theme"] = theme;
	}, [ theme, setTheme, initTheme ]);

	const nextTheme = React.useCallback(() => {
		if (initTheme) {
			return;
		}
		const options = Object.keys(themes) as Array<Theme>;
		setTheme((prev: Theme) => {
			const idx = options.indexOf(prev);
			const nxt = (idx + 1) % options.length;
			return options[nxt];
		});
	}, [setTheme, initTheme]);

	return (
		<Ctx.Provider value={{
			theme,
			setTheme,
			nextTheme,
			inspect,
			setInspect,
			setTooltip,
		}}>
			<div
				className={theme}
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
							outline: solid 2px var(--color-outline);
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
			{ inspect && <View
				stretch
				pad={2}
				align="end"
				justify="end"
				css={{
					position: "fixed",
					top: 0,
					left: 0,
					background: "rgba(0, 0, 0, 0.3)",
					pointerEvents: "none",
					zIndex: 10000,
				}}
			>
				<Button
					action={() => setInspect(false)}
					text="Exit inspect mode"
					css={{
						pointerEvents: "auto",
					}}
				/>
			</View> }
			{ tooltip && <View
				bg={1}
				pad={1.5}
				rounded
				outlined
				css={{
					position: "fixed",
					top: mouseY,
					left: mouseX,
					zIndex: 20000,
					pointerEvents: "none",
				}}
			>
				{ tooltip.name &&
					<Text noSelect>{tooltip.name}</Text>
				}
				<Text color={2} noSelect>{tooltip.desc}</Text>
			</View> }
		</Ctx.Provider>
	);

};

export default Page;
