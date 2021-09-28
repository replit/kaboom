import * as React from "react";
import { Page, Text, Space, VStack, HStack } from "./ui";
import { useFetch } from "./utils";

const Doc: React.FC = () => {

	const { data } = useFetch("/types.json", (res) => res.json());

	return (
		<Page>
			<Text size="huge">
				yo
			</Text>
		</Page>
	);
};

export default Doc;
