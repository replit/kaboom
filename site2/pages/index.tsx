import * as React from "react";
import Image from "next/image";
import { keyframes } from '@emotion/react';
import Head from "comps/Head";
import Nav from "comps/Nav";
import View from "comps/View";
import Text from "comps/Text";
import Markdown from "comps/Markdown";
import Drawer from "comps/Drawer";
import { Entry } from "comps/Doc";
import * as doc from "lib/doc";
// @ts-ignore
import fun from "lib/fun";

const flashy = keyframes(`
	0% {
		color: blue;
	}
	20% {
		color: orange;
	}
	40% {
		color: yellow;
	}
	60% {
		color: green;
	}
	80% {
		color: cyan;
	}
	100% {
		color: blue;
	}
`);

const Fun: React.FC = () => (
	<span
		onClick={() => {
			window.open(fun[Math.floor(Math.random() * fun.length)])
		}}
		css={{
			":hover": {
				"cursor": "pointer",
				"animation": `${flashy} 1s infinite linear`,
			},
		}}
	>
		fun
	</span>
);

const Home: React.FC = () => {
	const [ showType, setShowType ] = React.useState<string | null>(null);
	return <Nav>
		<Head title="Kaboom" scale={0.8} />
		<Text select size="huge" color={1}>Kaboom is a Javascript game programming library that helps you make games fast and <Fun />.</Text>
		<Markdown stretchX src={`
\`\`\`js
// start the game
kaboom();

// load a default sprite
loadBean();

// add character to screen, from a list of components
const player = add([
	sprite("bean"),  // renders as a sprite
	pos(120, 80),    // position in world
	area(),          // has a collider
	body(),          // responds to physics and gravity
]);

// jump when player presses "space" key
keyPress("space", () => {
	// .jump() is provided by the body() component
	player.jump();
});
\`\`\`

Kaboom uses a flexible component system that makes it easy to compose game logics.
		`} />

		{ doc.sections.map((sec) => {
			const entries = sec.entries;
			return (
				<View stretchX gap={2} key={sec.name}>
					<Text size="huge" color={3}>{sec.name}</Text>
					<View stretchX gap={3}>
						{ entries.map((name) => (
							<Entry
								id={name}
								key={name}
								name={name}
								typeref={setShowType}
							/>
						)) }
					</View>
				</View>
			);
		}) }

	</Nav>;
};

export default Home;
