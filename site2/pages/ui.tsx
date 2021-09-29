import * as React from "react";
import { Global, css } from "@emotion/react"

type Color =
	| "bg1"
	| "bg2"
	| "bg3"
	| "outline"
	| "fg1"
	| "fg2"
	| "fg3"
	| "fg4"
	| "highlight"
	| "title-bg"
	;

type Theme =
	| "light"
	| "dark"
	;

type FontSize =
	| "small"
	| "normal"
	| "big"
	| "huge"
	;

type CSSVal = string;
type ThemeDef = Record<Color, CSSVal>;
type ThemeBook = Record<Theme, ThemeDef>;

const spaceUnit = 8;

const fontSizes: Record<FontSize, CSSVal> = {
	"small": "16px",
	"normal": "20px",
	"big": "24px",
	"huge": "32px",
}

const themes: ThemeBook = {
	"light": {
		"bg1": "#ffffff",
		"bg2": "#f8f8f8",
		"bg3": "#eaeaea",
		"outline": "#eaeaea",
		"fg1": "#333333",
		"fg2": "#666666",
		"fg3": "#999999",
		"fg4": "#cccccc",
		"highlight": "#0080ff",
		"title-bg": "#fff8bc",
	},
	"dark": {
		"bg1": "#111117",
		"bg2": "#15151f",
		"bg3": "#21212f",
		"outline": "#25252f",
		"fg1": "#dfdfdf",
		"fg2": "#aaaaaa",
		"fg3": "#7a7a7a",
		"fg4": "#4a4a4a",
		"highlight": "#1090ef",
		"title-bg": "#132131",
	},
};

const defTheme: Theme = "light";

const vars = (() => {

	const buildCSSVars = (prefix: string, map: Record<string, CSSVal>): string => {
		let code = "";
		for (const k in map) {
			code += `--${prefix}-${k}: ${map[k]};`;
		}
		return code;
	}

	let code = `:root {${buildCSSVars("text", fontSizes)}${buildCSSVars("color", themes[defTheme])}}`;

	for (const theme in themes) {
		code += `.${theme} {${buildCSSVars("color", themes[theme as Theme])}}`;
	}

	return code;

})();

interface PageProps {
	theme?: Theme,
}

const ThemeCtx = React.createContext<{
	theme: Theme,
	setTheme(theme: Theme): void,
	nextTheme(): void,
}>({
	theme: defTheme,
	setTheme: () => {},
	nextTheme: () => {},
});

const Page: React.FC<PageProps> = ({
	theme,
	children,
	...args
} = {
	theme: defTheme,
}) => {

	const [ curTheme, setCurTheme ] = React.useState<Theme>(theme ?? defTheme);

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
//  				{...args}
			>
				<Global
					styles={css`
						${vars}
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
					`}
				/>
				{children}
			</div>
		</ThemeCtx.Provider>
	);

};

interface TextProps {
	color?: number,
	size?: FontSize,
}

const Text: React.FC<TextProps> = ({
	color,
	size,
	children,
	...args
} = {
	color: 1,
	size: "normal",
}) => (
	<div
		css={{
			fontSize: `var(--text-${size ?? "normal"})`,
			color: `var(--color-fg${color ?? "1"})`
		}}
		{...args}
	>
		{children}
	</div>
);

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

interface SpacerProps {
	space?: number,
}

const Spacer: React.FC<SpacerProps> = ({
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
			{...args}
		>
		</div>
	);
};

interface ButtonProps {
	text: string,
	onClick?: () => void,
}

const Button: React.FC<ButtonProps> = ({
	text,
	onClick,
	...args
}) => (
	<button
		onClick={onClick ?? (() => {})}
		css={{
			background: "var(--color-bg3)",
			color: "var(--color-fg1)",
			padding: "4px 8px",
			border: "solid 2px var(--color-outline)",
			borderRadius: "8px",
			fontSize: "var(--text-normal)",
			cursor: "pointer",
			":hover": {
				background: "var(--color-outline)",
			},
		}}
		{...args}
	>
		{text}
	</button>
);

interface SelectProps {
	options: string[],
	selected?: string,
	onChange?: (item: string) => void,
}

const Select: React.FC<SelectProps> = ({
	options,
	selected,
	onChange,
	...args
}) => {

	if (options.length <= 0) {
		throw new Error("empty options");
	}

	const [ curItem, setCurItem ] = React.useState(selected ?? options[0]);

	return (
		<select
			css={{
				background: "var(--color-bg3)",
				color: "var(--color-fg1)",
				padding: "4px 8px",
				border: "solid 2px var(--color-outline)",
				borderRadius: "8px",
				fontSize: "var(--text-normal)",
				cursor: "pointer",
				outline: "none",
			}}
			value={curItem}
			onChange={(e) => {
				onChange && onChange(e.target.value);
				setCurItem(e.target.value);
			}}
			{...args}
		>
			{options.map((opt) => (
				<option key={opt}>{opt}</option>
			))}
		</select>
	);

};

interface ToggleProps {
	offIcon?: string,
	onIcon?: string,
	on?: boolean,
	big?: boolean,
	onChange: (on: boolean) => void,
}

const Toggle: React.FC<ToggleProps> = ({
	on,
	big,
	offIcon,
	onIcon,
	onChange,
	...args
}) => {

	const stripWidth = 56;
	const size = 32;
	const [ isOn, setIsOn ] = React.useState(on ?? false);

	React.useEffect(() => {
		if (on != null) {
			setIsOn(on);
		}
	}, [on]);

	return (
		<div
			css={{
				width: stripWidth,
				height: size,
				borderRadius: size / 2,
				background: "var(--color-bg3)",
				position: "relative",
				cursor: "pointer",
			}}
			onClick={() => {
				onChange(!isOn);
				setIsOn(!isOn);
			}}
			{...args}
		>
			<div
				css={{
					width: size,
					height: size,
					borderRadius: size / 2,
					border: "solid 4px var(--color-bg3)",
					position: "absolute",
					background: "var(--color-bg1) no-repeat 50% 50%",
					...((onIcon || offIcon) ? {
						...(isOn ? {
							backgroundImage: `url(${onIcon})`,
						} : {
							backgroundImage: `url(${offIcon})`,
						})
					} : {}),
					backgroundSize: "60% 60%",
					left: isOn ? 24 : 0,
				}}
			>
			</div>
		</div>
	);

};

interface ThemeToggleProps {
	big?: boolean,
	onChange?: (on: boolean) => void,
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({...args}) => {
	const { theme, nextTheme } = React.useContext(ThemeCtx);
	return (
		<Toggle
			on={theme === "dark"}
			onChange={nextTheme}
			offIcon="/img/sun.svg"
			onIcon="/img/moon.svg"
			{...args}
		/>
	);
};

export {
	Page,
	Text,
	Stack,
	VStack,
	HStack,
	Spacer,
	Button,
	Select,
	Toggle,
	ThemeToggle,
	ThemeCtx,
};
