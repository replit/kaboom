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

interface StackProps {
	dir?: StackDir,
	space?: number,
	reverse?: boolean,
	wrap?: boolean,
	align?: Align,
	justify?: Justify,
	stretchX?: boolean,
	stretchY?: boolean,
	stretch?: boolean,
}

const Stack: React.FC<StackProps> = ({
	dir,
	space,
	reverse,
	wrap,
	align,
	justify,
	stretchX,
	stretchY,
	stretch,
	children,
	...args
} = {
	dir: "column",
	space: 0,
	reverse: false,
	wrap: true,
	align: "start",
	justify: "start",
}) => {
	const marginSide = dir === "row" ? "marginRight" : "marginBottom";
	return (
		<div
			css={{
				display: "flex",
//  				flexDirection: (dir ?? "column") + (reverse ? "-reverse" : ""),
				flexDirection: dir ?? "column",
				alignItems: toAlign(align ?? "start"),
				justifyContent: toJustify(justify ?? "start"),
				flexWrap: wrap ? "wrap" : "nowrap",
				width: (stretchX || stretch) ? "100%" : "auto",
				height: (stretchY || stretch) ? "100%" : "auto",
				"& > *": { [marginSide]: (space ?? 0) * spaceUnit, },
				"& > *:last-child": { [marginSide]: 0, },
			}}
			{...args}
		>
			{children}
		</div>
	);
};

type VStackProps = Omit<StackProps, "dir">;
type HStackProps = Omit<StackProps, "dir">;

const VStack: React.FC<VStackProps> = ({...args}) => <Stack {...args} dir="column" />;
const HStack: React.FC<HStackProps> = ({...args}) => <Stack {...args} dir="row" />;

export {
	Stack,
	VStack,
	HStack,
}
