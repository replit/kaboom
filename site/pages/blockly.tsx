import { useRef } from "react"
import BlocklyEditor, { BlocklyEditorRef } from "comps/Blockly"
import GameView, { GameViewRef } from "comps/GameView"
import View from "comps/View"
import Button from "comps/Button"

export default function BlocklyPage() {
	const editorRef = useRef<BlocklyEditorRef | null>(null)
	const gameviewRef = useRef<GameViewRef | null>(null)
	return (
		<View stretch dir="column">
			<View stretchX bg={1} pad={2} dir="row">
				<Button text="Run" action={() => {
					if (!gameviewRef.current || !editorRef.current) return
					const code = editorRef.current.genCode()
					console.log(code)
					gameviewRef.current.run(code || "kaboom()")
				}} />
			</View>
			<View stretch dir="row">
				<BlocklyEditor
					ref={editorRef}
					css={{
						width: "55%",
						height: "100%",
					}}
				/>
				<GameView
					ref={gameviewRef}
					code="kaboom()"
					css={{
						width: "45%",
						height: "100%",
					}}
				/>
			</View>
		</View>
	)
}
