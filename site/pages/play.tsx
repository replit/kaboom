import fs from "fs/promises"
import path from "path"
import * as React from "react"
import { GetServerSideProps } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import pako from "pako"
import { Share2 } from "react-feather"
import useKey from "hooks/useKey"
import useSavedState from "hooks/useSavedState"
import useClickOutside from "hooks/useClickOutside"
import useSpaceUsed from "hooks/useSpaceUsed"
import useMediaQuery from "hooks/useMediaQuery"
import Head from "comps/Head"
import Editor, { EditorRef } from "comps/Editor"
import GameView, { GameViewRef } from "comps/GameView"
import Button from "comps/Button"
import ThemeSwitch from "comps/ThemeSwitch"
import Select from "comps/Select"
import View from "comps/View"
import Text from "comps/Text"
import Menu from "comps/Menu"
import Drop from "comps/Drop"
import Drawer from "comps/Drawer"
import Background from "comps/Background"
import Doc from "comps/Doc"
import download from "lib/download"
import wrapHTML from "lib/wrapHTML"
import { getFirstQueries } from "lib/utils"
import EXAMPLES_CFG from "public/static/examples/examples.json"

const DEFAULT_EXAMPLE = "add"

interface SpriteEntryProps {
	name: string,
	src: string,
}

const SpriteEntry: React.FC<SpriteEntryProps> = ({
	name,
	src,
}) => (
	<View
		focusable
		draggable
		dir="row"
		align="center"
		gap={1}
		stretchX
		padX={2}
		padY={1}
		rounded
		height={64}
		css={{
			"overflow": "hidden",
			":hover": {
				"background": "var(--color-bg2)",
				"cursor": "pointer",
			},
		}}
	>
		<View width={48} height={48} justify="center">
			<img
				src={src}
				alt={name}
				css={{
					userDrag: "none",
					width: "100%",
					overflow: "hidden",
					objectFit: "cover",
				}}
			/>
		</View>
		<Text>{path.basename(name)}</Text>
	</View>
)

interface SoundEntryProps {
	name: string,
	src: string,
}

const SoundEntry: React.FC<SoundEntryProps> = ({
	name,
	src,
}) => (
	<View
		focusable
		dir="row"
		align="center"
		gap={1}
		stretchX
		padX={2}
		padY={1}
		rounded
		height={48}
		css={{
			"overflow": "hidden",
			":hover": {
				"background": "var(--color-bg2)",
				"cursor": "pointer",
			},
		}}
		onClick={() => new Audio(src).play()}
	>
		<Text>{path.basename(name)}</Text>
	</View>
)

interface Sprite {
	name: string,
	src: string,
}

interface Sound {
	name: string,
	src: string,
}

interface PlayProps {
	examples: Record<string, string>,
}

function compressStr(str: string) {
	return btoa(String.fromCharCode.apply(null, Array.from(pako.deflate(str))))
}

function decompressStr(str: string) {
	return pako.inflate(
		new Uint8Array(atob(str).split("").map((c) => c.charCodeAt(0))),
		{ to: "string" },
	)
}

const Play: React.FC<PlayProps> = ({
	examples,
}) => {
	const router = useRouter()
	const query = getFirstQueries(router.query)
	const example = query["example"] || DEFAULT_EXAMPLE
	const code = query["code"] ? decompressStr(query["code"]) : examples[example]
	const [ backpackOpen, setBackpackOpen ] = React.useState(false)
	const [ sprites, setSprites ] = useSavedState<Sprite[]>("sprites", [])
	const [ sounds, setSounds ] = useSavedState<Sound[]>("sounds", [])
	const [ blackboard, setBlackboard ] = React.useState<string | null>(null)
	const editorRef = React.useRef<EditorRef | null>(null)
	const gameviewRef = React.useRef<GameViewRef | null>(null)
	const blackboardRef = React.useRef(null)
	const isNarrow = useMediaQuery("(max-aspect-ratio: 1/1)")
	const spaceUsed = useSpaceUsed()
	const [ make, setMake ] = React.useState(false)

	// EXAMPLE_ORDER defines the demos that should appear at the top of the list
	// names not defined in the list just fall to their default order
	const exampleList = React.useMemo(() => {
		return [...new Set([
			...EXAMPLES_CFG.order,
			...Object.keys(examples),
		])].filter((name) => !EXAMPLES_CFG.hidden.includes(name))
	}, [ examples ])

	React.useEffect(() => {
		if (router.isReady && !router.query.example) {
			router.replace({
				query: {
					...router.query,
					example: DEFAULT_EXAMPLE,
				},
			}, undefined, { shallow: true })
		}
	}, [ router ])

	useKey("Escape", () => {
		setBackpackOpen(false)
		setBlackboard(null)
	}, [ setBackpackOpen, setBlackboard ])

	useKey("b", (e) => {
		if (!e.metaKey) return
		e.preventDefault()
		setBackpackOpen((b) => !b)
	}, [ setBackpackOpen ])

	useClickOutside(blackboardRef, () => setBlackboard(null), [ setBlackboard ])

	return <>
		<Head
			title="Kaboom Playground"
			scale={0.6}
			twitterPlayer={{
				url: `https://kaboomjs.com/example/${example}`,
				width: 480,
				height: 480,
			}}
		/>
		<Background dir="column" css={{ overflow: "hidden" }}>
			<View
				dir="row"
				align="center"
				justify="between"
				stretchX
				padY={1}
				padX={2}
			>
				<View dir="row" gap={2} align="center">
					<View
						rounded
						desc="Back to home"
					>
						<Link href="/">
							<img
								src="/static/img/k.png"
								css={{
									width: 48,
									cursor: "pointer",
								}}
								alt="logo"
							/>
						</Link>
					</View>
					{ !make &&
						<Select
							name="Example Selector"
							desc="Select a example to run"
							options={exampleList}
							value={example}
							onChange={(example) => router.push({
								query: {
									example: example,
								},
							}, undefined, { shallow: true })}
						/>
					}
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
						name="Share"
						desc="Generate a link of the current code"
						action={() => {
							if (!editorRef.current) return
							const content = editorRef.current.getContent() ?? ""
							const compressed = compressStr(content)
							const queryCopy = { ...query }
							queryCopy["code"] = encodeURIComponent(compressed)
							const queryStr = Object.entries(queryCopy).map(([k, v]) => `${k}=${v}`).join("&")
							const url = `${window.location.origin}${window.location.pathname}?${queryStr}`
							if (url.length <= 2048) {
								navigator.clipboard.writeText(url).then(() => {
									alert("Share link copied to clipboard!")
								})
							} else {
								alert("Code too long to encode in URL")
							}
						}}
					>
						<Share2 />
					</Button>
				</View>
				<View dir="row" gap={2} align="center">
					{ !isNarrow &&
						<ThemeSwitch />
					}
					{ !isNarrow && make &&
						<Menu left items={[
							{
								name: "Export",
								action: () => {
									const name = prompt("File name: ")
									download(`${name}.html`, wrapHTML(code))
								},
							},
						]} />
					}
				</View>
			</View>
			<View
				dir={isNarrow ? "column" : "row"}
				gap={2}
				stretchX
				align="center"
				padY={isNarrow ? 1 : 2}
				css={{
					flex: "1",
					overflow: "hidden",
					paddingTop: 2,
					paddingBottom: 16,
					paddingRight: 16,
					paddingLeft: (isNarrow || !make) ? 16 : 44,
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
						{
							key: "Mod-e",
							run: () => {
								if (!editorRef.current) return false
								const editor = editorRef.current
								const sel = editor.getSelection() || editor.getWord()
								setBlackboard(sel)
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
					code={code}
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
			<View
				name="Blackboard"
				desc="Watch closely what the teacher is demonstrating!"
				ref={blackboardRef}
				height={360}
				width={540}
				rounded
				outlined
				pad={3}
				bg={1}
				css={{
					position: "absolute",
					left: "45%",
					top: blackboard ? -4 : -544,
					transition: "0.2s top",
					overflowY: "auto",
					overflowX: "hidden",
					zIndex: 200,
				}}
			>
				{
					blackboard &&
					<Doc name={blackboard} />
				}
			</View>
			{ !isNarrow && make &&
				<Drawer
					name="Backpack"
					desc="A place to put all your stuff"
					handle
					bigHandle
					expanded={backpackOpen}
					setExpanded={setBackpackOpen}
					height="80%"
					pad={2}
				>
					<View padX={1} gap={2} stretchX>
						<Text size="big" color={2}>Backpack</Text>
					</View>
					<Drop
						pad={1}
						rounded
						readAs="dataURL"
						gap={1}
						stretchX
						accept="image"
						onLoad={(file, content) => {
							setSprites((prev) => {
								for (const spr of prev) {
									if (spr.src === content) {
										// TODO: err msg?
										return prev
									}
								}
								return [
									...prev,
									{
										name: file.name,
										src: content,
									},
								]
							})
						}}
					>
						<Text color={3}>Sprites</Text>
						{
							sprites
								.sort((a, b) => a.name > b.name ? 1 : -1)
								.map(({name, src}) => (
									<SpriteEntry
										key={name}
										name={name}
										src={src}
									/>
								))
						}
					</Drop>
					<Drop
						pad={1}
						rounded
						readAs="dataURL"
						gap={1}
						stretchX
						accept="^audio/"
						onLoad={(file, content) => {
							setSounds((prev) => {
								for (const snd of prev) {
									if (snd.src === content) {
										// TODO: err msg?
										return prev
									}
								}
								return [
									...prev,
									{
										name: file.name,
										src: content,
									},
								]
							})
						}}
					>
						<Text color={3}>Sounds</Text>
						{
							sounds
								.sort((a, b) => a.name > b.name ? 1 : -1)
								.map(({name, src}) => (
									<SoundEntry
										key={name}
										name={name}
										src={src}
									/>
								))
						}
					</Drop>
					<View stretchX padX={1}>
						<Text color={4} size="small">Space used: {(spaceUsed / 1024 / 1024).toFixed(2)}mb</Text>
					</View>
				</Drawer>
			}
		</Background>
	</>

}

export const getStaticProps: GetServerSideProps = async () => {
	const examplesDir = (await fs.readdir("public/static/examples"))
		.filter((p) => !p.startsWith("."))
	const examples: Record<string, string> = {}
	for (const file of examplesDir) {
		const ext = path.extname(file)
		const name = path.basename(file, ext)
		if (ext === ".js") {
			examples[name] = await fs.readFile(`public/static/examples/${file}`, "utf8")
		}
	}
	return {
		props: {
			examples,
		},
	}
}

export default Play
