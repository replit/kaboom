import * as React from "react";
import Link from "next/link";
import View, { ViewPropsAnd } from "comps/View";
import Text from "comps/Text";
import Markdown from "comps/Markdown";
// @ts-ignore
import doc from "doc.json";

const TypeSig: React.FC<EntryProps> = ({ data }) => (
	<span
		css={{
			color: "var(--color-fg3) !important",
		}}
	>
		{(() => {
			switch (data?.kind) {
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
				case "TypeReference": return (doc as any).types[data.typeName]
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
							Object.entries(data.members).map(([name, variants]: [string, any]) =>
								variants.map((mem: any) =>
									<Member key={mem.name} data={mem} />
								)
							)
						}
					</View>;
				case "IndexedAccessType":
					return <><TypeSig data={data.objectType} />[<TypeSig data={data.indexType} />]</>;
				default:
					return "unknown";
			}
		})()}
		{ data?.typeArguments &&
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

interface TagProps {
	name: string,
}

const Tag: React.FC<TagProps> = ({ name }) => (
	<View bg={2} pad={0.5} rounded>
		<Text
			code
			color={3}
			bold
			size="small"
		>
			{name}
		</Text>
	</View>
);

interface TitleProps {
	data: any,
	small?: boolean,
}

function isType(entry: any): boolean {
	return entry.kind === "TypeAliasDeclaration" || entry.kind === "InterfaceDeclaration";
}

const Title: React.FC<TitleProps> = ({ data, small, children }) => (
	<View gap={1} dir="row" align="center">
		{ isType(data) && <Tag name="type" /> }
		<Text
			code
			color={1}
			select
			size={small ? "normal" : "big"}
		>
			{data.name}{children}
		</Text>
	</View>
);

interface MemberProps {
	data: any,
	small?: boolean,
}

const MethodSignature: React.FC<MemberProps> = ({ data, small }) => (
	<View gap={1} stretchX>
		<Title data={data} small={small}>
			(<FuncParams data={data} />)
			{ data.type?.kind !== "VoidKeyword" && <>{" => "}<TypeSig data={data.type}/ ></> }
		</Title>
		<JSDoc data={data} />
	</View>
);

const PropertySignature: React.FC<MemberProps> = ({ data, small }) => (
	<View gap={1} stretchX>
		<Title data={data} small={small}>{data.questionToken ? "?" : ""}: <TypeSig data={data.type} /></Title>
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
		<Title data={data} />
		{(() => {
			switch (data.type.kind) {
				case "TypeLiteral":
					return Object.entries(data.type.members).map(([name, variants]: [string, any]) =>
						variants.map((mem: any) =>
							<Entry key={mem.name} data={mem} />
						)
					);
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
						<React.Fragment key={i}><TypeSig data={t} />{i === data.type.types.length - 1 ? "" : "&"}</React.Fragment>
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
				<Title data={data} />
				<JSDoc data={data} />
			</View>
			{ Object.entries(data.members).map(([name, variants]: [string, any], i) =>
				variants.map((mem: any, j: number) =>
					<Member key={`${mem.name}-${i}-${j}`} data={mem} />
				)
			) }
		</View>
	);
};

const Member: React.FC<MemberProps> = ({ data }) => {
	switch (data.kind) {
		case "MethodSignature":
			return <MethodSignature data={data} small />;
		case "PropertySignature":
			return <PropertySignature data={data} small />;
	}
	return <></>;
};

interface EntryProps {
	data: any,
}

const Entry: React.FC<EntryProps> = ({ data }) => {
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
	}
	return <></>;
};

const JSDoc: React.FC<EntryProps> = ({data}) => {
	return data.jsDoc ? (
		<View gap={1} stretchX>
			{ data.jsDoc.doc &&
				<Text select color={3}>{data.jsDoc.doc}</Text>
			}
			{ Object.entries(data.jsDoc.tags).map(([name, items]) => {
				return (items as string[]).map((content) => {
					switch (name) {
						case "section": return;
						case "example": return <Markdown padY={1} key={content} src={content} />;
						default: return (
							<View key={content} gap={1} dir="row">
								<Tag name={name} />
								<Text select color={3}>{content}</Text>
							</View>
						);
					}
				})
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

	const entries = (doc as any).types[name]
		|| (doc as any).types["KaboomCtx"][0].members[name];

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
