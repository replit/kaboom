import * as React from "react";
import Link from "next/link";
import View, { ViewPropsAnd } from "comps/View";
import Text from "comps/Text";
import Markdown from "comps/Markdown";
import * as doc from "lib/doc";

const TypeSig: React.FC<any> = ({ typeref, data }) => <span
	css={{
		color: "var(--color-fg3) !important",
	}}>{(() => {
	switch (data.kind) {
		case "StringKeyword": return "string";
		case "NumberKeyword": return "number";
		case "BooleanKeyword": return "boolean";
		case "VoidKeyword": return "void";
		case "AnyKeyword": return "any";
		case "NullKeyword": return "null";
		case "UnionType": return data.types.map((t: any, i: number) => <React.Fragment key={i}><TypeSig data={t} />{i === data.types.length - 1 ? "" : " | "}</React.Fragment>);
		case "LiteralType": return <TypeSig data={data.literal} />;
		case "StringLiteral": return `"${data.text}"`;
		case "ArrayType": return <><TypeSig data={data.elementType} />[]</>;
		case "ParenthesizedType": return <>(<TypeSig data={data.type} />)</>;
		case "FunctionType": return <>(<FuncParams data={data} />) {'=>'} <TypeSig data={data.type} /></>;
		case "TypeReference": return doc.data[data.typeName]
			?
				<span
					css={{textDecoration: "underline", cursor: "pointer"}}
					onClick={() => typeref && typeref(data.typeName)}
				>
					{data.typeName}
				</span>
			: data.typeName;
		default: return "unknown";
	}
})()}</span>;

const FuncParams: React.FC<any> = ({ typeref, data }) => data.parameters.map((p: any, i: number) => (
	<span key={p.name}>
		{p.name}
		{p.questionToken ? "?" : ""}
		: {p.dotDotDotToken ? "..." : <TypeSig data={p.type} typeref={typeref} />}
		{i === data.parameters.length - 1 ? "" : ", "}
	</span>
));

const MethodSignature: React.FC<any> = ({ typeref, data }) => (
	<Text
		code
		color={1}
		select
		size="big"
	>
		{data.name}(<FuncParams data={data} typeref={typeref} />)
	</Text>
);

const PropertySignature: React.FC<any> = ({ typeref, data }) => (
	<Text code size="big">{data.name} {data.questionToken ? "?" : ""}: <TypeSig data={data.type} typeref={typeref} /></Text>
);

const FunctionDeclaration: React.FC<any> = ({ typeref, data }) => (
	<Text
		code
		color={1}
		select
		size="big"
	>
		{data.name}(<FuncParams data={data} typeref={typeref} />)
	</Text>
);

const Member: React.FC<any> = ({ typeref, data }) => {
	const doc = data.jsDoc?.[0];
	return (
		<View gap={1} stretchX>
			{(() => {
				switch (data.kind) {
					case "MethodSignature":
						return <MethodSignature typeref={typeref} data={data} />;
					case "PropertySignature":
						return <PropertySignature typeref={typeref} data={data} />;
					case "FunctionDeclaration":
						return <FunctionDeclaration typeref={typeref} data={data} />;
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
	typeref: (name: string) => void,
}

const Entry: React.FC<ViewPropsAnd<EntryProps>> = ({
	name,
	typeref,
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
			{entries.map((e: any, i: number) => <Member key={i} typeref={typeref} data={e} />)}
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
