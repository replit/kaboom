import fs from "fs/promises";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Head from "comps/Head";
import GameView from "comps/GameView";
import Nav from "comps/Nav";
import Text from "comps/Text";
import Button from "comps/Button";
import { capitalize } from "lib/str";

interface DocProps {
	name: string,
	code?: string,
}

const Doc: React.FC<DocProps> = ({
	code,
	name,
}) => (
	<>
		<Head title={`Kaboom Demo - ${capitalize(name)}`} />
		{ code
			? <GameView stretch code={code || ""} />
			: <Text color={3}>{`There's no doc called "${name}" :(`}</Text>
		}
	</>
);

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const { name } = ctx.query;
	const path = `public/site/demo/${name}.js`;
	try {
		return {
			props: {
				name: name,
				code: await fs.readFile(path, "utf8"),
			},
		}
	} catch (e) {
		return {
			notFound: true,
		}
	}
}

export default Doc;
