import * as React from "react";
import Link from "next/link";
import Editor from "./editor";
import { useFetch } from "./utils";

import {
	Page,
	Text,
	Spacer,
	Button,
	Select,
	ThemeToggle,
	VStack,
	HStack,
	ThemeCtx,
} from "./ui";

const testCode = `
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
`.trim();

const Header: React.FC = () => (
	<HStack
		align="center"
		justify="between"
		css={{
			padding: "0 16px",
			background: "var(--color-bg2)",
			width: "100%",
			height: "64px",
			overflow: "hidden",
		}}
	>
		<HStack space={2} align="center">
			<Link href="/">
				<img
					src="/img/kaboom.svg"
					css={{
						width: 160,
						cursor: "pointer",
					}}
					alt="logo"
				/>
			</Link>
			<Select options={["sprite", "runner"]} selected="runner" />
			<Button text="Run" />
		</HStack>
		<HStack>
			<ThemeToggle />
		</HStack>
	</HStack>
);

interface GameViewProps {
	code?: string,
}

const GameView: React.FC<GameViewProps> = ({
	code,
}) => (
	<iframe
		css={{
			flex: "1",
			height: "100%",
			border: "none",
			background: "black",
		}}
		srcDoc={`
<!DOCTYPE html>
<head>
	<style>
		* {
			margin: 0;
			padding: 0;
		}
		body,
		html {
			width: 100%;
			height: 100%;
		}
	</style>
</head>
<body>
	<script src="/dist/kaboom.js"></script>
	<script>
${code}
	</script>
</body>
		`}
	/>
);

const Content: React.FC = () => {
	const [ code, setCode ] = React.useState(testCode);
	return (
		<HStack
			css={{
				width: "100%",
				flex: "1",
				overflow: "hidden",
			}}
		>
			<Editor content={code} onChange={setCode} />
			<GameView code={code} />
		</HStack>
	);
};

const Demo: React.FC = () => {
	return (
		<Page>
			<VStack stretch>
				<Header />
				<Content />
			</VStack>
		</Page>
	);
};

export default Demo;
