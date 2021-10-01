import * as React from "react";
import Ctx from "lib/Ctx";
import View from "comps/View";
import Text from "comps/Text";
import Markdown from "comps/Markdown";

interface KaboomEntryProps {
	name: string,
}

const KaboomMember: React.FC<any> = (def) => {
	const doc = def.jsDoc?.[0];
	console.log(doc);
	return (
		<View gap={1} stretchX>
			<Text size="big">{def.name}</Text>
			{
				doc &&
				<View gap={2} stretchX>
					<Text color={2}>{doc.comment}</Text>
					{ (doc.tags ?? []).map((tag: any) => {
						switch (tag.tagName) {
							case "example": return <Markdown src={tag.comment} />;
							default: return <></>;
						}
					}) }
				</View>
			}
		</View>
	);
};

const KaboomEntry: React.FC<KaboomEntryProps> = ({
	name,
}) => {
	const { doc } = React.useContext(Ctx);
	if (!doc?.entries) {
		return (
			<Text color={3}>Loading docs...</Text>
		);
	}
	const entries = doc.entries[name];
	if (!entries) {
		return (
			<Text color={3}>Entry not found: {name}</Text>
		);
	}
	return (
		<View stretchX>
			{entries.map((e: any, i: number) => <KaboomMember key={i} {...e} />)}
		</View>
	);
};

export default KaboomEntry;
