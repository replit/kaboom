import NextHead from "next/head"

interface HeadProps {
	title?: string,
	desc?: string,
	icon?: string,
	img?: string,
	scale?: number,
}

const DEF_TITLE = "Kaboom"
const DEF_DESC = "JavaScript game programming library that helps you make games fast and fun"
const DEF_ICON = "/site/img/k.png"
const DEF_IMG = "https://kaboomjs.com/site/img/k.png"

const Head: React.FC<HeadProps> = ({
	title,
	desc,
	icon,
	img,
	scale,
}) => (
	<NextHead>
		<title>{title ?? DEF_TITLE}</title>
		<link rel="icon" href={icon ?? DEF_ICON} />
		<meta name="description" content={desc ?? DEF_DESC} />
		<meta name="viewport" content={`initial-scale=${scale ?? 1.0}, user-scalable=no, width=device-width`} />
		<meta name="twitter:card" content="summary" />
		<meta name="twitter:title" content={title ?? DEF_TITLE} />
		<meta name="twitter:description" content={desc ?? DEF_DESC} />
		<meta name="twitter:image" content={img ?? DEF_IMG} />
		<meta name="twitter:site" content="@kaboomjs" />
		<script defer data-domain="kaboomjs.com" src="https://plausible.io/js/plausible.js" />
	</NextHead>
)

export default Head
