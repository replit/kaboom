import hljs from "highlight.js";
import View, { ViewProps } from "comps/View";

interface CodeProps {
	code: string,
	lang: string,
}

const Code: React.FC<CodeProps> = ({
	code: content,
	lang,
	...args
}) => (
	<View stretchX {...args}>
		<pre
			css={{
				fontFamily: "IBM Plex Mono",
				tabSize: 4,
			}}
			{...args}
		>
			<code
				dangerouslySetInnerHTML={{
					__html: hljs.highlight(content.trim(), {
						language: lang,
					}).value,
				}}
			>
			</code>
		</pre>
	</View>
);

export default Code;
