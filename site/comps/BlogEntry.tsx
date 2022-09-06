import * as React from "react"
import View, { ViewProps } from "comps/View"
import { themes } from "lib/ui"
import Text from "comps/Text";
import Ctx from "lib/Ctx"

interface BlogEntryProps {
	title: string;
	author: string;
	date: string;
	description: string;
	image: string;
}

const MOBILE = 640

const BlogEntry: React.FC<BlogEntryProps & ViewProps> = ({
	children,
	title,
	author,
	date,
	description,
	image,
	...args
}) => {
	return (
		<View stretchX={true} height={180} dir="row" outlined={true} rounded={true} bg={3} padX={1} padY={1} css={{
			[`@media (max-width: ${MOBILE}px)`]: {
				flexDirection: "column",
				height: 320,
			},
		}}>
			<img src={image} css={{
				borderRadius: 8,
				width: "20%",
				height: "100%",
				objectFit: "cover",
				display: "block",
				marginRight: 14,
				[`@media (max-width: ${MOBILE}px)`]: {
					width: "100%",
					height: "30%"
				},
			}}/>

			<View bg={"none"} dir="column">
				<Text size="huge">{title}</Text>

				<Text size="small" css={{
					fontStyle: "italic",
					color: "var(--color-fg3)",
				}}>{author}, {date}</Text>

				<Text size="normal">{description}</Text>
			</View>
		</View>
	)
}

export default BlogEntry
