import * as React from "react";
import Ctx from "lib/Ctx";
import useTooltip from "hooks/useTooltip";
import { space as spaceUnit } from "lib/ui";

type StackDir =
	| "row"
	| "column"
	;

type Align =
	| "start"
	| "end"
	| "center"
	| "stretch"
	| "baseline"
	;

const toAlign = (a: Align) => {
	switch (a) {
		case "start": return "flex-start";
		case "end": return "flex-end";
		case "center": return "center";
		case "stretch": return "stretch";
		case "baseline": return "baseline";
	}
}

type Justify =
	| "start"
	| "end"
	| "center"
	| "between"
	| "around"
	| "even"
	;

const toJustify = (j: Justify) => {
	switch (j) {
		case "start": return "flex-start";
		case "end": return "flex-end";
		case "center": return "center";
		case "between": return "space-between";
		case "around": return "space-around";
		case "even": return "space-evenly";
	}
}

export interface ViewProps {
	name?: string,
	desc?: string,
	dir?: StackDir,
	gap?: number,
	reverse?: boolean,
	wrap?: boolean,
	align?: Align,
	justify?: Justify,
	stretchX?: boolean,
	stretchY?: boolean,
	stretch?: boolean,
	bg?: number | string,
	rounded?: boolean,
	outlined?: boolean,
	width?: number | string,
	height?: number | string,
	focusable?: boolean,
	pad?: number,
	padX?: number,
	padY?: number,
}

export type ViewPropsWithChildren = React.PropsWithChildren<ViewProps>;

export type ViewPropsWithChildrenAndDiv =
	ViewPropsWithChildren
	& Omit<
		Omit<
			React.HTMLProps<HTMLDivElement>,
			"ref"
		>,
		keyof ViewProps
	>
	;

export type ViewPropsAnd<T> = T & Omit<ViewPropsWithChildrenAndDiv, keyof T>;

// TODO: put tooltip / inspect logic to a useInspect()?
const View = React.forwardRef<HTMLDivElement, ViewPropsWithChildrenAndDiv>(({
	name,
	desc,
	dir,
	gap,
	reverse,
	wrap,
	align,
	justify,
	stretchX,
	stretchY,
	stretch,
	bg,
	rounded,
	outlined,
	width,
	height,
	pad,
	padX,
	padY,
	focusable,
	onKeyDown,
	children,
	...props
}, domRef) => {

	const marginSide = dir === "row" ? "marginRight" : "marginBottom";
	const px = (padX ?? pad ?? 0) * 8;
	const py = (padY ?? pad ?? 0) * 8;
	const { inspect } = React.useContext(Ctx);
	const [ pushTooltip, popTooltip ] = useTooltip();
	const localDomRef = React.useRef(null);
	const curDomRef = domRef ?? localDomRef;

	// if dom is hovered when entering inspect mode, push tooltip
	React.useEffect(() => {
		if (inspect && desc) {
			// @ts-ignore
			if (curDomRef?.current?.matches(":hover")) {
				pushTooltip({ name, desc });
			}
		}
	}, [ inspect, name, desc, pushTooltip, ]);

	return <div
		ref={curDomRef}
		onMouseEnter={(inspect && desc) ? () => pushTooltip({ name, desc, }) : undefined}
		onMouseLeave={(inspect && desc) ? popTooltip : undefined}
		onKeyDown={(focusable || onKeyDown) ? (e) => {
			if (focusable) {
				if (e.key === "Enter") {
					e.currentTarget.click();
				}
			}
			onKeyDown && onKeyDown(e);
		} : undefined}
		tabIndex={focusable ? 0 : undefined}
		// @ts-ignore
		css={{
			display: "flex",
			flexDirection: (dir ?? "column") + (reverse ? "-reverse" : ""),
			alignItems: toAlign(align ?? "start"),
			justifyContent: toJustify(justify ?? "start"),
			flexWrap: wrap ? "wrap" : "nowrap",
			width: (stretchX || stretch) ? "100%" : width,
			height: (stretchY || stretch) ? "100%" : height,
			background: typeof bg === "number" ? `var(--color-bg${bg})` : bg,
			paddingLeft: `${px}px`,
			paddingRight: `${px}px`,
			paddingTop: `${py}px`,
			paddingBottom: `${py}px`,
			position: "relative",
			borderRadius: rounded ? 8 : 0,
//  			outline: outlined ? "solid 2px var(--color-outline)" : "none",
			boxShadow: outlined ? "0 0 0 2px var(--color-outline)" : "none",
			"& > *": { [marginSide]: (gap ?? 0) * spaceUnit, },
			"& > *:last-child": { [marginSide]: 0, },
			":focus": {
//  				outline: "solid 2px var(--color-highlight)",
				boxShadow: outlined ? "0 0 0 2px var(--color-highlight)" : "none",
			},
			...((inspect && desc) ? {
				":hover": {
					cursor: "help !important",
//  					outline: "solid 2px var(--color-highlight)",
//  					boxShadow: outlined ? "0 0 0 2px var(--color-highlight)" : "none",
					boxShadow: "0 0 0 2px var(--color-highlight)",
				},
			} : {}),
		}}
		{...props}
	>
		{children}
	</div>

});

export default View;
