import * as React from "react";
import Link from "next/link";

import useFetch from "hooks/useFetch";
import Page from "comps/page";
import Text from "comps/text";
import Spacer from "comps/spacer";
import ThemeToggle from "comps/themetoggle";
import Button from "comps/button";
import Select from "comps/select";
import View from "comps/view";

import Markdown from "comps/markdown";

interface IndexSectionProps {
	title: string,
}

const IndexSection: React.FC<IndexSectionProps> = ({
	title,
	children,
	...args
}) => (
	<View dir="column" {...args}>
		<Text color={2}>{title}</Text>
		{children}
	</View>
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
	<View
		dir="column"
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
	</View>
);

const Content: React.FC = () => (
	<View
		dir="column"
		space={3}
		css={{
			flex: "1",
			height: "100%",
			padding: "48px",
			overflow: "scroll",
			background: "var(--color-bg1)",
		}}
	>
	</View>
);

const Doc: React.FC = () => {

	const { data } = useFetch("/types.json", (res) => res.json());

	return (
		<Page>
			<View dir="row" stretch>
				<SideBar />
				<Content />
			</View>
		</Page>
	);

};

export default Doc;
