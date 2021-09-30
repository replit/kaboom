import { useRouter } from "next/router";
import Markdown from "comps/Markdown";
import Nav from "comps/Nav";
import Text from "comps/Text";
import useFetch from "hooks/useFetch";

const Doc = () => {

	const router = useRouter()
	const { name } = router.query;
	const { data: doc, loading } = useFetch(`/public/doc/${name}.md`, (res) => res.text());

	return <Nav>
		{loading
			? <Text color={3}>loading...</Text>
			: <Markdown src={doc} />
		}
	</Nav>;

}

export default Doc;
