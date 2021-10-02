import * as React from "react";
import Head from "next/head";
import { Global, css } from "@emotion/react"
import Ctx from "lib/Ctx";
import { Tooltip } from "lib/tooltip";
import { Drag } from "lib/drag";
import View from "comps/View";
import Button from "comps/Button";
import Text from "comps/Text";
import { Theme, defTheme, themes, cssVars } from "lib/ui";
import useMousePos from "hooks/useMousePos";
import useStoredState from "hooks/useStoredState";
import useKey from "hooks/useKey";
import useDoc from "hooks/useDoc";
import IDList from "lib/idlist";

interface PageProps {
	title?: string,
	desc?: string,
}

const Page: React.FC<PageProps> = ({
	title,
	desc,
	children,
}) => {

	const [ theme, setTheme ] = useStoredState<Theme>("theme", defTheme);
	const [ inspect, setInspect ] = React.useState(false);
	const [ draggin, setDraggin ] = React.useState<Drag | null>(null);
	const [ tooltipStack, setTooltipStack ] = React.useState<IDList<Tooltip>>(new IDList());
	const doc = useDoc();

	const curTooltip = React.useMemo(
		() => tooltipStack.size === 0 ? null : Array.from(tooltipStack.values())[tooltipStack.size - 1],
		[ tooltipStack ]
	);

	useKey("F1", () => setInspect(!inspect), [ setInspect, inspect ]);
	useKey("Escape", () => setInspect(false), [ setInspect ]);

	// reset tooltip stack when exiting inspect mode
	React.useEffect(() => {
		if (!inspect) {
			setTooltipStack(new IDList());
		}
	}, [ inspect ]);

	// push a tooltip into tooltip stack, returning the id
	const pushTooltip = React.useCallback((t: Tooltip) => {

		return new Promise<number>((resolve, reject) => {

			setTooltipStack((prevStack) => {

				// if it's already the current tooltip, we just return that
				const last = Array.from(prevStack)[prevStack.size - 1];

				if (last && t.name === last[1].name && t.desc === last[1].desc) {
					resolve(last[0]);
					return prevStack;
				}

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
					src: url(/public/fonts/IBMPlexSans-Regular.ttf) format("truetype");
				}
				@font-face {
					font-family: IBM Plex Mono;
					src: url(/public/fonts/IBMPlexMono-Regular.ttf) format("truetype");
				}
				* {
					margin: 0;
					padding: 0;
					box-sizing: border-box;
					font-family: inherit;
					outline: none;
					scrollbar-color: red yellow;
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
			draggin,
			setDraggin,
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
	if (!mouseX || !mouseY) {
		return <></>;
	}
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
			<Text>{name}</Text>
		}
		<Text color={2}>{desc}</Text>
	</View>
	);
};

export default Page;
