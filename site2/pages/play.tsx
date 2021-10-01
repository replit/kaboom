import * as React from "react";
import Link from "next/link";
import useDoc from "hooks/useDoc";
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
	const [ expanded, setExpanded ] = React.useState(false);
	const [ code, setCode ] = React.useState("");
	const [ explaining, setExplaining ] = React.useState<string | null>(null);
	const editorRef = React.useRef<EditorRef | null>(null);
	const gameviewRef = React.useRef<GameViewRef | null>(null);
	const drawerRef = React.useRef(null);
	const doc = useDoc();

	React.useEffect(() => {
		if (fetchedCode) {
			setCode(fetchedCode);
		}
	}, [ fetchedCode ]);

	useKey("Escape", () => setExpanded(false), [ setExpanded ]);
	useClickOutside(drawerRef, () => setExpanded(false), [ setExpanded ]);

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
						desc="Run current code"
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
					<Menu left items={[
						{
							name: "Open in Replit",
							action: () => {},
						},
					]} />
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
				<View
					name="Drawer"
					desc="Contains various helper tools like asset manager"
					ref={drawerRef}
					dir="row"
					bg={1}
					rounded
					outlined
					width={240}
					height="80%"
					css={{
						position: "absolute",
						top: "8%",
						left: expanded ? -4 : -(240 - 24),
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
						<View gap={1} stretchX>
							<Text size="big" color={2} noSelect>Sprites</Text>
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
							<Text size="big" color={2} noSelect>Sounds</Text>
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
						name="Drawer Handle"
						desc="Click to show / hide the drawer"
						dir="row"
						align="center"
						justify="around"
						padX={0.5}
						width={24}
						stretchY
						onClick={() => setExpanded(!expanded)}
						css={{
							cursor: "pointer",
						}}
					>
						<View height="95%" width={2} bg={2} />
						<View height="95%" width={2} bg={2} />
					</View>
				</View>
				<View
					dir="column"
					gap={2}
					width="45%"
					stretchY
				>
					<Editor
						name="Editor"
						desc="Where you edit the code"
						ref={editorRef}
						content={code}
						stretchX
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
									setExplaining(sel);
									return false;
								},
								preventDefault: true,
							},
						]}
					/>
					{explaining && <View
						height={240}
						stretchX
						rounded
						outlined
						pad={2}
						bg={2}
					>
						<Text size="big">{explaining}</Text>
						<View
							width={32}
							height={32}
							padX={1.2}
							padY={0.5}
							onClick={() => setExplaining(null)}
							css={{
								position: "absolute",
								cursor: "pointer",
								top: 0,
								right: 0,
							}}
						>
							<Text color={3}>x</Text>
						</View>
					</View>}
				</View>
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
		</Background>
	</Page>;

};

export default Demo;
