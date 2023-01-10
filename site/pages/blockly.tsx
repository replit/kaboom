import { useEffect, useRef } from "react"
import BlocklyEditor, { BlocklyEditorRef } from "comps/Blockly"
import GameView, { GameViewRef } from "comps/GameView"
import View from "comps/View"
import Button from "comps/Button"

export default function BlocklyPage() {
	const editorRef = useRef<BlocklyEditorRef | null>(null)
	const gameviewRef = useRef<GameViewRef | null>(null)
	return (
		<View stretch dir="column">
			<View stretchX bg={1} gap={2} pad={2} dir="row" justify="between">
				<Button text="Run" action={() => {
					if (!gameviewRef.current || !editorRef.current) return
					const code = editorRef.current.genCode()
					console.log(code)
					gameviewRef.current.run(code || "kaboom()")
				}} />
				<View gap={2} dir="row">
					<Button text="Save" action={() => {
						if (!editorRef.current) return
						localStorage.setItem("blocks", JSON.stringify(editorRef.current.save()))
					}} />
					<Button text="Load" action={() => {
						if (!editorRef.current) return
						const blocks = localStorage.getItem("blocks")
						if (blocks) {
							editorRef.current.load(JSON.parse(blocks))
							const code = editorRef.current.genCode()
							if (code) {
								gameviewRef.current?.run()
							}
						}
					}} />
				</View>
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
