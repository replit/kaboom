import NextHead from "next/head";

interface HeadProps {
	title: string,
	scale?: number,
}

const Head: React.FC<HeadProps> = ({
	title,
	scale,
}) => (
	<NextHead>
		<title>{title}</title>
		<link rel="icon" href="/site/img/k.png" />
		<meta name="viewport" content={`initial-scale=${scale ?? 1.0}, user-scalable=no, width=device-width`} />
	</NextHead>
);

export default Head;
