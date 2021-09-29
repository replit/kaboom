import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { keyframes } from '@emotion/react';

import Page from "comps/page";
import Text from "comps/text";
import Spacer from "comps/spacer";
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
	<div
		css={{
			position: "relative",
			height: "180px",
		}}
	>
		<img
			src="/img/boom.svg"
			alt="boom"
			css={{
				position: "absolute",
				animation: `${anims.kaboom} 5s infinite`,
			}}
		/>
		<img
			src="/img/ka.svg"
			alt="ka"
			css={{
				position: "absolute",
				left: "-24px",
				top: "32px",
				animation: `${anims.kaboom} 5s infinite`,
				animationDelay: "0.08s",
			}}
		/>
	</div>
);

const Info: React.FC = () => (
	<div>
		<Text
			size="huge"
			css={{
				whiteSpace: "pre",
				fontSize: "48px",
 			}}
		>
			Kaboom is a JavaScript{"\n"}game programming library{"\n"}that helps you make games{"\n"}fast and <span>fun</span>.
		</Text>
		<Spacer space={6} />
		<Text
			size="huge"
			css={{
				whiteSpace: "pre",
				fontSize: "48px",
 			}}
		>
			Check out the <Link href="/doc">docs</Link>, <Link href="/demo">demos</Link>,{"\n"}<Link href="/doc/intro">tutorial</Link>, and <a href="https://github.com/replit/kaboom">github</a>.
		</Text>
	</div>
);

const Home: React.FC = () => (
	<Page
		css={{
			width: "100%",
			height: "100%",
			background: "url(/img/bg.svg) repeat var(--color-bg1)",
			animation: `${anims.scroll} 5s infinite linear`,
			overflow: "scroll",
			fontFamily: "Necto Mono",
		}}
	>
		<div
			css={{
				margin: "0 auto",
				width: "calc(600px + 30vw)",
				maxWidth: "90%",
			}}
		>
			<Spacer space={6} />
			<Logo />
			<Spacer space={3} />
			<Info />
		</div>
		<ThemeToggle
			css={{
				position: "fixed",
				bottom: "24px",
				right: "24px",
			}}
		/>
	</Page>
);

export default Home;
