import * as React from "react";
import Link from "next/link";
import useKey from "hooks/useKey";
import useFetch from "hooks/useFetch";
import useStoredState from "hooks/useStoredState";
import useClickOutside from "hooks/useClickOutside";
import Editor, { EditorRef } from "comps/Editor";
import GameView, { GameViewRef } from "comps/GameView";
import Page from "comps/Page";
import Button from "comps/Button";
import ThemeSwitch from "comps/ThemeSwitch";
import Select from "comps/Select";
import View from "comps/View";
import Text from "comps/Text";
import Menu from "comps/Menu";
import Inspect from "comps/Inspect";
import FileDrop from "comps/FileDrop";
import Draggable from "comps/Draggable";
import Droppable from "comps/Droppable";
import Background from "comps/Background";
import KaboomEntry from "comps/KaboomEntry";
import { basename } from "lib/path";
import getSpaceUsed from "lib/spaceUsed";

const demos = [
	"audio",
	"bench",
	"burp",
	"button",
	"doublejump",
	"drag",
	"eatbomb",
	"egg",
	"flappy",
	"fullscreen",
	"hi",
	"kaboom",
	"layer",
	"multiboom",
	"out",
	"particle",
	"platformer",
	"pointclick",
	"rawdraw",
	"rpg",
	"runner",
	"scenes",
	"shader",
	"shooter",
	"size",
	"sprite",
	"spriteatlas",
	"text",
	"tiled",
	"tileset",
	"transform",
]

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
		dragID={name}
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
					width: "100%",
					overflow: "hidden",
					objectFit: "cover",
				}}
			/>
		</View>
		<Text>{basename(name)}</Text>
	</Draggable>
);

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
		<Text>{basename(name)}</Text>
	</View>
);

interface Sprite {
	name: string,
	src: string,
}

interface Sound {
	name: string,
	src: string,
}

const Demo: React.FC = () => {

	const [ curDemo, setCurDemo ] = React.useState("platformer");
	const { data: fetchedCode } = useFetch(`/public/demo/${curDemo}.js`, (res) => res.text());
	const [ backpackOpen, setBackpackOpen ] = React.useState(false);
	const [ code, setCode ] = React.useState("");
	const [ sprites, setSprites ] = useStoredState<Sprite[]>("sprites", []);
	const [ sounds, setSounds ] = useStoredState<Sound[]>("sounds", []);
	const [ blackboard, setBlackboard ] = React.useState<string | null>(null);
	const editorRef = React.useRef<EditorRef | null>(null);
	const gameviewRef = React.useRef<GameViewRef | null>(null);
	const backpackRef = React.useRef(null);
	const blackboardRef = React.useRef(null);
	const spaceUsed = React.useMemo(getSpaceUsed, [ sprites, sounds ]);

	React.useEffect(() => {
		if (fetchedCode != null) {
			setCode(fetchedCode);
		}
	}, [ fetchedCode ]);

	useKey("Escape", () => {
		setBackpackOpen(false);
		setBlackboard(null);
	}, [ setBackpackOpen, setBlackboard ]);

	useKey("b", (e) => {
		if (!e.metaKey) return;
		e.preventDefault();
		setBackpackOpen((b) => !b);
	}, [ setBackpackOpen ]);

	useClickOutside(backpackRef, () => setBackpackOpen(false), [ setBackpackOpen ]);
	useClickOutside(blackboardRef, () => setBlackboard(null), [ setBlackboard ]);

	return <Page>
		<Background dir="column">
			<View
				dir="row"
				align="center"
				justify="between"
				stretchX
				height={64}
				padX={2}
			>
				<View dir="row" gap={2} align="center">
					<View
						rounded
						desc="Back to home"
					>
						<Link href="/" passHref>
							<img
								src="/public/img/k.png"
								css={{
									width: 48,
									cursor: "pointer",
								}}
								alt="logo"
							/>
						</Link>
					</View>
					<Select
						name="Demo Selector"
						desc="Select a demo to run"
						options={demos}
						value={curDemo}
						onChange={setCurDemo}
					/>
					<Button
						name="Run Button"
						desc="Run current code (Cmd+s)"
						text="Run"
						action={() => {
							if (!editorRef.current) return;
							if (!gameviewRef.current) return;
							const content = editorRef.current.getContent();
							if (content) {
								setCode(content);
								gameviewRef.current.run();
							}
						}}
					/>
					<Inspect />
				</View>
				<View dir="row" gap={2} align="center">
					<ThemeSwitch
						name="Theme Switcher"
						desc="Choose a theme!"
					/>
					<Menu items={[]} />
				</View>
			</View>
			<View
				dir="row"
				gap={2}
				stretchX
				padX={2}
				padY={2}
				css={{
					flex: "1",
					overflow: "hidden",
					paddingTop: 2,
					paddingLeft: 42,
//  					"@media (max-aspect-ratio: 1/1)": {
//  						flexDirection: "column",
//  					},
				}}
			>
				<Editor
					name="Editor"
					desc="Where you edit the code"
					ref={editorRef}
					content={code}
					stretchY
					width="45%"
					placeholder="Come on let's make some games!"
					css={{
						flex: "1",
					}}
					keys={[
						{
							key: "Mod-s",
							run: () => {
								if (!gameviewRef.current) return false;
								const gameview = gameviewRef.current;
								if (!editorRef.current) return false;
								const editor = editorRef.current;
								gameview.run(editor.getContent() ?? undefined);
								return false;
							},
							preventDefault: true,
						},
						{
							key: "Mod-e",
							run: () => {
								if (!editorRef.current) return false;
								const editor = editorRef.current;
								const sel = editor.getSelection() || editor.getWord();
								setBlackboard(sel);
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
					code={code}
					stretchY
					css={{
						flex: "1",
					}}
				/>
			</View>
			<View
				stretch
				css={{
					background: "black",
					opacity: (backpackOpen || blackboard) ? 0.2 : 0,
					transition: "0.2s opacity",
					pointerEvents: "none",
					position: "absolute",
				}}
			/>
			<View
				name="Backpack"
				desc="A place to put your stuff like sprite and sound assets. Drag the files into their own sections."
				ref={backpackRef}
				dir="row"
				bg={1}
				rounded
				outlined
				width={260}
				height="calc(90% - 64px)"
				css={{
					position: "absolute",
					top: "calc(64px + 4%)",
					left: backpackOpen ? -4 : -(260 - 24),
					transition: "0.2s left",
					overflow: "hidden",
					zIndex: 50,
				}}
			>
				<View
					padY={2}
					gap={1}
					stretchY
					css={{
						paddingLeft: 16,
						paddingRight: 4,
						flex: "1",
						overflow: "scroll",
					}}
				>
					<View padX={1} gap={2} stretchX>
						<Text size="big" color={2}>Backpack</Text>
						<Droppable
							name="Trash Can"
							desc="Drop unwanted assets here to trash them"
							pad={1}
							stretchX
							bg={2}
							rounded
							accept={["sprite", "sound"]}
							onDrop={(ty, id) => {
								switch (ty) {
									case "sprite":
										setSprites((prev) => prev.filter(({ name }) => name !== id));
									case "sound":
										setSounds((prev) => prev.filter(({ name }) => name !== id));
								}
							}}
						>
							<Text color={2}>Trash can</Text>
						</Droppable>
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
									/>
								))
						}
					</FileDrop>
					<View stretchX padX={1}>
						<Text color={4} size="small">Space used: {(spaceUsed / 1024 / 1024).toFixed(2)}mb</Text>
					</View>
				</View>
				<View
					name="Backpack Handle"
					desc="Click to pull out / put away your backpack (Cmd+b)."
					dir="row"
					align="center"
					justify="around"
					padX={0.5}
					width={24}
					stretchY
					onClick={() => setBackpackOpen(!backpackOpen)}
					css={{
						cursor: "pointer",
					}}
				>
					<View height="95%" width={2} bg={2} />
					<View height="95%" width={2} bg={2} />
				</View>
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
					overflowY: "scroll",
					overflowX: "hidden",
				}}
			>
				{
					blackboard &&
					<KaboomEntry name={blackboard} />
				}
			</View>
		</Background>
	</Page>;

};

export default Demo;
