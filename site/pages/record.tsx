import * as React from "react"
import Editor from "comps/Editor"
import Background from "comps/Background"

const UI: React.FC = () => (
	<Background pad={2} dir="column" gap={6} css={{ overflow: "scroll" }}>
		<Editor
			name="Code Editor"
			desc="Edit your code here!"
			width={640}
			height={640}
			placeholder="Congrats you have discovered the placeholder text"
			content={`
kaboom();

// load default sprite "bean"
loadBean();

// add to screen
add([
	sprite("bean"),
	pos(80, 40),
]);
			`.trim()}
		/>
	</Background>
)

export default UI

