import * as React from "react";
import Image from "next/image";
import { keyframes } from '@emotion/react';

import Nav from "comps/Nav";
import View from "comps/View";
import Text from "comps/Text";
import Markdown from "comps/Markdown";

const Home: React.FC = () => (
	<Nav>
		<Text size="huge" color={1}>Kaboom is a Javascript game programming library that helps you make games fast and fun.</Text>
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
	</Nav>
);

export default Home;
