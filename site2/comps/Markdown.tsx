import * as React from "react";
import marked from "marked";
import hljs from "highlight.js"
import View, { ViewProps } from "comps/View";

marked.setOptions({
	highlight: (code, lang) => {
		return hljs.highlight(code, {
			language: lang,
		}).value;
	}
});

interface MarkdownProps {
	src: string,
}

const Markdown = React.forwardRef<HTMLDivElement, MarkdownProps & ViewProps>(({
	src,
	...args
}) => (
	<View
		gap={2}
		// @ts-ignore
		dangerouslySetInnerHTML={{
			__html: marked(src),
		}}
		{...args}
	/>
));

export default Markdown;
