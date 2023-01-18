import * as React from "react"
import Background from "comps/Background"

export default function Doc() {
	return (
		<Background pad={6} dir="column" gap={6} css={{ overflow: "scroll" }}>
			todo
		</Background>
	)
}
