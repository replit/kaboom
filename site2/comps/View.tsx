import * as React from "react";

const spaceUnit = 8;

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
	onClick?: React.MouseEventHandler<HTMLDivElement>,
	onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>,
}

const View = React.forwardRef<HTMLDivElement, React.PropsWithChildren<ViewProps>>(({
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
	onClick,
	onKeyDown,
	children,
	...props
}, ref) => {

	const marginSide = dir === "row" ? "marginRight" : "marginBottom";
	const px = (padX ?? pad ?? 0) * 8;
	const py = (padY ?? pad ?? 0) * 8;

	return (
		<div
			ref={ref}
			onClick={onClick}
			onKeyDown={(e) => {
				if (focusable) {
					if (e.key === "Enter") {
						e.currentTarget.click();
					}
				}
				onKeyDown && onKeyDown(e);
			}}
			tabIndex={focusable ? 0 : undefined}
			css={{
				display: "flex",
//  				flexDirection: (dir ?? "column") + (reverse ? "-reverse" : ""),
				flexDirection: dir ?? "column",
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
				border: outlined ? "solid 2px var(--color-outline)" : "none",
				"& > *": { [marginSide]: (gap ?? 0) * spaceUnit, },
				"& > *:last-child": { [marginSide]: 0, },
				":focus": {
					border: "solid 2px var(--color-highlight)",
				},
			}}
			{...props}
		>
			{children}
		</div>
	);

});

export default View;
