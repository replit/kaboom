// TODO: converge with play.tsx with "embed" query option

import fs from "fs/promises"
import * as React from "react"
import { GetServerSideProps } from "next"
import Head from "comps/Head"
import Editor, { EditorRef } from "comps/Editor"
import Button from "comps/Button"
import GameView, { GameViewRef } from "comps/GameView"
import View from "comps/View"
import useMediaQuery from "hooks/useMediaQuery"
import { useRouter } from "next/router"
import { getFirstQueries } from "lib/utils"

interface PlayProps {
	code: string,
}

const Play: React.FC<PlayProps> = ({
	code,
}) => {
	const router = useRouter()
	const query = getFirstQueries(router.query)
	const editorRef = React.useRef<EditorRef | null>(null)
	const gameviewRef = React.useRef<GameViewRef | null>(null)
	const isNarrow = useMediaQuery("(max-aspect-ratio: 1/1)")

	return <>
		<Head title="Kaboom Playground" scale={0.6} />
		<View stretch pad={1} dir="column" css={{ overflow: "hidden" }}>
			<View
				dir="row"
				align="center"
				justify="between"
				stretchX
				pad={1}
			>
				<View dir="row" gap={2} align="center">
					<Button
						text="Run"
						name="Run Button"
						desc="Run current code (Cmd+s)"
						action={() => {
							if (!editorRef.current) return
							if (!gameviewRef.current) return
							const content = editorRef.current.getContent()
							if (content) {
								gameviewRef.current.run(content)
							}
						}}
					/>
					<Button
						text="Stop"
						name="Stop Button"
						action={() => {
							if (!gameviewRef.current) return
							gameviewRef.current.run("")
						}}
					/>
				</View>
			</View>
			<View
				dir={isNarrow ? "column" : "row"}
				gap={2}
				pad={1}
				stretchX
				align="center"
				css={{
					flex: "1",
					overflow: "hidden",
				}}
			>
				<Editor
					name="Editor"
					desc="Where you edit the code"
					rounded
					outlined
					ref={editorRef}
					content={code}
					width={isNarrow ? "100%" : "45%"}
					height={isNarrow ? "55%" : "100%"}
					placeholder="Come on let's make some games!"
					css={{
						order: isNarrow ? 2 : 1,
						zIndex: 20,
						...(query["small"] ? {
							fontSize: "var(--text-small)",
						} : {}),
					}}
					keys={[
						{
							key: "Mod-s",
							run: () => {
								if (!gameviewRef.current) return false
								const gameview = gameviewRef.current
								if (!editorRef.current) return false
								const editor = editorRef.current
								gameview.run(editor.getContent() ?? "")
								return false
							},
							preventDefault: true,
						},
					]}
				/>
				<GameView
					name="Game View"
					desc="Where your game runs"
					ref={gameviewRef}
					code=""
					rounded
					width={isNarrow ? "100%" : "auto"}
					height={isNarrow ? "auto" : "100%"}
					css={{
						order: isNarrow ? 1 : 2,
						flex: "1",
						zIndex: 20,
					}}
				/>
			</View>
		</View>
	</>

}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const example = Array.isArray(ctx.query.example)
		? ctx.query.example[0]
		: ctx.query.example
	if (!example) {
		return {
			props: {
				code: "",
			},
		}
	}
	const content = await fs.readFile(`public/static/examples/${example}.js`, "utf8")
	return {
		props: {
			code: content,
		},
	}
}

export default Play
