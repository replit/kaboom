import * as React from "react";
import Link from "next/link";
import Editor, { EditorRef } from "comps/editor";
import GameView, { GameViewRef } from "comps/gameview";
import useFetch from "hooks/useFetch";
import Page from "comps/page";
import Button from "comps/button";
import ThemeToggle from "comps/themetoggle";
import Select from "comps/select";
import View from "comps/view";

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
loadSprite("bean", "assets/sprites/bean.png");

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
	const editorRef = React.useRef<EditorRef | null>(null);
	const gameviewRef = React.useRef<GameViewRef | null>(null);

	return (
		<Page>
			<View dir="column" stretch>
				<View
					dir="row"
					align="center"
					justify="between"
					bg={1}
					stretchX
					height={64}
					padX={2}
				>
					<View dir="row" gap={2} align="center">
						<Link href="/">
							<img
								src="/img/k.png"
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
							onClick={() => {
								if (!editorRef.current) return;
								if (!gameviewRef.current) return;
								const content = editorRef.current.getContent();
								if (content) {
									setCode(content);
									gameviewRef.current.run();
								}
							}}
						/>
					</View>
					<View dir="row" gap={2} align="center">
						<Button text="Download" onClick={() => {}} />
						<ThemeToggle />
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
						paddingTop: 0,
					}}
				>
					<Editor
						ref={editorRef}
						gameview={gameviewRef}
						content={code}
						onRun={(code) => {
							if (!gameviewRef.current) return;
							gameviewRef.current.run(code);
						}}
						css={{
							width: "40%",
							height: "100%",
						}}
					/>
					<GameView
						ref={gameviewRef}
						code={code}
						css={{
							flex: "1",
							height: "100%",
						}}
					/>
				</View>
			</View>
		</Page>
	);

};

export default Demo;
