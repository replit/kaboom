import * as React from "react";
import View, { ViewPropsAnd } from "comps/View";
import Text from "comps/Text";
import Markdown from "comps/Markdown";
import * as doc from "lib/doc";

interface KaboomEntryProps {
	name: string,
}

const FuncParams: React.FC<any> = (m) => m.parameters.map((p: any, i: number) => (
	<span
		key={p.name}
	>
		{p.name}
		{p.questionToken ? "?" : ""}
		{i === m.parameters.length - 1 ? "" : ", "}
	</span>
));

const MethodSignature: React.FC<any> = (m) => (
	<Text
		code
		size="big"
	>
		{m.name}(<FuncParams {...m} />)
	</Text>
);

const PropertySignature: React.FC<any> = (m) => (
	<Text code size="big">{m.name}</Text>
);

const KaboomMember: React.FC<any> = (m) => {
	const doc = m.jsDoc?.[0];
	return (
		<View gap={1} stretchX>
			{(() => {
				switch (m.kind) {
					case "MethodSignature": return <MethodSignature {...m} />;
					case "PropertySignature": return <PropertySignature {...m} />;
					default: return <></>;
				}
			})()}
			{
				doc &&
				<View gap={2} stretchX>
					<Text color={2}>{doc.comment}</Text>
					{ (doc.tags ?? []).map((tag: any) => {
						switch (tag.tagName) {
							case "example": return <Markdown key={tag.comment} src={tag.comment} />;
							default: return null;
						}
					}) }
				</View>
			}
		</View>
	);
};

const KaboomEntry: React.FC<ViewPropsAnd<KaboomEntryProps>> = ({
	name,
	...args
}) => {
	if (!doc?.entries) {
		return <Text color={3}>Loading docs...</Text>;
	}
	const entries = doc.entries[name];
	if (!entries) {
		return <Text color={3}>Entry not found: {name}</Text>;
	}
	return (
		<View stretchX {...args} gap={3}>
			{entries.map((e: any, i: number) => <KaboomMember key={i} {...e} />)}
		</View>
	);
};

export default KaboomEntry;
