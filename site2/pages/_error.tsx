import { NextPage, NextPageContext } from "next";
import Page from "comps/Page";
import Background from "comps/Background";
import View from "comps/View";
import Text from "comps/Text";
import ThemeSwitch from "comps/ThemeSwitch";

interface ErrorProps {
	statusCode: number,
}

const Error: NextPage<ErrorProps> = ({ statusCode }) => (
	<Page>
		<Background align="center" justify="center">
			<View align="center" gap={2}>
				<Text color={4} bold css={{ fontSize: 120 }}>{statusCode}</Text>
				<ThemeSwitch />
			</View>
		</Background>
	</Page>
);

Error.getInitialProps = ({ res, err }: NextPageContext): ErrorProps => {
	return {
		statusCode: res?.statusCode ?? 404,
	};
}

export default Error;
