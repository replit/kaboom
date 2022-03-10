import * as React from "react"
import Link from "next/link"
import Head from "comps/Head"
import Editor, { EditorRef } from "comps/Editor"
import GameView, { GameViewRef } from "comps/GameView"
import Button from "comps/Button"
import Toggle from "comps/Toggle"
import ThemeSwitch from "comps/ThemeSwitch"
import Text from "comps/Text"
import Select from "comps/Select"
import View, { ViewProps } from "comps/View"
import Menu from "comps/Menu"
import Input from "comps/Input"
import Markdown from "comps/Markdown"
import Inspect from "comps/Inspect"
import Background from "comps/Background"
import Doc from "comps/Doc"
import Drop from "comps/Drop"
import Modal from "comps/Modal"

interface ExampleProps {
	thing: string,
}

const Example: React.FC<ExampleProps & ViewProps> = ({
	thing,
	children,
	...args
}) => (
	<View dir="column" gap={2} {...args}>
		<Text color={4} size="huge">here{"'"}s {thing}</Text>
		{children}
	</View>
)

const UI: React.FC = () => (
	<Background pad={6} dir="column" gap={6} css={{ overflow: "scroll" }}>
		<Head title="KUI" />
		{/*<Modal isOpen close={() => {}}>
			<View width={480} height={240} bg={2} pad={2} rounded outlined>
				<Text size="big">Are you sure?</Text>
			</View>
		</Modal>*/}
		<Example thing="a dropdown menu">
			<Select
				name="Name Selector"
				desc="Select some names!"
				options={["Jack", "Panda", "Banana"]}
			/>
		</Example>
		<Example thing="a menu">
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
		<Example thing="a toggle">
			<Toggle />
		</Example>
		<Example thing="an input">
			<View width={400}>
				<Input placeholder="Please enter your bank account and password" />
			</View>
		</Example>
		<Example thing="a theme switcher">
			<ThemeSwitch />
		</Example>
		<Example thing="a text">
			<Text select italic bold size="huge">oh hi mark</Text>
		</Example>
		<Example thing="a button">
			<Button text="Run" name="Run Button" desc="run current code" />
		</Example>
		<Example thing="an inspect button">
			<Inspect />
		</Example>
		<Example thing="a game view">
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
		<Example thing="an editor">
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
		<Example thing="a piece of doc">
			<View width={640} name="Document Component" desc="Display doc for a Kaboom function just by passing a name">
				<Doc name="add" />
			</View>
		</Example>
		<Example thing="a file dropper">
			<Drop
				name="add"
				align="center"
				justify="center"
				width={320}
				height={240}
				bg={1}
				rounded
				outlined
				accept="^image/"
				readAs="text"
				onLoad={(file, content) => console.log(file, content)}
			>
				<Text color={3}>drop images on me!</Text>
			</Drop>
		</Example>
	</Background>
)

export default UI
