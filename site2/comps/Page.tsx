import * as React from "react";
import Head from "next/head";
import { Global, css } from "@emotion/react"
import Ctx from "lib/Ctx";
import { Tooltip } from "lib/tooltip";
import View from "comps/View";
import Button from "comps/Button";
import Text from "comps/Text";
import { Theme, defTheme, themes, cssVars } from "lib/ui";
import useMousePos from "hooks/useMousePos";
import useKey from "hooks/useKey";
import useDoc from "hooks/useDoc";
import IDList from "lib/idlist";

interface PageProps {
	theme?: Theme,
	title?: string,
	desc?: string,
}

const Page: React.FC<PageProps> = ({
	theme: initTheme,
	title,
	desc,
	children,
} = {
	theme: defTheme,
}) => {

	const [ theme, setTheme ] = React.useState<Theme>(initTheme ?? defTheme);
	const [ inspect, setInspect ] = React.useState(false);
	const [ tooltipStack, setTooltipStack ] = React.useState<IDList<Tooltip>>(new IDList());
	const doc = useDoc();

	const curTooltip = React.useMemo(
		() => tooltipStack.size === 0 ? null : Array.from(tooltipStack.values())[tooltipStack.size - 1],
		[ tooltipStack ]
	);

	useKey("F1", () => setInspect(!inspect), [ setInspect, inspect ]);
	useKey("Escape", () => setInspect(false), [ setInspect ]);

	// reset tooltip stack when entering / exiting inspect mode
	React.useEffect(() => setTooltipStack(new IDList()), [ inspect ]);

	// set theme from local storage
	React.useEffect(() => {
		if (initTheme) {
			return;
		}
		if (localStorage["theme"]) {
			setTheme(localStorage["theme"]);
		}
	}, [ initTheme ]);

	// save theme setting into local storage
	React.useEffect(() => {
		if (initTheme) {
			return;
		}
		localStorage["theme"] = theme;
	}, [ theme, setTheme, initTheme ]);

	// push a tooltip into tooltip stack, returning the id
	const pushTooltip = React.useCallback((t: Tooltip) => {
		return new Promise<number>((resolve, reject) => {
			setTooltipStack((prevStack) => {
				const newStack = prevStack.clone();
				const id = newStack.push(t);
				resolve(id);
				return newStack;
			});
		});
	}, [ setTooltipStack, ]);

	// pop a tooltip from tooltip stack with id
	const popTooltip = React.useCallback((id: number) => {
		setTooltipStack((prevStack) => {
			const newStack = prevStack.clone();
			newStack.delete(id);
			return newStack;
		});
	}, [ setTooltipStack, ]);

	return <>
		<Head>
			<title>{title || "Kaboom!"}</title>
			<meta name="description" content={desc || ""} />
			<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			<link href="icon" rel="/public/img/k.png" />
		</Head>
		<Global
			styles={css`
				${cssVars}
				@font-face {
					font-family: IBM Plex Sans;
					src: url(/public/fonts/IBMPlexSans-Regular.ttf) format(truetype);
				}
				@font-face {
					font-family: IBM Plex Mono;
					src: url(/public/fonts/IBMPlexMono-Regular.ttf) format(truetype);
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
			`}
		/>
		<Ctx.Provider value={{
			theme,
			setTheme,
			inspect,
			setInspect,
			pushTooltip,
			popTooltip,
			doc,
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
			{ inspect && curTooltip && <TooltipComp {...curTooltip} /> }
		</Ctx.Provider>
	</>;

};

const TooltipComp: React.FC<Tooltip> = ({
	name,
	desc,
}) => {
	const [ mouseX, mouseY ] = useMousePos();
	return (
		<View
			bg={1}
			pad={1.5}
			rounded
			outlined
			css={{
				position: "absolute",
				zIndex: 20000,
				maxWidth: "320px",
				pointerEvents: "none",
				overflow: "hidden",
				top: mouseY,
				left: mouseX,
			}}
		>
		{
			name &&
			<Text noSelect>{name}</Text>
		}
		<Text color={2} noSelect>{desc}</Text>
	</View>
	);
};

export default Page;
