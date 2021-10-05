import NextHead from "next/head";

interface HeadProps {
	title: string,
}

const Head: React.FC<HeadProps> = ({
	title,
}) => (
	<NextHead>
		<title>{title}</title>
		<link rel="icon" href="/site/img/k.png" />
		<meta name="viewport" content="initial-scale=1.0, width=device-width" />
	</NextHead>
);

export default Head;
