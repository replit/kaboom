import * as React from "react";
import View from "comps/View";
import ThemeCtx from "lib/ThemeCtx";
import { themes, Theme } from "lib/ui";

const ThemeSwitch: React.FC = () => {
	const { theme, setTheme } = React.useContext(ThemeCtx);
	return (
		<View dir="row" gap={1} align="center">
			{Object.keys(themes).map((t) => (
				<View
					key={t}
					onClick={() => setTheme(t as Theme)}
					bg={themes[t as Theme]["bg2"]}
					width={t === theme ? 32 : 28}
					height={t === theme ? 32 : 28}
					outlined
					focusable
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
