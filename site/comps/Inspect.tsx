import * as React from "react"
import View from "comps/View"
import Text from "comps/Text"
import Ctx from "lib/Ctx"

const Inspect: React.FC = ({
	...args
}) => {

	const { inspect, setInspect } = React.useContext(Ctx)

	return <View
		name="Inspect Button"
		desc="Enter inspect mode (F1)"
		focusable
		onClick={() => setInspect(!inspect)}
		bg={3}
		align="center"
		justify="center"
		outlined
		width={32}
		height={32}
		css={{
			fontSize: "var(--text-normal)",
			cursor: "pointer",
			userSelect: "none",
			borderRadius: 16,
			":hover": {
				background: "var(--color-bg4)",
			},
			":active": {
				background: "var(--color-outline)",
			},
		}}
		{...args}
	>
		<Text color={2}>?</Text>
	</View>

}

export default Inspect
