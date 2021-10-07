import { useRouter } from "next/router";
import Link from "next/link";
import Head from "comps/Head";
import Markdown from "comps/Markdown";
import Nav from "comps/Nav";
import Text from "comps/Text";
import Button from "comps/Button";
import useFetch from "hooks/useFetch";
import { capitalize } from "lib/str";

const Doc = () => {

	const router = useRouter();
	const { name } = router.query;
	const { data: doc, loading } = useFetch(
		name ? `/site/doc/${name}.md` : null,
		(res) => res.text()
	);

	return <Nav>
		<Head title={`Kaboom - ${capitalize(name as string ?? "")}`} />
		<Link href="/" passHref>
			<Button text="< Back" action={() => {}} />
		</Link>
		{ loading
			? <Text color={3}>loading...</Text>
			: <Markdown src={doc ?? ""} baseUrl="/site/doc/" />
		}
	</Nav>;

}

export default Doc;
