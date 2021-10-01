import * as React from "react";
import Link from "next/link";
import useKey from "hooks/useKey";
import useFetch from "hooks/useFetch";
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
import Background from "comps/Background";
import KaboomEntry from "comps/KaboomEntry";

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
	<View
		name={name}
		desc={src}
		focusable
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
				css={{
					width: "100%",
					overflow: "hidden",
					objectFit: "cover",
				}}
			/>
		</View>
		<Text noSelect css={{overflowWrap: "break-word"}}>{name}</Text>
	</View>
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
		name={name}
		desc={src}
		focusable
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
		onClick={() => new Audio(src).play()}
	>
		<View width={48} height={48} justify="center"></View>
		<Text noSelect>{name}</Text>
	</View>
);

const Demo: React.FC = () => {

	const [ curDemo, setCurDemo ] = React.useState("runner");
	const { data: fetchedCode } = useFetch(`/public/demo/${curDemo}.js`, (res) => res.text());
	const [ backpackOpen, setBackpackOpen ] = React.useState(false);
	const [ code, setCode ] = React.useState("");
	const [ blackboard, setBlackboard ] = React.useState<string | null>(null);
	const editorRef = React.useRef<EditorRef | null>(null);
	const gameviewRef = React.useRef<GameViewRef | null>(null);
	const backpackRef = React.useRef(null);
	const blackboardRef = React.useRef(null);

	React.useEffect(() => {
		if (fetchedCode) {
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
						selected="sprite"
						onChange={(selected) => setCurDemo(selected)}
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
				desc="A place where you put all your stuff"
				ref={backpackRef}
				dir="row"
				bg={1}
				rounded
				outlined
				width={240}
				height="80%"
				css={{
					position: "absolute",
					top: "14%",
					left: backpackOpen ? -4 : -(240 - 24),
					transition: "0.2s left",
					overflow: "hidden",
					zIndex: 50,
				}}
			>
				<View
					pad={2}
					gap={2}
					stretchY
					css={{
						flex: "1",
						overflow: "scroll",
					}}
				>
					<Text size="big" color={2} noSelect>Backpack</Text>
					<View gap={1} stretchX>
						<Text color={3} noSelect>Sprites</Text>
						{[
							"bean",
							"googoly",
							"cut",
							"meat",
						].map((name) => (
							<SpriteEntry
								key={name}
								name={name}
								src={`/public/assets/sprites/${name}.png`}
							/>
						))}
					</View>
					<View gap={1} stretchX>
						<Text color={3} noSelect>Sounds</Text>
						{[
							"bug",
							"computer",
							"dune",
							"mystic",
						].map((name) => (
							<SoundEntry
								key={name}
								name={name}
								src={`/public/assets/sounds/${name}.mp3`}
							/>
						))}
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
