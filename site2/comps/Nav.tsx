import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { keyframes } from '@emotion/react';

import Background from "comps/Background";
import View from "comps/View";
import Text from "comps/Text";
import Markdown from "comps/Markdown";
import Input from "comps/Input";
import ThemeSwitch from "comps/ThemeSwitch";
import * as doc from "lib/doc";

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
			desc="Back to home"
			rounded
			css={{
				"cursor": "pointer",
			}}
		>
			<img
				src="/site/img/boom.svg"
				alt="boom"
				css={{
					position: "relative",
					width: "80%",
					left: "10%",
					animation: `${anims.kaboom} 5s infinite`,
				}}
			/>
			<img
				src="/site/img/ka.svg"
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
	<Link href={link} passHref>
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
						color: "var(--color-fghl) !important",
					},
				},
			}}
		>
			<Text color={2}>{text}</Text>
		</View>
	</Link>
);

const Index: React.FC = () => {
	const [ query, setQuery ] = React.useState("");
	return <>
		<Input value={query} onChange={setQuery} placeholder="Search for doc" />
		{ doc.sections.map((sec) => {
			return (
				<View stretchX gap={1} key={sec.name}>
					<Text size="big" color={3}>{sec.name}</Text>
						<View>
							{
								sec.entries
									.filter((name) => query ? name.match(query) : true)
									.map((name) => {
										let dname = name;
										const mem = doc.entries[name][0];
										if (mem.kind === "MethodSignature") {
											dname += "()";
										}
										return (
											<a key={name} href={`#${name}`}>
												<View
													padX={1}
													padY={0.5}
													css={{
														cursor: "pointer",
														borderRadius: 8,
														":hover": {
															background: "var(--color-bg3)",
														},
													}}
												>
													<Text color={2} code>{dname}</Text>
												</View>
											</a>
										);
									})
							}
						</View>
				</View>
			);
		}) }
	</>;
};

const Nav: React.FC = ({children}) => (
	<Background pad={3}>
		<View stretch dir="row" bg={1} rounded outlined css={{ overflow: "hidden" }}>
			<View
				dir="column"
				gap={3}
				stretchY
				width={260}
				pad={3}
				bg={2}
				css={{
					overflowX: "hidden",
					overflowY: "scroll",
				}}
			>
				<View />
				<Logo />
				<ThemeSwitch width={120} />
				<View gap={0.5}>
					<NavLink link="/play" text="PlayGround" />
					<NavLink link="/doc/setup" text="Setup Guide" />
					<NavLink link="/doc/intro" text="Tutorial" />
					<NavLink link="https://github.com/replit/kaboom" text="Github" />
				</View>
				<Index />
			</View>
			{/*<div css={{
				height: 640,
				width: 640,
				background: "blue",
				boxSizing: "border-box",
				overflow: "scroll",
				display: "flex",
				padding: 120,
				flexDirection: "column",
			}}>
				<div css={{
					height: 1200,
					width: "100%",
					background: "green",
				}}>
				</div>
			</div>*/}
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
