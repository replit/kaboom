import fs from "fs/promises";
import path from "path";
import * as React from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import useKey from "hooks/useKey";
import useSavedState from "hooks/useSavedState";
import useClickOutside from "hooks/useClickOutside";
import useSpaceUsed from "hooks/useSpaceUsed";
import useMediaQuery from "hooks/useMediaQuery";
import Head from "comps/Head";
import Editor, { EditorRef } from "comps/Editor";
import GameView, { GameViewRef } from "comps/GameView";
import Button from "comps/Button";
import ThemeSwitch from "comps/ThemeSwitch";
import Select from "comps/Select";
import View from "comps/View";
import Text from "comps/Text";
import Menu from "comps/Menu";
import Inspect from "comps/Inspect";
import FileDrop from "comps/FileDrop";
import Drawer from "comps/Drawer";
import Draggable from "comps/Draggable";
import Droppable from "comps/Droppable";
import Background from "comps/Background";
import Doc from "comps/Doc";
import download from "lib/download";
import wrapHTML from "lib/wrapHTML";
import Ctx from "lib/Ctx";

// TODO: save

const initCode = `
// this code runs once at start
// requires restart after change
// try hold alt and click the img

loadSprite("bean", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAA2CAMAAABAzG8wAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEyUExURQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcPCw4ICA4dFw4eFg4eFxAQEBUsIhUtIhwPDxwQEBw8LR07LR08LSAgICNKOCNLOCRKOCRLOCoXFypZQypaQytZQytaQzAwMDFoTjFoTzFpTzgfHzh3WTh3Wjh4Wjl3WTl3Wjl4Wj+GZUBAQECGZECGZUCHZUYnJ0aVcEeVcE2ke06ke06kfFBQUFQuLlSzhlUuLlWzhlvCkVzCkVzCkmBgYGM2NmPRnWrgqHA+PnBwcHHvs35FRYCAgIxNTY1NTZCQkJtUVJtVVZ+fn6CgoKlcXKldXbdkZL+/v8Vra8VsbNDQ0NNzc9/f3+F7e////ysmAfQAAAAVdFJOUwAQIDBAUGBvcH+AkJ+gr7C/z9Df74JQjt0AAAO5SURBVEjHnVfrQtowFKaADC1qu9I6YSBecIKoOHAD2bhssMpc6zqn010c0/H+r7CcJG2TFAru/LCYnu/kO9ekkUiIxBJyStXSOhJNVeRkPPIIiS8qGMlJWklE50PLQbArKzN5SIuaHiraQjjc3/zZ7lHHtGwHiTXs1XYz7ovUdEc8uLHfsRxRhq1MOIn4U4reMZ0pYpaIyuIk/BMKP7GdELEyUyxIK/PAQU4mWogS+ocz4RALTCLJ749zZ5ghMLteMHQ9VzapG2kuF5h/Dgfe7lbQe6NQ5dJgFbz0rlvOEJnSFTZ9GI/p1w1Ps+ybeGOwtVR3Tnknoh5+mNF5TSJVoRrLzgtwQnINaIQY2kisW2KhzKwcUHIGQyEBSx2k+JpVbNK96P7ZLFk/v9uGh/mKiQIQKAl4/WB8SzTJ8vYDNZAdP8DjnQ1/o34EkQNd/P7WtTAe32EDFsGPvfVror/l+QAEXiICEL/sH19xfA6hcdrwT/Nh7DLAVBBh8CHlRgAiiHfSL8dN14VLEhobZ3D7+j1Zb4JjBiWssgQwJ6RJwqx//4yLxm8fVk4dsqGG8As0AkgOWR0cQQO/sLYEPN7PgV/IwDJNAUhH2MvoTXxB8NSARFLlVnyJVVwf+q1QMgJWiYEEdTSoKUwGu7P7HOZky12lMVhFjyO+b3tHm5ub+61Zk8EkpZhmPXiUtHAdxIDrf+GdIoImcAh2/guPeyEWkdHfWrimdWa2G7VKpVDkRlSbxFCBxgpiLLPdrlUrhVyGnUQ5VgeKS45EVPT46K8OKkUew9eVkAPoZkiCny8r/FgtCQRWUSHDOu9XQDY2jvv9Pb9jfM14wECXxVx8ufr26/f9X5BRnieAGxQPA94AdoFiOPngTl0qZW+eaTwziN+PIP7KnQFU8JRcwuNM5dMIzdgP4EdrfMcNdDpL6DRoCMkZifi8N1qIowZzMibR7wKTHQjOMY+/3+MdIBNugT3UmMbt6aITBH/on+2GHwAQqOWqUCD62xHPnylicvj5eHKsDZkmwwTzX+n2F2v+uQ1vqyKeHqx24A6U79/8vPm0pnP4YS6Ij8Q5lUnHQMl2ryjkwpsQbkeyLpQZvUW5LXjK3zG0WOB6pmK9BjeaM8Jotut0RZYmXG9Vcgq0bWE0o6suWRpU6YzQJl+1JZluV+4GZ7k9qLp00kvStDtywruh54q1rnvDPus2Kjn/a2E6HCpyOXwYzYBjE0vTvxPSSnzOLxV10geGHJfm/1aS4klZUQgXTVtJJWeA/wFPmR833RRQSAAAAABJRU5ErkJggg==")
`.trim();

const drawCode = `
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
	sprite: "bean",
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
`.trim();

const template = `
kaboom()

if (window.parent.initCode) {
	eval(window.parent.initCode)
} else {
	eval(${initCode})
}

let err = null
let lastCode = null

onDraw(() => {
	if (window.parent.drawCode) {
		try {
			eval(window.parent.drawCode)
			lastCode = window.parent.drawCode
			err = null
			debug.clearLog()
		} catch (e) {
			if (lastCode) eval(lastCode)
			if (!err || err.toString() !== e.toString()) {
				debug.error(e)
				err = e
			}
		}
	}
})
`.trim();

interface Sprite {
	name: string,
	src: string,
}

interface SpriteEntryProps {
	name: string,
	src: string,
	onDragStart: () => void,
}

type Shape = {
	img: string,
	code: string,
}

type ShapeEntryProps = Shape & {
	onDragStart: () => void,
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
];

const ShapeEntry: React.FC<ShapeEntryProps> = ({ img, code, onDragStart }) => (
	<Draggable
		focusable
		dir="row"
		align="center"
		gap={1}
		pad={1}
		rounded
		height={64}
		dragType="code"
		dragData={code}
		onDragStart={onDragStart}
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
	</Draggable>
);

const SpriteEntry: React.FC<SpriteEntryProps> = ({
	name,
	src,
	onDragStart,
}) => (
	<Draggable
		focusable
		dir="row"
		align="center"
		gap={1}
		stretchX
		padX={2}
		padY={1}
		rounded
		height={64}
		dragType="sprite"
		dragData={{
			src: src,
			name: name,
		}}
		onDragStart={onDragStart}
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
	</Draggable>
);

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
			":hover": {
				"background": "var(--color-bg2)",
				"cursor": "pointer",
			},
		}}
		onClick={() => new Audio(src).play()}
	>
		<Text>{path.basename(name)}</Text>
	</View>
);

interface Sound {
	name: string,
	src: string,
}

const Play: React.FC = () => {

	const gameviewRef = React.useRef<GameViewRef | null>(null);
	const isNarrow = useMediaQuery("(max-aspect-ratio: 1/1)");;
	const [ backpackOpen, setBackpackOpen ] = React.useState(false);
	const [ sprites, setSprites ] = useSavedState<Sprite[]>("sprites", []);
	const [ sounds, setSounds ] = useSavedState<Sound[]>("sounds", []);
	const { draggin } = React.useContext(Ctx);
	const [ editingInit, setEditingInit ] = React.useState(false);
	const spaceUsed = useSpaceUsed();

	React.useEffect(() => {
		(window as any).drawCode = drawCode;
		(window as any).initCode = initCode;
	}, []);

	useKey("Escape", () => {
		setBackpackOpen(false);
	}, [ setBackpackOpen ]);

	useKey("b", (e) => {
		if (!e.metaKey) return;
		e.preventDefault();
		setBackpackOpen((b) => !b);
	}, [ setBackpackOpen ]);

	return <>
		<Head
			title="Kaboom Playground"
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
						action={() => {
							if (!gameviewRef.current) return;
							gameviewRef.current.run(template);
						}}
					/>
				</View>
				<View dir="row" gap={2} align="center">
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
						name="Editor"
						desc="Where you edit the code"
						content={drawCode}
						onChange={(code) => (window as any).drawCode = code}
						width="calc(100% - 32px)"
						height="calc(100% - 32px)"
						onMouseDown={() => setEditingInit(false)}
						css={{
							position: "absolute",
							bottom: 0,
							right: 0,
							filter: `brightness(${!editingInit ? 1 : 0.6})`,
							zIndex: !editingInit ? 20 : 0,
						}}
						placeholder="Come on let's make some games!"
						keys={[
							{
								key: "Mod-s",
								run: () => {
									if (!gameviewRef.current) return false;
									const gameview = gameviewRef.current;
									gameview.run(template);
									return false;
								},
								preventDefault: true,
							},
						]}
					/>
					<Editor
						name="Editor"
						desc="Where you edit the code"
						content={initCode}
						onChange={(code) => (window as any).initCode = code}
						width="calc(100% - 32px)"
						height="calc(100% - 32px)"
						onMouseDown={() => setEditingInit(true)}
						css={{
							position: "absolute",
							top: 0,
							left: 0,
							filter: `brightness(${editingInit ? 1 : 0.6})`,
							zIndex: editingInit ? 20 : 0,
						}}
						placeholder="Come on let's make some games!"
						keys={[
							{
								key: "Mod-s",
								run: () => {
									if (!gameviewRef.current) return false;
									const gameview = gameviewRef.current;
									gameview.run(template);
									return false;
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
					width={isNarrow ? "100%" : "auto"}
					height={isNarrow ? "auto" : "100%"}
					css={{
						order: isNarrow ? 1 : 2,
						flex: "1",
					}}
				/>
			</View>
			{
				draggin &&
				<Droppable
					stretch
					css={{
						position: "absolute",
						zIndex: 10,
					}}
					accept={["sprite", "sound"]}
					onDrop={(ty, data) => {
						switch (ty) {
							case "sprite":
								setSprites((prev) => prev.filter(({ name }) => name !== data));
							case "sound":
								setSounds((prev) => prev.filter(({ name }) => name !== data));
						}
					}}
				/>
			}
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
					<FileDrop
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
										return prev;
									}
								}
								return [
									...prev,
									{
										name: file.name,
										src: content,
									},
								];
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
					</FileDrop>
					<FileDrop
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
										return prev;
									}
								}
								return [
									...prev,
									{
										name: file.name,
										src: content,
									},
								];
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
					</FileDrop>
					<View stretchX padX={1}>
						<Text color={4} size="small">Space used: {(spaceUsed / 1024 / 1024).toFixed(2)}mb</Text>
					</View>
				</Drawer>
			}
		</Background>
	</>;

};

export default Play;
