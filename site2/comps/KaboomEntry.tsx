import * as React from "react";
import Ctx from "lib/Ctx";
import View from "comps/View";
import Text from "comps/Text";

interface KaboomEntryProps {
	name: string,
}

const KaboomMember: React.FC<any> = (def) => {
	console.log(def.jsDoc);
	return (
		<View>
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
		<View>
			{entries.map((e: any, i: number) => <KaboomMember key={i} {...e} />)}
		</View>
	);
};

export default KaboomEntry;
