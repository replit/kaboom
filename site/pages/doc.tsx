import Page from "comps/Page";
import Head from "comps/Head";
import Markdown from "comps/Markdown";
import Nav from "comps/Nav";
import Text from "comps/Text";
import Button from "comps/Button";
import useFetch from "hooks/useFetch";
import { capitalize } from "lib/str";

interface DocProps {
	src: string,
}

const Doc: React.FC<DocProps> = ({
	src,
}) => {
	return <Page>
		<Nav>
			<Markdown src={src} baseUrl="/site/doc/" />
		</Nav>
	</Page>;
}

export default Doc;
