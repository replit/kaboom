import * as React from "react";
import View, { ViewProps } from "comps/View";
import Ctx from "lib/Ctx";
import { themes } from "lib/ui";

const ThemeSwitch: React.FC<ViewProps> = ({...args}) => {
	const { theme, setTheme } = React.useContext(Ctx);
	return (
		<View dir="row" gap={1.5} align="center" rounded wrap {...args}>
			{Object.keys(themes).map((t) => (
				<View
					key={t}
					name={t[0].toUpperCase() + t.slice(1)}
					desc="Theme"
					onClick={() => setTheme(t)}
					bg={themes[t]["bg2"]}
					width={24}
					height={24}
					outlined={t === theme}
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
