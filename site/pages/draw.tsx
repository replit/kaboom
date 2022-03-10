import fs from "fs/promises"
import path from "path"
import * as React from "react"
import { GetServerSideProps } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
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
import Inspect from "comps/Inspect"
import Drop from "comps/Drop"
import Drawer from "comps/Drawer"
import Background from "comps/Background"
import Doc from "comps/Doc"
import download from "lib/download"
import wrapHTML from "lib/wrapHTML"
import Ctx from "lib/Ctx"

// TODO: CLEAN

const DRAW_CODE = `
// this code runs every frame
// try hold alt and drag / click values

const outline = {
	color: rgb(0, 0, 0),
	width: 4,
}

drawRect({
	pos: vec2(40, 80),
	width: 80,
	height: 120,
	origin: "topleft",
	radius: 4,
	angle: 0,
	color: rgb(128, 255, 255),
	outline,
})

drawSprite({
	sprite: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAxCAMAAABdyV+IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOUExURQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcLEAgLEA4WIA4XIA8WIA8XIBAMEBUiLxYiLxYiMB0tPyAYHyAYICQ4TyU4TytDXyxDXzAkLjAkLzNPbzpafztZf0AwPkAwP0Flj0Jkj0Jlj0lwnlA8TlB8rlF7rleGvliGvl9IXl+Rzl+SzmBIXWBIXmad3Wad3m6o7XBUbXWz/X9hfYBgfIBgfY9tjJBsjJBsjZBtjZ94nJ95nKB4nKB5nK+Eq6+Fq7CEq7CFrL+Qu7+Ru8+dys+dy9Cdy9+p2u+16f/B+Se1j8gAAAAXdFJOUwAQIDBAUF9gb3B/gI+Qn6CvsL/P0N/vIiFUiwAAAxhJREFUSMedltl60zAQheWlFDckFKfWz2qgYW0hLA17oclQoKwFQon9/i/Che1YspX0C3Nnz5yj2TQapRZIGPnmx7paUdaBXkkRxkBnRYLzAMmaUkptAND/Dw+AMxWe7soxJADaL5jilXOglOoAaA0koaXwfIe1F/XiON7smKYRpQRGPbp9DehN26UgrmzRvTn/WvWv75WnbOi5HUlU489iSUnh19bnitMT265fHdWjIUX5YoCHr28AhEqpc5U6vVXZFQyF4tHn4+n0+O2gUG2UhXwiMr4CxMorokwnx1me5yeFYeJVfTKY5qV8HZQMfeCeiMhLgHATgPdZZTcblbH5AINZXsv7ImyAAxERuQdogMFfwyx/VcR2vonP85O0jPG2yNyFtlm2A1xQfeB7bstJiXhWEMi2C5/nU0ArgLwpHwG4XOLlKQDTlhmA0sCspdqhSqGIyBhg1DL6DWgVA5OW7siMQOQK8M15Sq8o93FTN6trICKy6zrlsOywBEj/OLy7PsfLHjB04XtKqRAHw1FdRBGRd0DqwBe9HAGkdhQT4EFNIJeArIXXgTE5+GTqh1YORW4CppP7Jr5iOGwk+I1BcNcqQza08Q6GFBgbBLvAhzn+PkAStIfwodVjBl6emnUcGrOgHmra7IcZcNEk2AP2zfxttQZroIE0qwmumgTPgUdGj2157bkcUMfZInhRE0wc/teZHJ1OMATcz8ya7eYighEQOQku1IlaRvABiF14n7rbsmYVDIKsGvOu93hnUR+YZRwueKtjczgOrHFgN9JPIHEQYM62ncZl2jVuWwbgOVOQWtf5sUGwDfwy3fOdBANroGw35sEf86Y5Okmbk/sLcLG+jq9N9z4BekES50/kT4CXVg6rKk6qWdhaDAEYfsuqoWrEcK2sUPZjkhar08KdCBhOjn5/xXRhD2B/MhpUG8L6kq3KlKtFFsbXGvtHuGgv8+MGw40DERnfsf7pjrdktQu6fZvi9oPdS+Za1A1PXQ/9sNOL+9rm0XGvG60H3ip7phdszvFbvvovKdbdU6JeLmHUicKl8H8a8qVPhrjeUAAAAABJRU5ErkJggg==",
	flipX: false,
	pos: vec2(200),
})

for (let i = 0; i < 1; i++) {
	drawTriangle({
		pos: vec2(320, 240),
		p1: vec2(200),
		p2: vec2(0),
		p3: vec2(240, -140),
		color: hsl2rgb((i * 0.1) % 1, 0.6, 0.8),
		opacity: 1 - i * 0.005,
		angle: i * 10,
		outline,
	})
}

drawEllipse({
	pos: vec2(160, 400),
	radiusX: 48,
	radiusY: 64,
	color: rgb(255, 255, 128),
	outline,
})
`.trim()

const template = `
kaboom()

let drawCode = null
let lastDrawCode = null
let err = null

const sprites = {}
const origDrawSprite = drawSprite

window.drawSprite = (opt) => {
	let src = opt.sprite;
	if (!src) return;
	if (src.startsWith("data:image/")) {
		if (sprites[src]) {
			src = sprites[src]
		} else {
			// TODO: prevent multiple
			loadSprite(src, src).then((spr) => {
				sprites[src] = spr
			})
			return
		}
	}
	origDrawSprite({
		...opt,
		sprite: src,
	})
}

window.addEventListener("message", (e) => {
	const data = JSON.parse(e.data)
	if (data.drawCode) {
		drawCode = data.drawCode
	}
})

onDraw(() => {
	if (drawCode) {
		try {
			eval(drawCode)
			lastDrawCode = drawCode
			err = null
			debug.clearLog()
		} catch (e) {
			if (lastDrawCode) eval(lastDrawCode)
			if (!err || err.toString() !== e.toString()) {
				debug.error(e)
				err = e
			}
		}
	}
})
`.trim()

interface Sprite {
	name: string,
	src: string,
}

interface SpriteEntryProps {
	name: string,
	src: string,
	onDragStart?: () => void,
}

type Shape = {
	img: string,
	code: string,
}

type ShapeEntryProps = Shape & {
	onDragStart?: () => void,
}

const shapes = [
	{
		img: "/sprites/rect.png",
		code: `
drawRect({
	pos: vec2(80, 80),
	width: 120,
	height: 80,
	color: rgb(250, 242, 164),
})
		`.trim(),
	},
	{
		img: "/sprites/triangle.png",
		code: `
drawTriangle({
	pos: vec2(100, 100),
	p1: vec2(0, -48),
	p2: vec2(-60, 48),
	p3: vec2(60, 48),
	color: rgb(164, 250, 204),
})
	`.trim(),
	},
	{
		img: "/sprites/circle.png",
		code: `
drawCircle({
	pos: vec2(100, 100),
	radius: 48,
	color: rgb(181, 164, 250),
})
		`.trim(),
	},
	{
		img: "/sprites/ellipse.png",
		code: `
drawEllipse({
	pos: vec2(60, 60),
	radiusX: 64,
	radiusY: 40,
	color: rgb(164, 209, 250),
})
		`.trim(),
	},
	{
		img: "/sprites/polygon.png",
		code: `
drawPolygon({
	pos: vec2(100, 100),
	pts: [
		vec2(0, -48),
		vec2(-64, 0),
		vec2(-32, 64),
		vec2(32, 64),
		vec2(64, 0),
	],
	color: rgb(250, 164, 226),
})
		`.trim(),
	},
	{
		img: "/sprites/text.png",
		code: `
drawText({
	text: "hi",
	pos: vec2(60, 60),
})
		`.trim(),
	},
]

const ShapeEntry: React.FC<ShapeEntryProps> = ({ img, code, onDragStart }) => (
	<View
		focusable
		draggable
		dir="row"
		align="center"
		gap={1}
		pad={1}
		rounded
		height={64}
		onDragStart={(e) => {
			e.dataTransfer.setData("code", code)
			onDragStart && onDragStart()
		}}
		css={{
			"overflow": "hidden",
			":hover": {
				"background": "var(--color-bg2)",
				"cursor": "pointer",
			},
		}}
	>
		<img
			src={img}
			css={{
				userDrag: "none",
				height: "100%",
			}}
		/>
	</View>
)

const SpriteEntry: React.FC<SpriteEntryProps> = ({
	name,
	src,
	onDragStart,
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
		height={64}
		onDragStart={(e) => {
			e.dataTransfer.setData("code", `"${src}"`)
			onDragStart && onDragStart()
		}}
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
	onDragStart: () => void,
}

const SoundEntry: React.FC<SoundEntryProps> = ({
	name,
	src,
	onDragStart,
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
			"cursor": "pointer",
			":hover": {
				"background": "var(--color-bg2)",
			},
		}}
		onClick={() => new Audio(src).play()}
	>
		<Text>{path.basename(name)}</Text>
	</View>
)

interface Sound {
	name: string,
	src: string,
}

const Play: React.FC = () => {

	const gameviewRef = React.useRef<GameViewRef | null>(null)
	const isNarrow = useMediaQuery("(max-aspect-ratio: 1/1)")
	const [ backpackOpen, setBackpackOpen ] = React.useState(false)
	const [ sprites, setSprites ] = useSavedState<Sprite[]>("sprites", [])
	const [ sounds, setSounds ] = useSavedState<Sound[]>("sounds", [])
	const spaceUsed = useSpaceUsed()
	const editorRef = React.useRef<EditorRef | null>(null)
	const getInitCode = React.useCallback(() => localStorage["drawCode"] ?? DRAW_CODE, [])

	useKey("Escape", () => {
		setBackpackOpen(false)
	}, [ setBackpackOpen ])

	useKey("b", (e) => {
		if (!e.metaKey) return
		e.preventDefault()
		setBackpackOpen((b) => !b)
	}, [ setBackpackOpen ])

	return <>
		<Head
			title="Kaboom Draw"
			scale={0.6}
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
						<Link href="/" passHref>
							<a>
								<img
									src="/site/img/k.png"
									css={{
										width: 48,
										cursor: "pointer",
									}}
									alt="logo"
								/>
							</a>
						</Link>
					</View>
					<Button
						name="Run Button"
						desc="Run current code (Cmd+s)"
						text="Run"
						action={() => gameviewRef.current?.run(template)}
					/>
				</View>
				<View dir="row" gap={2} align="center">
					<Button
						name="Reset Button"
						desc="Clear stored code"
						text="Reset"
						action={() => {
							editorRef.current?.setContent(DRAW_CODE)
							delete localStorage["drawCode"]
							gameviewRef.current?.run(template)
						}}
					/>
					{ !isNarrow &&
						<ThemeSwitch />
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
					paddingLeft: (isNarrow) ? 16 : 44,
				}}
			>
				<View
					width={isNarrow ? "100%" : "45%"}
					height={isNarrow ? "55%" : "100%"}
					css={{
						position: "relative",
						order: isNarrow ? 2 : 1,
					}}
				>
					<Editor
						ref={editorRef}
						content={getInitCode}
						name="Draw Code Editor"
						desc="Code here runs every frame, changes are reflected in output immediately."
						onChange={(code) => {
							gameviewRef.current?.send({ drawCode: code })
							localStorage["drawCode"] = code
						}}
						stretch
						css={{
							position: "absolute",
							bottom: 0,
							right: 0,
						}}
						placeholder="Come on let's make some games!"
						keys={[
							{
								key: "Mod-s",
								run: () => {
									gameviewRef.current?.run(template)
									return false
								},
								preventDefault: true,
							},
						]}
					/>
				</View>
				<GameView
					name="Game View"
					desc="Where your game runs"
					ref={gameviewRef}
					code={template}
					onLoad={() => {
						gameviewRef.current?.send({
							drawCode: localStorage["drawCode"] ?? DRAW_CODE,
						})
					}}
					width={isNarrow ? "100%" : "auto"}
					height={isNarrow ? "auto" : "100%"}
					css={{
						order: isNarrow ? 1 : 2,
						flex: "1",
					}}
				/>
			</View>
			{ !isNarrow &&
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
					<View
						name="Shapes"
						desc="Drag a shape into draw editor and see what happens!"
						pad={1}
						rounded
						gap={1}
						stretchX
					>
						<Text color={3}>Shapes</Text>
						<View
							dir="row"
							gap={1}
							wrap
						>
							{ shapes.map((shape) => <ShapeEntry
								{...shape}
								key={shape.code}
								onDragStart={() => setBackpackOpen(false)}
							/>) }
						</View>
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
										onDragStart={() => setBackpackOpen(false)}
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
										onDragStart={() => setBackpackOpen(false)}
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

export default Play
