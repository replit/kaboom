import * as React from "react";
import Link from "next/link";
import useFetch from "hooks/useFetch";
import Editor, { EditorRef } from "comps/Editor";
import GameView, { GameViewRef } from "comps/GameView";
import Page from "comps/Page";
import Button from "comps/Button";
import Toggle from "comps/Toggle";
import ThemeSwitch from "comps/ThemeSwitch";
import Text from "comps/Text";
import Select from "comps/Select";
import View from "comps/View";
import Menu from "comps/Menu";
import Input from "comps/Input";
import Markdown from "comps/Markdown";
import Inspect from "comps/Inspect";
import Background from "comps/Background";
import KaboomEntry from "comps/KaboomEntry";

interface ExampleProps {
	thing: string,
}

const Example: React.FC<ExampleProps> = ({ thing, children }) => (
	<View dir="column" gap={2}>
		<Text color={4} size="huge">here{"'"}s a {thing}</Text>
		{children}
	</View>
);

const UI: React.FC = () => (
	<Page>
		<Background pad={4} dir="column" gap={3}>
			<Example thing="dropdown menu">
				<Select
					name="Name Selector"
					desc="Select some names!"
					options={["Jack", "Panda", "Banana"]}
				/>
			</Example>
			<Example thing="menu">
				<Menu items={[
					{
						name: "Copy",
					},
					{
						name: "Rename",
					},
					{
						name: "Delete",
						danger: true,
					},
				]} />
			</Example>
			<Example thing="toggle">
				<Toggle />
			</Example>
			<Example thing="input">
				<Input placeholder="Enter your bank account and password" />
			</Example>
			<Example thing="theme switcher">
				<ThemeSwitch />
			</Example>
			<Example thing="text">
				<Text italic bold size="huge">oh hi mark</Text>
			</Example>
			<Example thing="button">
				<Button text="Run" action={() => {}} name="Run Button" desc="run current code" />
			</Example>
			<Example thing="inspect button">
				<Inspect />
			</Example>
			<Example thing="game view">
				<GameView
					code={`
kaboom();
keyPress(() => addKaboom(mousePos()));
mouseMove(() => addKaboom(mousePos()));
					`}
					width={640}
					height={480}
				/>
			</Example>
			<Example thing="editor">
				<Editor
					name="Code Editor"
					desc="Edit your code here!"
					width={640}
					height={320}
					placeholder="Congrats you have discovered the placeholder text"
					content={`
kaboom();

// load default sprite "bean"
loadBean();

// add to screen
add([
	sprite("bean"),
	pos(80, 40),
]);
					`.trim()}
				/>
			</Example>
			<Example thing="piece of doc">
				<View width={640}>
					<KaboomEntry name="add" />
				</View>
			</Example>
		</Background>
	</Page>
);

export default UI;
