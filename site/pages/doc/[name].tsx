import fs from "fs/promises"
import { GetServerSideProps } from "next"
import Head from "comps/Head"
import Markdown from "comps/Markdown"
import Nav from "comps/Nav"
import { capitalize } from "lib/str"

interface DocProps {
	name: string,
	src: string,
}

const Doc: React.FC<DocProps> = ({
	src,
	name,
}) => (
	<Nav>
		<Head title={`Kaboom - ${capitalize(name)}`} />
		<Markdown src={src} baseUrl="/static/doc/" />
	</Nav>
)

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const { name } = ctx.query
	const path = `public/static/doc/${name}.md`
	try {
		return {
			props: {
				name: name,
				src: await fs.readFile(path, "utf8"),
			},
		}
	} catch (e) {
		return {
			notFound: true,
		}
	}
}

export default Doc
