import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { keyframes } from '@emotion/react';

import Background from "comps/Background";
import View from "comps/View";
import Text from "comps/Text";
import Markdown from "comps/Markdown";
import ThemeSwitch from "comps/ThemeSwitch";

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
	<Link href="/">
		<View
			stretchX
			height={120}
			css={{
				"cursor": "pointer",
			}}
		>
			<img
				src="/public/img/boom.svg"
				alt="boom"
				css={{
					width: "80%",
					left: "10%",
					position: "absolute",
					animation: `${anims.kaboom} 5s infinite`,
				}}
			/>
			<img
				src="/public/img/ka.svg"
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
	</Link>
);

interface NavLinkProps {
	text: string,
	link: string,
}

const NavLink: React.FC<NavLinkProps> = ({
	text,
	link,
}) => (
	<Link href={link}>
		<View
			focusable
			padX={1}
			padY={0.5}
			rounded
			css={{
				cursor: "pointer",
				position: "relative",
				left: "-4px",
				":hover": {
					background: "var(--color-highlight)",
					"> *": {
						color: "white !important",
					}
				},
			}}
		>
			<Text color={2}>{text}</Text>
		</View>
	</Link>
);

const Nav: React.FC = ({children}) => (
	<Background pad={3}>
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
				<ThemeSwitch />
				<View gap={0.5}>
					<NavLink link="/play" text="PlayGround" />
					<NavLink link="/doc/setup" text="Setup Guide" />
					<NavLink link="/doc/intro" text="Tutorial" />
					<NavLink link="https://github.com/replit/kaboom" text="Github" />
				</View>
			</View>
			<View
				dir="column"
				gap={3}
				pad={4}
				stretchY
				css={{
					overflow: "scroll",
					flex: "1",
				}}
			>
				{children}
			</View>
		</View>
	</Background>
);

export default Nav;
