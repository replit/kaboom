import * as React from "react";
import NextLink from "next/link";
import Image from "next/image";
import { keyframes } from '@emotion/react';

import Page from "comps/page";
import View from "comps/view";
import Text from "comps/text";
import Spacer from "comps/spacer";
import Code from "comps/code";
import ThemeToggle from "comps/themetoggle";

const anims = {
	kaboom: keyframes(`
		0% {
			transform: scale(1);
		}
		5% {
			transform: scale(1.1);
		}
		10% {
			transform: scale(1);
		}
	`),
	scroll: keyframes(`
		0% {
			background-position: 0 0;
		}
		100% {
			background-position: 48px 48px;
		}
	`),
	fun: keyframes(`
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
	`),
};

const Logo: React.FC = () => (
	<View stretchX height={120}>
		<img
			src="/img/boom.svg"
			alt="boom"
			css={{
				width: "80%",
				left: "10%",
				position: "absolute",
				animation: `${anims.kaboom} 5s infinite`,
			}}
		/>
		<img
			src="/img/ka.svg"
			alt="ka"
			css={{
				width: "90%",
				position: "absolute",
				left: "2px",
				top: "28px",
				animation: `${anims.kaboom} 5s infinite`,
				animationDelay: "0.08s",
			}}
		/>
	</View>
);

interface LinkProps {
	text: string,
	link: string,
}

const Link: React.FC<LinkProps> = ({
	text,
	link,
}) => (
	<NextLink href={link}>
		<Text
			color={2}
			css={{
				cursor: "pointer",
				padding: "4px 8px",
				borderRadius: 8,
				position: "relative",
				left: "-4px",
				":hover": {
					background: "var(--color-highlight)",
					color: "white",
				},
			}}
		>{text}</Text>
	</NextLink>
);

const Home: React.FC = () => (
	<Page>
		<View
			stretch
			pad={2}
			css={{
				background: "url(/img/bg.svg) repeat #3D3ACF",
				animation: `${anims.scroll} 5s infinite linear`,
			}}
		>
			<View stretch dir="row" bg={1} rounded outlined css={{ overflow: "hidden" }}>
				<View
					dir="column"
					gap={2}
					stretchY
					width={240}
					pad={3}
					bg={2}
					css={{
						overflow: "scroll",
					}}
				>
					<View />
					<Logo />
					<ThemeToggle />
					<View gap={0.5}>
						<Link link="/play" text="PlayGround" />
						<Link link="/play" text="Setup Guide" />
						<Link link="/play" text="Tutorial" />
						<Link link="https://github.com/replit/kaboom" text="Github" />
					</View>
				</View>
				<View
					dir="column"
					gap={3}
					pad={4}
					stretchY
					css={{
						flex: "1",
					}}
				>
					<Text size="huge" color={1}>Kaboom is a Javascript game programming library that helps you make games fast and fun.</Text>
					<Code
						lang="javascript"
						code={`
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

keyPress("space", () => {
	player.jump();
});
						`}
					/>
					<Text><span>Kaboom</span> uses a flexible component system that makes it easy to compose game logics</Text>
				</View>
			</View>
		</View>
	</Page>
);

export default Home;
