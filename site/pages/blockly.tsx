import { useEffect, useRef } from "react"
import BlocklyEditor, { BlocklyEditorRef } from "comps/Blockly"
import GameView, { GameViewRef } from "comps/GameView"
import download from "lib/download"
import openFileDialog from "lib/upload"
import View from "comps/View"
import Button from "comps/Button"

export default function BlocklyPage() {
	const editorRef = useRef<BlocklyEditorRef | null>(null)
	const gameviewRef = useRef<GameViewRef | null>(null)
	useEffect(() => {
		if (!editorRef.current) return
		const blocks = localStorage.getItem("blocks")
		if (blocks) {
			editorRef.current.load(JSON.parse(blocks))
		}
	}, [])
	return (
		<View stretch dir="column">
			<View stretchX bg={1} gap={2} pad={2} dir="row" justify="between">
				<View gap={2} dir="row">
					<Button text="Run" action={() => {
						if (!gameviewRef.current || !editorRef.current) return
						const code = editorRef.current.genCode()
						console.log(code)
						gameviewRef.current.run(code || "")
					}} />
					<Button text="Stop" action={() => {
						if (!gameviewRef.current) return
						gameviewRef.current.run("")
					}} />
				</View>
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
						}
					}} />
					<Button text="Save File" action={() => {
						if (!editorRef.current) return
						const name = window.prompt("File name:", "blocks.json")
						if (name) {
							download(name, JSON.stringify(editorRef.current.save()))
						}
					}} />
					<Button text="Load File" action={() => {
						if (!editorRef.current) return
						openFileDialog((file) => {
							const reader = new FileReader()
							reader.readAsText(file)
							reader.onload = (e) => {
								if (!editorRef.current) return
								if (e.target?.result) {
									editorRef.current.load(JSON.parse(e.target.result as string))
								}
							}
						}, [ "application/json" ])
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
					code=""
					css={{
						width: "45%",
						height: "100%",
					}}
				/>
			</View>
		</View>
	)
}
