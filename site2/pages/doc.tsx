import * as React from "react";
import Link from "next/link";
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
} from "./ui";

interface IndexSectionProps {
	title: string,
}

const IndexSection: React.FC<IndexSectionProps> = ({
	title,
	children,
	...args
}) => (
	<VStack {...args}>
		<Text color={2}>{title}</Text>
		{children}
	</VStack>
);

interface IndexEntryProps {
	href: string,
}

const IndexEntry: React.FC<IndexEntryProps> = ({
	href,
	children,
	...args
}) => (
	<a href={href}>
		<Text color={2}>{children}</Text>
	</a>
);

const SideBar: React.FC = () => (
	<VStack
		space={3}
		css={{
			width: 240,
			height: "100%",
			padding: "24px",
			overflow: "scroll",
			background: "var(--color-bg2)",
		}}
	>
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
		<ThemeToggle />
		<IndexSection title="Tutorials">
		</IndexSection>
	</VStack>
);

const Content: React.FC = () => (
	<VStack
		space={3}
		css={{
			flex: "1",
			height: "100%",
			padding: "48px",
			overflow: "scroll",
			background: "var(--color-bg1)",
		}}
	>
	</VStack>
);

const Doc: React.FC = () => {

	const { data } = useFetch("/types.json", (res) => res.json());

	return (
		<Page>
			<HStack css={{height: "100%"}}>
				<SideBar />
				<Content />
			</HStack>
		</Page>
	);

};

export default Doc;
