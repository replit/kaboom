export type Color =
	| "bg"
	| "bg2"
	| "bg3"
	| "outline"
	| "fg"
	| "fg2"
	| "fg3"
	| "fg4"
	| "highlight"
	| "title-bg"
	;

export type ThemeName =
	| "light"
	| "dark"
	;

export type FontSize =
	| "small"
	| "normal"
	| "big"
	| "huge"
	;

export type CSSVal = string;
export type Theme = Record<Color, CSSVal>;
export type ThemeBook = Record<ThemeName, Theme>;

const spaceUnit = 8;

const fontSizes: Record<FontSize, CSSVal> = {
	"small": "16px",
	"normal": "20px",
	"big": "24px",
	"huge": "32px",
}

const themes: ThemeBook = {
	"light": {
		"bg": "#ffffff",
		"bg2": "#f8f8f8",
		"bg3": "#eaeaea",
		"outline": "#eaeaea",
		"fg": "#333333",
		"fg2": "#666666",
		"fg3": "#999999",
		"fg4": "#cccccc",
		"highlight": "#0080ff",
		"title-bg": "#fff8bc",
	},
	"dark": {
		"bg": "#111117",
		"bg2": "#15151f",
		"bg3": "#21212f",
		"outline": "#25252f",
		"fg": "#dadada",
		"fg2": "#aaaaaa",
		"fg3": "#7a7a7a",
		"fg4": "#4a4a4a",
		"highlight": "#1090ef",
		"title-bg": "#132131",
	},
};

interface TextProps {
	color?: Color,
	size?: FontSize,
}

const Text: React.FC<TextProps> = ({
	color,
	size,
	children,
	...args
} = {
	color: "fg",
	size: "normal",
}) => (
	<div
		css={{
			fontSize: fontSizes[size ?? "normal"],
			color: themes["light"][color ?? "fg"],
		}}
		{...args}
	>
		{children}
	</div>
);

export enum StackDir {
	Hori = "row",
	Verti = "column",
}

export enum Align {
	Start = "flex-start",
	End = "flex-end",
	Center = "center",
	Stretch = "stretch",
	Baseline = "baseline",
}

export enum Justify {
	Start = "flex-start",
	End = "flex-end",
	Center = "center",
	Between = "space-between",
	Around = "space-around",
	Even = "space-evenly",
}

interface StackProps {
	dir?: StackDir,
	space?: number,
	reverse?: boolean,
	wrap?: boolean,
	align?: Align,
	justify?: Justify,
}

const Stack: React.FC<StackProps> = ({
	dir,
	space,
	reverse,
	wrap,
	align,
	justify,
	children,
	...args
} = {
	dir: StackDir.Verti,
	space: 0,
	reverse: false,
	wrap: true,
	align: Align.Start,
	justify: Justify.Start,
}) => {
	const marginSide = dir === StackDir.Hori ? "marginRight" : "marginBottom";
	return (
		<div
			css={{
				display: "flex",
//  				flexDirection: (dir ?? StackDir.Verti) + reverse ? "-reverse" : "",
				flexDirection: dir ?? StackDir.Verti,
				alignItems: align ?? Align.Start,
				justifyContent: align ?? Justify.Start,
				flexWrap: wrap ? "wrap" : "nowrap",
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

const VStack: React.FC<VStackProps> = ({...args}) => <Stack {...args} dir={StackDir.Verti} />;
const HStack: React.FC<HStackProps> = ({...args}) => <Stack {...args} dir={StackDir.Hori} />;

interface SpaceProps {
	space?: number,
}

const Space: React.FC<SpaceProps> = ({
	space,
	...args
} = {
	space: 0,
}) => {
	const size = (space ?? 0) * spaceUnit;
	return (
		<div
			css={{
				width: size,
				height: size,
			}}
		>
		</div>
	);
};

export {
	Text,
	Stack,
	VStack,
	HStack,
	Space,
};
