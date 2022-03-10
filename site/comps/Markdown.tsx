import * as React from "react"
import { marked } from "marked"
import hljs from "highlight.js/lib/core"
import javascript from "highlight.js/lib/languages/javascript"
import typescript from "highlight.js/lib/languages/typescript"
import xml from "highlight.js/lib/languages/xml"
import shell from "highlight.js/lib/languages/shell"
import bash from "highlight.js/lib/languages/bash"
import View, { ViewProps } from "comps/View"

hljs.registerLanguage("javascript", javascript)
hljs.registerLanguage("typescript", typescript)
hljs.registerLanguage("xml", xml)
hljs.registerLanguage("shell", shell)
hljs.registerLanguage("bash", bash)

marked.setOptions({
	highlight: (code, lang) => {
		return hljs.highlight(code, {
			language: lang,
		}).value
	},
})

interface MarkdownProps {
	src: string,
	baseUrl?: string,
	dim?: boolean,
}

const Markdown: React.FC<MarkdownProps & ViewProps> = ({
	src,
	baseUrl,
	dim,
	...args
}) => (
	<View
		stretchX
		gap={2}
		// @ts-ignore
		dangerouslySetInnerHTML={{
			__html: marked(src, {
				baseUrl: baseUrl,
			}),
		}}
		css={{
			"*": {
				maxWidth: "100%",
			},
			"h1": {
				fontSize: 48,
			},
			"h2": {
				fontSize: 36,
			},
			"h3,h4,h5,h6": {
				fontSize: 24,
			},
			"h1,h2,h3,h4,h5,h6,p": {
				color: `var(--color-fg${dim ? 2 : 1})`,
			},
			"p": {
				fontSize: "var(--text-normal)",
				lineHeight: 1.6,
				userSelect: "text",
			},
			"ul,ol": {
				color: `var(--color-fg${dim ? 2 : 1})`,
				lineHeight: 2,
				marginLeft: 24,
			},
			"a": {
				color: "var(--color-highlight)",
			},
			"a:visited": {
				color: "var(--color-highlight)",
			},
			"img": {
				borderRadius: 8,
			},
			"video": {
				borderRadius: 8,
			},
			"pre": {
				width: "100%",
				background: "var(--color-bg2)",
				borderRadius: 8,
				boxShadow: "0 0 0 2px var(--color-outline)",
				display: "flex",
				userSelect: "text",
				"code": {
					padding: 16,
					width: "100%",
					overflowY: "auto",
				},
			},
			"code": {
				userSelect: "text",
				fontFamily: "IBM Plex Mono",
				color: "var(--color-fg2)",
				background: "var(--color-bg2)",
				borderRadius: 8,
				padding: "4px 8px",
			},
			"p > code": {
				padding: "2px 6px",
				borderRadius: 8,
				background: "var(--color-bg2)",
			},
			"blockquote *": {
				fontStyle: "italic",
				color: "var(--color-fg3)",
			},
			// dim
			[[
				".hljs-comment",
				".hljs-quote",
			].join(",")]: {
				color: "var(--color-fg4)",
			},
			// red
			[[
				".hljs-variable",
				".hljs-template-variable",
				".hljs-tag",
				".hljs-name",
				".hljs-selector-id",
				".hljs-selector-class",
				".hljs-regexp",
				".hljs-link",
				".hljs-meta",
			].join(",")]: {
				color: "#ef6155",
			},
			// orange
			[[
				".hljs-number",
				".hljs-built_in",
				".hljs-builtin-name",
				".hljs-literal",
				".hljs-type",
				".hljs-params",
				".hljs-deletion",
			].join(",")]: {
				color: "#f99b15",
			},
			// yellow
			[[
				".hljs-section",
				".hljs-attribute",
			].join(",")]: {
				color: "#fec418",
			},
			[[
				".hljs-string",
				".hljs-symbol",
				".hljs-bullet",
				".hljs-addition",
			].join(",")]: {
				color: "#48b685",
			},
			// purple
			[[
				".hljs-keyword",
				".hljs-selector-tag",
			].join(",")]: {
				color: "#815ba4",
			},
			".hljs-emphasis": {
				fontStyle: "italic",
			},
			".hljs-strong": {
				fontWeight: "bold",
			},
		}}
		{...args}
	/>
)

export default Markdown
