import * as React from "react";
import View, { ViewProps } from "comps/View";
import useSavedState from "hooks/useSavedState";
import Ctx from "lib/Ctx";
import { themes, commonThemes } from "lib/ui";

const ThemeSwitch: React.FC<ViewProps> = ({...args}) => {

	const { theme, setTheme } = React.useContext(Ctx);
	const [ showMore, setShowMore ] = useSavedState("showmedacolors", false);

	// @ts-ignore
	React.useEffect(() => {
		// @ts-ignore
		window.showmedacolors = () => {
			setShowMore(true);
			console.log("yessir whatever");
		};
		// @ts-ignore
		return () => delete window.showmedacolors;
	}, [])

	return (
		<View pad={0.5} dir="row" gap={1.5} align="center" rounded wrap {...args}>
			{(showMore ? Object.keys(themes) : commonThemes).map((t) => (
				<View
					key={t}
					name={t[0].toUpperCase() + t.slice(1)}
					desc="Theme"
					onClick={() => setTheme(t)}
					bg={themes[t]["bg4"]}
					width={24}
					height={24}
					outlined={t === theme}
					focusable
					css={{
						boxShadow: t === theme ? "0 0 0 2px var(--color-highlight)" : "none",
						borderRadius: "50%",
						cursor: "pointer",
					}}
				/>
			))}
		</View>
	);

};

export default ThemeSwitch;
