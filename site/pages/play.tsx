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
import Drop from "comps/Drop";
import Drawer from "comps/Drawer";
import Background from "comps/Background";
import Doc from "comps/Doc";
import download from "lib/download";
import wrapHTML from "lib/wrapHTML";
import Ctx from "lib/Ctx";
import DEMO_CFG from "public/site/demo/demo.json";

const DEF_DEMO = "add";

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
		<Text>{path.basename(name)}</Text>
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

interface PlayProps {
	demos: Record<string, string>,
}

const Play: React.FC<PlayProps> = ({
	demos,
}) => {

	const router = useRouter();
	const demo = router.query.demo as string || DEF_DEMO;
	const code = demos[demo];
	const [ backpackOpen, setBackpackOpen ] = React.useState(false);
	const [ sprites, setSprites ] = useSavedState<Sprite[]>("sprites", []);
	const [ sounds, setSounds ] = useSavedState<Sound[]>("sounds", []);
	const [ blackboard, setBlackboard ] = React.useState<string | null>(null);
	const editorRef = React.useRef<EditorRef | null>(null);
	const gameviewRef = React.useRef<GameViewRef | null>(null);
	const blackboardRef = React.useRef(null);
	const isNarrow = useMediaQuery("(max-aspect-ratio: 1/1)");;
	const spaceUsed = useSpaceUsed();
	const [ make, setMake ] = React.useState(false);

	// DEMO_ORDER defines the demos that should appear at the top of the list
	// names not defined in the list just fall to their default order
	const demoList = React.useMemo(() => {
		return [...new Set([
			...DEMO_CFG.order,
			...Object.keys(demos),
		])].filter((name) => !DEMO_CFG.hidden.includes(name));
	}, [ demos ]);

	React.useEffect(() => {
		if (router.isReady && !router.query.demo) {
			router.replace({
				query: {
					demo: DEF_DEMO,
				},
			}, undefined, { shallow: true, });
		}
	}, [ router ]);

	useKey("Escape", () => {
		setBackpackOpen(false);
		setBlackboard(null);
	}, [ setBackpackOpen, setBlackboard ]);

	useKey("b", (e) => {
		if (!e.metaKey) return;
		e.preventDefault();
		setBackpackOpen((b) => !b);
	}, [ setBackpackOpen ]);

	useClickOutside(blackboardRef, () => setBlackboard(null), [ setBlackboard ]);

	return <>
		<Head
			title="Kaboom Playground"
			scale={0.6}
			twitterPlayer={{
				url: `https://kaboomjs.com/demo/${demo}`,
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
					{ !make &&
						<Select
							name="Demo Selector"
							desc="Select a demo to run"
							options={demoList}
							value={demo}
							onChange={(demo) => router.push({
								query: {
									demo: demo,
								},
							}, undefined, { shallow: true, })}
						/>
					}
					<Button
						name="Run Button"
						desc="Run current code (Cmd+s)"
						text="Run"
						action={() => {
							if (!editorRef.current) return;
							if (!gameviewRef.current) return;
							const content = editorRef.current.getContent();
							if (content) {
								gameviewRef.current.run(content);
							}
						}}
					/>
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
									const name = prompt("File name: ");
									download(`${name}.html`, wrapHTML(code));
								},
							}
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
								if (!gameviewRef.current) return false;
								const gameview = gameviewRef.current;
								if (!editorRef.current) return false;
								const editor = editorRef.current;
								gameview.run(editor.getContent() ?? "");
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
					</Drop>
					<View stretchX padX={1}>
						<Text color={4} size="small">Space used: {(spaceUsed / 1024 / 1024).toFixed(2)}mb</Text>
					</View>
				</Drawer>
			}
		</Background>
	</>;

};

// TODO: getServerSideProps is handy for dev when you're changing demos, but getStaticProps makes more sense for prod since it won't change
export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const { demo } = ctx.query;
	const demodir = (await fs.readdir("public/site/demo"))
		.filter((p) => !p.startsWith("."))
	const demos: Record<string, string> = {}
	for (const file of demodir) {
		const ext = path.extname(file)
		const name = path.basename(file, ext)
		if (ext === ".js") {
			demos[name] = await fs.readFile(`public/site/demo/${file}`, "utf8");
		}
	}
	if (!demo || demos[demo as string]) {
		return {
			props: {
				demos,
			},
		};
	} else {
		return {
			notFound: true,
		};
	}
}

export default Play;
