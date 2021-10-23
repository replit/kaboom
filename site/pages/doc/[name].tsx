import fs from "fs"
import { GetServerSideProps } from "next"
import Head from "comps/Head"
import Markdown from "comps/Markdown"
import Nav from "comps/Nav"
import Text from "comps/Text"
import { capitalize } from "lib/str"

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
)

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const { name } = ctx.query
	const path = `public/site/doc/${name}.md`
	const src = fs.existsSync(path) ? fs.readFileSync(path, "utf8") : null
	return {
		props: {
			name,
			src,
		},
	}
}

export default Doc
