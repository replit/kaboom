import * as React from "react";
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

const Doc: React.FC = () => {

	const { data } = useFetch("/types.json", (res) => res.json());

	return (
		<Page>
			<Button text="2" onClick={() => {}} />
			<Text size="huge">
				yo
			</Text>
			<Select options={["123", "345"]} selected="123" onChange={console.log} />
			<ThemeToggle />
		</Page>
	);
};

export default Doc;
