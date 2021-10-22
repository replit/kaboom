import fs from "fs/promises";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "comps/Head";
import Markdown from "comps/Markdown";
import Nav from "comps/Nav";
import Text from "comps/Text";
import Button from "comps/Button";
import { capitalize } from "lib/str";

interface DocProps {
	name: string,
	src?: string,
}

const Doc: React.FC<DocProps> = ({
	src,
	name,
}) => (
	<Nav>
		<Head title={`Kaboom - ${capitalize(name)}`} />
		{ src
			? <Markdown src={src || ""} baseUrl="/site/doc/" />
			: <Text color={3}>{`There's no doc called "${name}" :(`}</Text>
		}
	</Nav>
);

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const { name } = ctx.query;
	const path = `public/site/doc/${name}.md`
	const stat = await fs.stat(path);
	const src = stat.isFile() ? await fs.readFile(path, "utf8") : null;
	return {
		props: {
			name,
			src,
		},
	};
}

export default Doc;
