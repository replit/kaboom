import * as React from "react"
import Editor, { EditorRef } from "comps/Editor"
import GameView, { GameViewRef } from "comps/GameView"
import Button from "comps/Button"
import View from "comps/View"
import Background from "comps/Background"
import download from "lib/download"

const code = `
kaboom();

// load default sprite "bean"
loadBean();

// add to screen
add([
	sprite("bean"),
	pos(80, 40),
]);
`.trim()

type Action = [ number, "c" | "r", any ]

type Record = {
	doc: string,
	actions: Action[],
	initTime: number,
}

const Page: React.FC = () => {
	const editorRef = React.useRef<EditorRef | null>(null)
	const gameviewRef = React.useRef<GameViewRef | null>(null)
	const [record, setRecord] = React.useState<Record | null>(null)
	return (
		<Background pad={2} dir="column" gap={2} css={{ overflow: "scroll" }}>
			<View dir="row" gap={2}>
				<Button text={record ? "Stop Recording" : "Record"} action={() => {
					if (!editorRef.current) {
						alert("Editor not ready!")
						return
					}
					const content = editorRef.current.getContent()
					if (content === null) {
						alert("Editor not ready!")
						return
					}
					if (record) {
						download("record.json", JSON.stringify(record))
						setRecord(null)
					} else {
						setRecord({
							doc: content,
							initTime: new Date().getTime(),
							actions: [],
						})
					}
				}} />
				<Button text="Run" action={() => {
					if (!gameviewRef.current) return false
					const gameview = gameviewRef.current
					if (!editorRef.current) return false
					const editor = editorRef.current
					gameview.run(editor.getContent() ?? "")
					setRecord((r: Record | null) => {
						if (!r) return r
						return {
							...r,
							actions: [
								...r.actions,
								[ new Date().getTime() - r.initTime, "r" ]
							],
						}
					})
					return false
				}} />
			</View>
			<View stretch dir="row" gap={2}>
				<Editor
					name="Code Editor"
					desc="Edit your code here!"
					ref={editorRef}
					width="80%"
					stretchY
					onUpdate={(update) => {
						setRecord((r: Record | null) => {
							if (!r) return r
							return {
								...r,
								actions: [
									...r.actions,
									[ new Date().getTime() - r.initTime, "c", update.changes.toJSON() ]
								],
							}
						})
					}}
					placeholder="Congrats you have discovered the placeholder text"
					content={code}
				/>
				<GameView
					name="Game View"
					desc="Where your game runs"
					ref={gameviewRef}
					code={code}
					stretch
				/>
			</View>
		</Background>
	)
}

export default Page
