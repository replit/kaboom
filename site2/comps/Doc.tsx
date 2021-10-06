import * as React from "react";
import Link from "next/link";
import View, { ViewPropsAnd } from "comps/View";
import Text from "comps/Text";
import Markdown from "comps/Markdown";
import * as doc from "lib/doc";

const TypeSig: React.FC<any> = (m) => <span
	css={{
		color: "var(--color-fg3) !important",
	}}>{(() => {
	switch (m.kind) {
		case "StringKeyword": return "string";
		case "NumberKeyword": return "number";
		case "BooleanKeyword": return "boolean";
		case "VoidKeyword": return "void";
		case "AnyKeyword": return "any";
		case "NullKeyword": return "null";
		case "UnionType": return m.types.map((t: any, i: number) => <React.Fragment key={i}><TypeSig {...t} />{i === m.types.length - 1 ? "" : " | "}</React.Fragment>);
		case "LiteralType": return <TypeSig {...m.literal} />;
		case "StringLiteral": return `"${m.text}"`;
		case "ArrayType": return <><TypeSig {...m.elementType} />[]</>;
		case "ParenthesizedType": return <>(<TypeSig {...m.type} />)</>;
		case "FunctionType": return <>(<FuncParams {...m} />) {'=>'} <TypeSig {...m.type} /></>;
		case "TypeReference": return doc.data[m.typeName] ? <Link href={`/#${m.typeName}`}>{m.typeName}</Link> : m.typeName;
		default: return "unknown";
	}
})()}</span>;

const FuncParams: React.FC<any> = (m) => m.parameters.map((p: any, i: number) => (
	<span key={p.name}>
		{p.name}
		{p.questionToken ? "?" : ""}
		: {p.dotDotDotToken ? "..." : <TypeSig {...p.type} />}
		{i === m.parameters.length - 1 ? "" : ", "}
	</span>
));

const MethodSignature: React.FC<any> = (m) => (
	<Text
		code
		color={1}
		select
		size="big"
	>
		{m.name}(<FuncParams {...m} />)
	</Text>
);

const PropertySignature: React.FC<any> = (m) => (
	<Text code size="big">{m.name} {m.questionToken ? "?" : ""}: <TypeSig {...m.type} /></Text>
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
					<Text select color={2}>{doc.comment}</Text>
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

interface EntryProps {
	name: string,
}

const Entry: React.FC<ViewPropsAnd<EntryProps>> = ({
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

interface TypeProps {
	name: string,
}

const Type: React.FC<ViewPropsAnd<TypeProps>> = ({
	name,
	...args
}) => {
	return (
		<View></View>
	);
}

export {
	Entry,
	Type,
};
