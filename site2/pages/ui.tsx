import * as React from "react";
import Link from "next/link";
import Editor, { EditorRef } from "comps/editor";
import GameView, { GameViewRef } from "comps/gameview";
import useFetch from "hooks/useFetch";
import Page from "comps/page";
import Button from "comps/button";
import Toggle from "comps/toggle";
import ThemeToggle from "comps/themetoggle";
import Text from "comps/text";
import Select from "comps/select";
import View from "comps/view";

const UI: React.FC = () => (
	<Page>
		<View pad={4} dir="column" space={3}>
			<View dir="column" space={1}>
				<Text>here{"'"}s a dropdown menu</Text>
				<Select options={["Jack", "Panda", "Banana"]} />
			</View>
			<View dir="column" space={1}>
				<Text>here{"'"}s a toggle</Text>
				<Toggle onChange={() => {}} />
			</View>
			<View dir="column" space={1}>
				<Text>here{"'"}s a theme toggle</Text>
				<ThemeToggle />
			</View>
			<View dir="column" space={1}>
				<Text>here{"'"}s a text</Text>
				<Text italic bold size="huge">oh hi mark</Text>
			</View>
			<View dir="column" space={1}>
				<Text>here{"'"}s a button</Text>
				<Button text="Run" onClick={() => {}} />
			</View>
			<View dir="column" space={1}>
				<Text>here{"'"}s an editor</Text>
				<Editor />
			</View>
			<View dir="column" space={1}>
				<Text>here{"'"}s a game view</Text>
				<GameView code="kaboom()" />
			</View>
			<View dir="column" space={1}>
				<Text>here{"'"}s the code for this page</Text>
				<a href="">Link</a>
			</View>
		</View>
	</Page>
);

export default UI;
