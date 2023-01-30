import * as React from "react"
import matter from "gray-matter"
import fs from "fs/promises"
import { GetServerSideProps } from "next"
import Nav from "comps/Nav"
import Text from "comps/Text"
import Head from "comps/Head"
import BlogEntry from "comps/BlogEntry"
import View from "comps/View"

interface Blog {
	title: string;
	author: string;
	date: string;
	description: string;
	image: string;
	link: string;
}

interface BlogProps {
	blogs: Blog[];
}

const Blog: React.FC<BlogProps> = ({
	blogs,
}) => {
	return (
		<Nav>
			<Head title="Kaboom Blog" />
			<Text size="huge" bold>Blog</Text>
			<View gap={4}>
				{blogs.map((blog) => (
					<a key={blog.link} href={blog.link} css={{ width: "100%" }}>
						<BlogEntry
							title={blog.title}
							author={blog.author}
							date={blog.date}
							description={blog.description}
							image={`/static/blog/banners/${blog.image}`}
						/></a>))}
			</View>
		</Nav>
	)
}

export const getServerSideProps: GetServerSideProps = async () => {
	const blogs = []

	for await (const blogEntry of await fs.readdir("public/static/blog")) {
		if(!blogEntry.endsWith("md")) continue

		const blog = await fs.readFile(`public/static/blog/${blogEntry}`, "utf8")
		const data = matter(blog).data

		data.link = `blog/${blogEntry.substring(0, blogEntry.length - 3)}`

		blogs.push(data)
	}

	// sort by date and reverse
	blogs.sort((a, b) => {
		const c = new Date(a.date).getTime()
		const d = new Date(b.date).getTime()

		return c - d
	}).reverse()

	return {
		props: {
			blogs: blogs,
		},
	}

}

export default Blog
