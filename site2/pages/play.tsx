import * as React from "react";
import Link from "next/link";
import useDoc from "hooks/useDoc";
import Editor, { EditorRef } from "comps/Editor";
import GameView, { GameViewRef } from "comps/GameView";
import Page from "comps/Page";
import Button from "comps/Button";
import ThemeSwitch from "comps/ThemeSwitch";
import Select from "comps/Select";
import View from "comps/View";
import Text from "comps/Text";
import Menu from "comps/Menu";

const testCode: Record<string, string> = {
	"sprite": `
kaboom();

// load default sprite "bean"
loadBean();

// add to screen
add([
	sprite("bean"),
	pos(80, 40),
]);
	`.trim(),
	"runner": `
const FLOOR_HEIGHT = 48;
const JUMP_FORCE = 800;
const SPEED = 480;

// initialize context
kaboom();

// load assets
loadSprite("bean", "public/assets/sprites/bean.png");

scene("game", () => {

	// define gravity
	gravity(2400);

	// add a game object to screen
	const player = add([
		// list of components
		sprite("bean"),
		pos(80, 40),
		area(),
		body(),
	]);

	// floor
	add([
		rect(width(), FLOOR_HEIGHT),
		outline(4),
		pos(0, height()),
		origin("botleft"),
		area(),
		solid(),
		color(127, 200, 255),
	]);

	function jump() {
		if (player.grounded()) {
			player.jump(JUMP_FORCE);
		}
	}

	// jump when user press space
	keyPress("space", jump);
	mouseClick(jump);

	function spawnTree() {

		// add tree obj
		add([
			rect(48, rand(32, 96)),
			area(),
			outline(4),
			pos(width(), height() - FLOOR_HEIGHT),
			origin("botleft"),
			color(255, 180, 255),
			move(LEFT, SPEED),
			cleanup(),
			"tree",
		]);

		// wait a random amount of time to spawn next tree
		wait(rand(0.5, 1.5), spawnTree);

	}

	// start spawning trees
	spawnTree();

	// lose if player collides with any game obj with tag "tree"
	player.collides("tree", () => {
		// go to "lose" scene and pass the score
		go("lose", score);
		burp();
		addKaboom(player.pos);
	});

	// keep track of score
	let score = 0;

	const scoreLabel = add([
		text(score),
		pos(24, 24),
	]);

	// increment score every frame
	action(() => {
		score++;
		scoreLabel.text = score;
	});

});

scene("lose", (score) => {

	add([
		sprite("bean"),
		pos(width() / 2, height() / 2 - 80),
		scale(2),
		origin("center"),
	]);

	// display score
	add([
		text(score),
		pos(width() / 2, height() / 2 + 80),
		scale(2),
		origin("center"),
	]);

	// go back to game with space is pressed
	keyPress("space", () => go("game"));
	mouseClick(() => go("game"));

});

go("game");
	`.trim(),
};

const Demo: React.FC = () => {

	const [ code, setCode ] = React.useState(testCode["sprite"]);
	const [ explaining, setExplaining ] = React.useState<string | null>(null);
	const editorRef = React.useRef<EditorRef | null>(null);
	const gameviewRef = React.useRef<GameViewRef | null>(null);
	const doc = useDoc();

	return (
		<Page>
			<View dir="column" stretch>
				<View
					dir="row"
					align="center"
					justify="between"
					stretchX
					height={64}
					padX={2}
				>
					<View dir="row" gap={2} align="center">
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
						<Select
							options={Object.keys(testCode)}
							selected="sprite"
							onChange={(selected) => setCode(testCode[selected])}
						/>
						<Button
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
						<Button
							text="Explain"
							action={() => {
								if (!editorRef.current) return;
								const sel = editorRef.current.getSelection();
								if (sel) {
									setExplaining(sel);
								}
							}}
						/>
					</View>
					<View dir="row" gap={2} align="center">
						<ThemeSwitch />
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
					}}
				>
					<View
						dir="column"
						gap={2}
						css={{
							width: "40%",
							height: "100%",
						}}
					>
						<Editor
							ref={editorRef}
							content={code}
							stretchX
							placeholder="Come on let's make some games!"
							css={{
								flex: "1",
							}}
							onSelect={(sel) => {
								console.log(sel);
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
						ref={gameviewRef}
						code={code}
						stretchY
						css={{
							flex: "1",
						}}
					/>
				</View>
			</View>
		</Page>
	);

};

export default Demo;
