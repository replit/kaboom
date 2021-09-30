import * as React from "react";
import Link from "next/link";
import Editor, { EditorRef } from "comps/editor";
import GameView, { GameViewRef } from "comps/gameview";
import useFetch from "hooks/useFetch";
import Page from "comps/page";
import Button from "comps/button";
import Toggle from "comps/toggle";
import ThemeSwitch from "comps/themeswitch";
import Text from "comps/text";
import Select from "comps/select";
import View from "comps/view";

const UI: React.FC = () => (
	<Page>
		<View pad={4} dir="column" gap={3}>
			<View dir="column" gap={1}>
				<Text>here{"'"}s a dropdown menu</Text>
				<Select options={["Jack", "Panda", "Banana"]} onChange={() => {}} />
			</View>
			<View dir="column" gap={1}>
				<Text>here{"'"}s a toggle</Text>
				<Toggle onChange={() => {}} />
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
				<Text>here{"'"}s an editor</Text>
				<Editor width={640} height={320} />
			</View>
			<View dir="column" gap={1}>
				<Text>here{"'"}s a game view</Text>
				<GameView code="kaboom()" width={640} height={480} />
			</View>
		</View>
	</Page>
);

export default UI;
