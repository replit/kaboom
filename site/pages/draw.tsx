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

// TODO: drag n' drop shapes / sprites from backpack
// TODO: drag n' drop code snippets from editor to backpack
// TODO: manual

const template = `
kaboom()

loadBean()

let err = null

onDraw(() => {
	if (window.parent.code) {
		try {
			eval(window.parent.code)
			err = null
			debug.clearLog()
		} catch (e) {
			if (!err || err.toString() !== e.toString()) {
				debug.error(e)
				err = e
			}
		}
	}
})
`.trim();

const code = `
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
		p3: vec2(240, 60 - 200),
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

interface Sprite {
	name: string,
	src: string,
}

interface SpriteEntryProps {
	name: string,
	src: string,
}

const SpriteEntry: React.FC<SpriteEntryProps> = ({
	name,
	src,
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
		dragData={name}
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

const Play: React.FC = () => {

	const editorRef = React.useRef<EditorRef | null>(null);
	const gameviewRef = React.useRef<GameViewRef | null>(null);
	const isNarrow = useMediaQuery("(max-aspect-ratio: 1/1)");;
	const [ backpackOpen, setBackpackOpen ] = React.useState(false);
	const [ sprites, setSprites ] = useSavedState<Sprite[]>("sprites", []);
	const { draggin } = React.useContext(Ctx);

	React.useEffect(() => {
		(window as any).code = code;
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
				<Editor
					name="Editor"
					desc="Where you edit the code"
					ref={editorRef}
					content={code}
					onChange={(code) => {
						(window as any).code = code;
					}}
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
								if (!gameviewRef.current) return false;
								const gameview = gameviewRef.current;
								gameview.run(template);
								return false;
							},
							preventDefault: true,
						},
					]}
				/>
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
						zIndex: 20,
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
									/>
								))
						}
					</FileDrop>
				</Drawer>
			}
		</Background>
	</>;

};

export default Play;
