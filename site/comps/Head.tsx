import NextHead from "next/head";

interface TwitterPlayer {
	width: number,
	height: number,
	url: string,
}

interface HeadProps {
	title?: string,
	desc?: string,
	icon?: string,
	img?: string,
	scale?: number,
	twitterPlayer?: TwitterPlayer,
}

const DEF_TITLE = "Kaboom";
const DEF_DESC = "JavaScript game programming library that helps you make games fast and fun";
const DEF_ICON = "/site/img/k.png";
const DEF_IMG = "https://kaboomjs.com/site/img/k.png";

const Head: React.FC<HeadProps> = ({
	title,
	desc,
	icon,
	img,
	scale,
	twitterPlayer,
}) => (
	<NextHead>
		<title>{title ?? DEF_TITLE}</title>
		<link rel="icon" href={icon ?? DEF_ICON} />
		<meta name="description" content={desc ?? DEF_DESC} />
		<meta name="viewport" content={`initial-scale=${scale ?? 1.0}, user-scalable=no, width=device-width`} />
		<meta name="twitter:card" content={twitterPlayer ? "player" : "summary"} />
		<meta name="twitter:title" content={title ?? DEF_TITLE} />
		<meta name="twitter:description" content={desc ?? DEF_DESC} />
		<meta name="twitter:image" content={img ?? DEF_IMG} />
		<meta name="twitter:site" content="@kaboomjs" />
		{ twitterPlayer && <>
			<meta name="twitter:player" content={twitterPlayer.url} />
			<meta name="twitter:player:width" content={`${twitterPlayer.width}`} />
			<meta name="twitter:player:height" content={`${twitterPlayer.height}`} />
		</> }
	</NextHead>
);

export default Head;
