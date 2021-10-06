import * as React from "react";
import Link from "next/link";
import View, { ViewPropsAnd } from "comps/View";
import Text from "comps/Text";
import Markdown from "comps/Markdown";
import * as doc from "lib/doc";

const TypeSig: React.FC<EntryProps> = ({ data }) => <span
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
		case "StringLiteral": return `"${data.text}"`;
		case "LiteralType": return <TypeSig data={data.literal} />;
		case "ArrayType": return <><TypeSig data={data.elementType} />[]</>;
		case "ParenthesizedType": return <>(<TypeSig data={data.type} />)</>;
		case "FunctionType": return <>
			(<FuncParams data={data} />) {'=>'} <TypeSig data={data.type} />
		</>;
		case "UnionType": return data.types.map((t: any, i: number) => (
			<React.Fragment key={i}>
				<TypeSig data={t} />
				{i === data.types.length - 1 ? "" : " | "}
			</React.Fragment>
		));
		case "TypeReference": return doc.types[data.typeName]
			?
				<DocCtx.Consumer>
					{(ctx) => (
						<span
							css={{textDecoration: "underline", cursor: "pointer"}}
							onClick={() => ctx.typeref && ctx.typeref(data.typeName)}
						>
							{data.typeName}
						</span>
					)}
				</DocCtx.Consumer>
			: data.typeName;
		default: return "unknown";
	}
})()}</span>;

const FuncParams: React.FC<EntryProps> = ({ data }) => data.parameters.map((p: any, i: number) => (
	<span key={p.name}>
		{p.name}
		{p.questionToken ? "?" : ""}
		: {p.dotDotDotToken ? "..." : <TypeSig data={p.type} />}
		{i === data.parameters.length - 1 ? "" : ", "}
	</span>
));

const MethodSignature: React.FC<EntryProps> = ({ data }) => (
	<Text
		code
		color={1}
		select
		size="big"
	>
		{data.name}(<FuncParams data={data} />)
	</Text>
);

const PropertySignature: React.FC<EntryProps> = ({ data }) => (
	<Text code size="big">{data.name} {data.questionToken ? "?" : ""}: <TypeSig data={data.type} /></Text>
);

const FunctionDeclaration: React.FC<EntryProps> = ({ data }) => (
	<Text
		code
		color={1}
		select
		size="big"
	>
		{data.name}(<FuncParams data={data} />)
	</Text>
);

const TypeAliasDeclaration: React.FC<EntryProps> = ({ data }) => (
	<View gap={2}>
		<Text
			code
			color={1}
			select
			size="big"
		>
			{data.name}
		</Text>
		{(() => {
			switch (data.type.kind) {
		// 		case "TypeLiteral":
		// 			const memberList = type.members
		// 				.map(renderMember)
		// 				.map((entry) => "&nbsp;".repeat(4) + entry)
		// 				.join(t("br"));
		// 			return `{${t("br")}${memberList}${t("br")}}`;
				case "TypeReference":
				case "UnionType":
				case "StringKeyword":
				case "NumberKeyword":
				case "BooleanKeyword":
				case "VoidKeyword":
				case "AnyKeyword":
				case "NullKeyword":
				case "FunctionType":
					return <TypeSig data={data.type} />
				case "IntersectionType":
					return data.type.types.map((t: any) => (
						<><TypeSig data={t} />&</>
					));
				default:
					return <></>;
			}
		})()}
	</View>
);

const InterfaceDeclaration: React.FC<EntryProps> = ({ data }) => {
	return (
		<Text
			code
			color={1}
			select
			size="big"
		>
			{data.name}
		</Text>
	);
};

interface EntryProps {
	data: any,
}

const Entry: React.FC<EntryProps> = ({ data }) => {
	const doc = data.jsDoc?.[0];
	return (
		<View gap={1} stretchX>
			{(() => {
				switch (data.kind) {
					case "MethodSignature":
						return <MethodSignature data={data} />;
					case "PropertySignature":
						return <PropertySignature data={data} />;
					case "FunctionDeclaration":
						return <FunctionDeclaration data={data} />;
					case "TypeAliasDeclaration":
						return <TypeAliasDeclaration data={data} />;
					case "InterfaceDeclaration":
						return <InterfaceDeclaration data={data} />;
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

interface DocProps {
	name: string,
	typeref?: (name: string) => void,
}

const Doc: React.FC<ViewPropsAnd<DocProps>> = ({
	name,
	typeref,
	...args
}) => {
	const entries = doc.types[name];
	if (!entries) {
		return <Text color={3}>Entry not found: {name}</Text>;
	}
	return (
		<DocCtx.Provider value={{
			typeref: typeref,
		}}>
			<View stretchX {...args} gap={3}>
				{entries.map((e: any, i: number) => <Entry key={`${e.name}-${i}`} data={e} />)}
			</View>
		</DocCtx.Provider>
	);
};

interface DocCtx {
	typeref?: (name: string) => void,
}

const DocCtx = React.createContext<DocCtx>({
	typeref: () => {},
});

export default Doc;
