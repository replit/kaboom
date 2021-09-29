import marked from "marked";

interface MarkdownProps {
	src: string,
}

const Markdown: React.FC<MarkdownProps> = ({
	src,
	...args
}) => (
	<div
		dangerouslySetInnerHTML={{
			__html: marked(src),
		}}
		{...args}
	/>
);

export default Markdown;
