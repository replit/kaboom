import * as React from "react";
import ThemeCtx from "comps/theme";
import Toggle from "comps/toggle";

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

export default ThemeToggle;
