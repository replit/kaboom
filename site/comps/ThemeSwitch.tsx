import * as React from "react"
import View, { ViewProps } from "comps/View"
import useSavedState from "hooks/useSavedState"
import Ctx from "lib/Ctx"
import { themes, noobThemes } from "lib/ui"
import { capitalize } from "lib/str"

const ThemeSwitch: React.FC<ViewProps> = ({...args}) => {

	const { theme, setTheme } = React.useContext(Ctx)
	const [ showDa, setShowDa ] = useSavedState("showmedacolors", false)

	// @ts-ignore
	React.useEffect(() => {
		// @ts-ignore
		window.showmedacolors = () => {
			setShowDa(true)
			console.log("yessir whatever")
		}
		// @ts-ignore
		return () => delete window.showmedacolors
	}, [ setShowDa ])

	return (
		<View pad={0.5} dir="row" gap={1.5} align="center" rounded wrap {...args}>
			{(showDa ? Object.keys(themes) : noobThemes).map((t) => (
				<View
					key={t}
					name={capitalize(t)}
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
	)

}

export default ThemeSwitch
