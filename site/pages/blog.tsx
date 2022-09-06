import * as React from "react"
import Background from "comps/Background"
import fs from "fs/promises"
import { GetServerSideProps } from "next"
import Nav from "comps/Nav"
import Text from "comps/Text"
import Head from "comps/Head"
import BlogEntry from "comps/BlogEntry"
import matter from "gray-matter"

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

const BlogEntries: React.FC<BlogProps> = ({ blogs }) => {
	const blogsEntries = []

	for(const blog of blogs) {
		blogsEntries.push(<a href={blog.link} css={{ width: "100%" }}><BlogEntry
			title={blog.title}
			author={blog.author}
			date={blog.date}
			description={blog.description}
			image={`site/blog/banners/${blog.image}`}
		/></a>)
	}

	return (
		<>{blogsEntries}</>
	)
}
const Blog: React.FC<BlogProps> = ({
	blogs,
}) => {
	return (
		<Nav>
			<Head title="KaBlog" />
			
			<Text size="huge" bold>Blog</Text>
			<Text size="normal">Welcome to the KaBlog, where we share news, jams and cool stuff arround Kaboom :&gt;</Text>

			<BlogEntries blogs={blogs}/>
		</Nav>
	)
}

export const getServerSideProps: GetServerSideProps = async () => {
	const blogs = []

	for await (const blogEntry of await fs.readdir("public/site/blog")) {
		if(!blogEntry.endsWith("md")) continue

		const blog = await fs.readFile(`public/site/blog/${blogEntry}`, "utf8")
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