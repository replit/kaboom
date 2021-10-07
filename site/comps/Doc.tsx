import * as React from "react";
import Link from "next/link";
import View, { ViewPropsAnd } from "comps/View";
import Text from "comps/Text";
import Markdown from "comps/Markdown";
import * as doc from "lib/doc";

const TypeSig: React.FC<EntryProps> = ({ data }) => (
	<span
		css={{
			color: "var(--color-fg3) !important",
		}}
	>
		{(() => {
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
				case "TypeLiteral":
					return <View gap={2} stretchX>
						{
							data.members.map((mem: any) => <Member key={mem.name} data={mem} />)
						}
					</View>;
				default:
					return "unknown";
			}
		})()}
		{ data.typeArguments &&
			<span>
				{"<"}{data.typeArguments.map((arg: any, i: number) => (
					<React.Fragment key={arg.typeName + i}>
						<TypeSig data={arg} />
						{ i === data.typeArguments.length - 1 ? "" : ", " }
					</React.Fragment>
				))}{">"}
			</span>
		}
	</span>
);

const FuncParams: React.FC<EntryProps> = ({ data }) => data.parameters.map((p: any, i: number) => (
	<span key={p.name}>
		{p.name}
		{p.questionToken ? "?" : ""}
		: {p.dotDotDotToken ? "..." : <TypeSig data={p.type} />}
		{i === data.parameters.length - 1 ? "" : ", "}
	</span>
));

interface MemberProps {
	data: any,
	big?: boolean,
}

const MethodSignature: React.FC<MemberProps> = ({ data, big }) => (
	<View gap={1} stretchX>
		<Text
			code
			color={1}
			select
			size={big ? "big" : "normal"}
		>
			{data.name}(<FuncParams data={data} />)
			{ data.type?.kind !== "VoidKeyword" && <>{" => "}<TypeSig data={data.type}/ ></> }
		</Text>
		<JSDoc data={data} />
	</View>
);

const PropertySignature: React.FC<MemberProps> = ({ data, big }) => (
	<View gap={1} stretchX>
		<Text code size={big ? "big" : "normal"}>{data.name}{data.questionToken ? "?" : ""}: <TypeSig data={data.type} /></Text>
		<JSDoc data={data} />
	</View>
);

const FunctionDeclaration: React.FC<EntryProps> = ({ data }) => (
	<View gap={1} stretchX>
		<Text
			code
			color={1}
			select
			size="big"
		>
			{data.name}(<FuncParams data={data} />)
		</Text>
		<JSDoc data={data} />
	</View>
);

const TypeAliasDeclaration: React.FC<EntryProps> = ({ data }) => (
	<View gap={1} stretchX>
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
				case "TypeLiteral":
					return data.type.members.map((mem: any) => <Entry key={mem.name} data={mem} />)
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
					return data.type.types.map((t: any, i: number) => (
						<><TypeSig data={t} />{i === data.type.types.length - 1 ? "" : "&"}</>
					));
				default:
					return <></>;
			}
			<JSDoc data={data} />
		})()}
	</View>
);

const InterfaceDeclaration: React.FC<EntryProps> = ({ data }) => {
	return (
		<View gap={2} stretchX>
			<View gap={1} stretchX>
				<Text
					code
					color={1}
					select
					size="big"
				>
					{data.name}
				</Text>
				<JSDoc data={data} />
			</View>
			{data.members.map((mem: any) => <Member key={mem.name} data={mem} />)}
		</View>
	);
};

const Member: React.FC<MemberProps> = ({ data }) => {
	switch (data.kind) {
		case "MethodSignature":
			return <MethodSignature data={data} />;
		case "PropertySignature":
			return <PropertySignature data={data} />;
	}
	return <></>;
};

interface EntryProps {
	data: any,
}

const Entry: React.FC<EntryProps> = ({ data }) => {
	switch (data.kind) {
		case "MethodSignature":
			return <MethodSignature data={data} big />;
		case "PropertySignature":
			return <PropertySignature data={data} big />;
		case "FunctionDeclaration":
			return <FunctionDeclaration data={data} />;
		case "TypeAliasDeclaration":
			return <TypeAliasDeclaration data={data} />;
		case "InterfaceDeclaration":
			return <InterfaceDeclaration data={data} />;
	}
	return <></>;
};

const JSDoc: React.FC<EntryProps> = ({data}) => {
	const doc = data.jsDoc?.[0];
	return doc ? (
		<View gap={2} stretchX>
			<Text select color={3}>{doc.comment}</Text>
			{ (doc.tags ?? []).map((tag: any) => {
				switch (tag.tagName) {
					case "example": return <Markdown key={tag.comment} src={tag.comment} />;
					default: return null;
				}
			}) }
		</View>
	) : <></>;
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
