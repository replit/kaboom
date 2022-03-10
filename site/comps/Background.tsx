import * as React from "react"
import View, { ViewProps } from "comps/View"
import { keyframes } from "@emotion/react"
import { themes } from "lib/ui"
import Ctx from "lib/Ctx"

const Background: React.FC<ViewProps> = ({
	children,
	...args
}) => {
	const { theme } = React.useContext(Ctx)
	const patColor = themes[theme]["bgpat"]
	return (
		<View
			stretch
			css={{
				background: `url('data:image/svg+xml;utf8,<svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 32L14.6774 6L39 13.9322L10 32Z" stroke="${patColor}" stroke-width="4" stroke-linejoin="round"/><circle cx="74.5" cy="64.5" r="8.5" stroke="${patColor}" stroke-width="4"/><path d="M76.0172 18.0537C56.1796 21.7223 71.4991 39.7933 51.0001 44.1491" stroke="${patColor}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><rect x="12.6557" y="70.7719" width="19.2945" height="19.2945" rx="2" transform="rotate(-24.8755 12.6557 70.7719)" stroke="${patColor}" stroke-width="4" stroke-linejoin="round"/><circle cx="32" cy="44" r="2" fill="${patColor}"/><circle cx="58" cy="7" r="2" fill="${patColor}"/><circle cx="90" cy="33" r="2" fill="${patColor}"/><circle cx="52" cy="66" r="2" fill="${patColor}"/><circle cx="3" cy="86" r="2" fill="${patColor}"/></svg>') repeat var(--color-bg1)`,
			}}
			{...args}
		>
			{children}
		</View>
	)
}

export default Background
