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

const UI: React.FC = () => (
	<Page>
		<View pad={4} dir="column" gap={3}>
			<View dir="column" gap={1}>
				<Text>here{"'"}s a dropdown menu</Text>
				<Select options={["Jack", "Panda", "Banana"]} onChange={() => {}} />
			</View>
			<View dir="column" gap={1}>
				<Text>here{"'"}s a menu</Text>
				<Menu items={[
					{
						name: "Copy",
						action: () => {},
					},
					{
						name: "Rename",
						action: () => {},
					},
					{
						name: "Delete",
						action: () => {},
						danger: true,
					},
				]} />
			</View>
			<View dir="column" gap={1}>
				<Text>here{"'"}s a toggle</Text>
				<Toggle onChange={() => {}} />
			</View>
			<View dir="column" gap={1}>
				<Text>here{"'"}s an input</Text>
				<Input />
			</View>
			<View dir="column" gap={1}>
				<Text>here{"'"}s a theme switcher</Text>
				<ThemeSwitch />
			</View>
			<View dir="column" gap={1}>
				<Text>here{"'"}s a text</Text>
				<Text italic bold size="huge">oh hi mark</Text>
			</View>
			<View dir="column" gap={1}>
				<Text>here{"'"}s a button</Text>
				<Button text="Run" onClick={() => {}} />
			</View>
			<View dir="column" gap={1}>
				<Text>here{"'"}s a game view</Text>
				<GameView code="kaboom(); keyPress('space', () => alert('yo'))" width={640} height={480} />
			</View>
			<View dir="column" gap={1}>
				<Text>here{"'"}s an editor</Text>
				<Editor width={640} height={320} placeholder="yo" content={`
kaboom();

// load default sprite "bean"
loadBean();

// add to screen
add([
	sprite("bean"),
	pos(80, 40),
]);
				`.trim()} />
			</View>
			<View dir="column" gap={1}>
				<Text>here{"'"}s a markdown</Text>
				<Markdown width={960} src={`
## Examples

(these are for the newest beta version or \`kaboom@next\`)

Lots of iteractive examples [here](https://kaboomjs.com/demo)

\`\`\`html
<script type="module">

// import kaboom lib
import kaboom from "https://unpkg.com/kaboom@next/dist/kaboom.mjs";

// initialize kaboom context
kaboom();

// add a piece of text at position (120, 80)
add([
    text("hello"),
    pos(120, 80),
]);

</script>
\`\`\`
You can paste this directly into an \`.html\` file, open it in browser, and start playing around!
				`} />
			</View>
		</View>
	</Page>
);

export default UI;
