import * as React from "react";
import ThemeCtx from "comps/theme";
import View from "comps/view";
import { themes } from "comps/ui";

interface ThemeSwitchProps {
	big?: boolean,
	onChange?: (on: boolean) => void,
}

const ThemeSwitch: React.FC<ThemeSwitchProps> = ({...args}) => {
	const { theme, setTheme } = React.useContext(ThemeCtx);
	return (
		<View dir="row" gap={1} align="center">
		{Object.keys(themes).map((t) => (
			<View
				key={t}
				onClick={() => setTheme(t)}
				bg={themes[t]["bg2"]}
				width={t === theme ? 32 : 28}
				height={t === theme ? 32 : 28}
				outlined
				css={{
					borderColor: t === theme ? "var(--color-highlight)" : "var(--color-outline)",
					borderRadius: "50%",
					cursor: "pointer",
				}}
			/>
		))}
		</View>
	);
};

export default ThemeSwitch;
