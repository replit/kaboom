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
			fontSize: fontSizes[size],
			color: themes["light"][color],
		}}
		{...args}
	>
		{children}
	</div>
);

enum StackDir {
	Hori,
	Verti,
}

interface StackProps {
	dir?: StackDir,
	space?: number,
	reversed?: boolean,
}

const Stack: React.FC<StackProps> = ({
	dir,
	space,
	children,
	...args
} = {
	dir: StackDir.Verti,
	space: 0,
	reversed: false,
}) => (
	<div
		css={{
			flexDirection: dir === StackDir.Hori ? "row" : "column",
			"& > *": { marginBottom: space * 8, },
			"& > *:last-child": { marginBottom: 0, },
		}}
		{...args}
	>
		{children}
	</div>
);

type VStackProps = Omit<StackProps, "dir">;
type HStackProps = Omit<StackProps, "dir">;

const VStack: React.FC<VStackProps> = ({...args}) => <Stack {...args} dir={StackDir.Verti} />;
const HStack: React.FC<HStackProps> = ({...args}) => <Stack {...args} dir={StackDir.Verti} />;

export {
	Text,
	VStack,
	HStack,
};
