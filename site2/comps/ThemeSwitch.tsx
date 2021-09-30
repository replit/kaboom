import * as React from "react";
import View from "comps/View";
import Ctx from "lib/Ctx";
import { themes, Theme } from "lib/ui";

const ThemeSwitch: React.FC = () => {
	const { theme, setTheme } = React.useContext(Ctx);
	return (
		<View dir="row" gap={1.5} align="center">
			{Object.keys(themes).map((t) => (
				<View
					key={t}
					onClick={() => setTheme(t as Theme)}
					bg={themes[t as Theme]["bg2"]}
					width={t === theme ? 32 : 24}
					height={t === theme ? 32 : 24}
					outlined
					focusable
					css={{
						outlineColor: t === theme ? "var(--color-highlight)" : "var(--color-outline)",
						borderRadius: "50%",
						cursor: "pointer",
					}}
				/>
			))}
		</View>
	);
};

export default ThemeSwitch;
