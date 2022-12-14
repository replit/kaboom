import fs from "fs/promises"
import { GetServerSideProps } from "next"
import Head from "comps/Head"
import Markdown from "comps/Markdown"
import Nav from "comps/Nav"
import matter from "gray-matter"
import { capitalize } from "lib/str"

interface BlogProps {
	name: string,
	src: string,
}

const Blog: React.FC<BlogProps> = ({
	src,
	name,
}) => (
	<Nav>
		<Head title={`Kaboom - ${capitalize(name)}`} />
		<Markdown src={matter(src).content} baseUrl="/static/blog/" />
	</Nav>
)

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const { name } = ctx.query
	const path = `public/static/blog/${name}.md`
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

export default Blog
