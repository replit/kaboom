import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { keyframes } from '@emotion/react';

import useMediaQuery from "hooks/useMediaQuery";
import useClickOutside from "hooks/useClickOutside";
import useUpdateEffect from "hooks/useUpdateEffect";
import Background from "comps/Background";
import View from "comps/View";
import Text from "comps/Text";
import Markdown from "comps/Markdown";
import Input from "comps/Input";
import Drawer from "comps/Drawer";
import ThemeSwitch from "comps/ThemeSwitch";
import doc from "doc.json";

const popping = keyframes(`
	0% {
		transform: scale(1);
	}
	5% {
		transform: scale(1.1);
	}
	10% {
		transform: scale(1);
	}
`);

const Logo: React.FC = () => (
	<Link href="/" passHref>
		<a>
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
						animation: `${popping} 5s infinite`,
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
						animation: `${popping} 5s infinite`,
						animationDelay: "0.08s",
					}}
				/>
			</View>
		</a>
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
		<a>
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
		</a>
	</Link>
);

const NARROW = 840;
const MOBILE = 640;

const Index: React.FC = () => {

	const isNarrow = useMediaQuery(`(max-width: ${NARROW}px)`);
	const [ expanded, setExpanded ] = React.useState(false);

	useUpdateEffect(() => {
		setExpanded(!isNarrow);
	}, [ isNarrow ]);

	return isNarrow ? (
		<Drawer
			handle
			height="90%"
			expanded={expanded}
			setExpanded={setExpanded}
		>
			<IndexContent shrink={() => setExpanded(false)} />
		</Drawer>
	) : (
		<View
			stretchY
			bg={2}
		>
			<IndexContent shrink={() => setExpanded(false)} />
		</View>
	);

};

type SectionTuple = [string, string[]]

interface IndexContentProps {
	shrink: () => void,
}

const IndexContent: React.FC<IndexContentProps> = ({
	shrink,
}) => {

	const [ query, setQuery ] = React.useState("");

	const filteredSections = doc.sections.reduce((acc: SectionTuple[], cur) => {
		const filteredEntries = cur.entries
			.filter(name => query ? name.match(new RegExp(query, "i")) : true);

		// Exclude sections that have no matching entries.
		return filteredEntries.length > 0
			? acc.concat([[cur.name, filteredEntries]])
			: acc;
	}, [])

	return <>

		<View
			dir="column"
			gap={2}
			stretchY
			width={240}
			pad={3}
			css={{
				overflowX: "hidden",
				overflowY: "auto",
			}}
		>
			<View />
			<Logo />
			<ThemeSwitch width={160} />
			<View gap={0.5}>
				<NavLink link="/play" text="PlayGround" />
				<NavLink link="/doc/intro" text="Tutorial" />
				<NavLink link="https://github.com/replit/kaboom" text="Github" />
				<NavLink link="https://discord.com/invite/aQ6RuQm3TF" text="Discord" />
			</View>

			<Input value={query} onChange={setQuery} placeholder="Search in doc" />

			{ filteredSections.map(([sectionName, entries]) => {

				return (
					<View stretchX gap={1} key={sectionName}>
						<Text size="big" color={3}>{sectionName}</Text>
							<View>
								{ entries.map((name) => {

									const mem = (doc as any).types["KaboomCtx"][0].members[name]?.[0] || (doc as any).types[name]?.[0];

									if (mem.jsDoc?.tags["deprecated"]) {
										return
									}

									const isFunc = mem.kind === "MethodSignature" || mem.kind === "FunctionDeclaration";

									return (
										<a key={name} href={`/#${name}`}>
											<View
												padX={1}
												padY={0.5}
												onClick={shrink}
												css={{
													cursor: "pointer",
													borderRadius: 8,
													":hover": {
														background: "var(--color-bg3)",
													},
												}}
											>
												<Text color={2} code>{name}{isFunc ? "()" : ""}</Text>
											</View>
										</a>
									);

								}) }
							</View>
					</View>
				);

			}) }
		</View>
	</>;

};

const Nav: React.FC = ({children}) => (
	<Background pad={3} css={{
		[`@media (max-width: ${MOBILE}px)`]: {
			padding: "0 !important",
			borderRadius: 0,
		},
		[`@media (max-width: ${NARROW}px)`]: {
			paddingLeft: 40,
		},
	}}>
		<View
			stretch
			dir="row"
			align="center"
			bg={1}
			rounded
			outlined
			css={{
				overflow: "hidden",
				[`@media (max-width: ${MOBILE}px)`]: {
					borderRadius: 0,
				},
			}}
		>
			<Index />
			<View
				dir="column"
				gap={3}
				stretchY
				css={{
					overflowX: "hidden",
					overflowY: "auto",
					padding: 32,
					flex: "1",
					[`@media (max-width: ${MOBILE}px)`]: {
						padding: 24,
						paddingLeft: 40,
					},
				}}
			>
				{children}
			</View>
		</View>
	</Background>
);

export default Nav;
