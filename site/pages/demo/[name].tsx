import fs from "fs/promises";
import { GetServerSideProps } from "next";
import { capitalize } from "lib/str";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const { name } = ctx.query;
	const path = `public/site/demo/${name}.js`;
	let code = "";
	try {
		code = await fs.readFile(path, "utf8");
	} catch (e) {
		return {
			notFound: true,
		};
	}
	ctx.res.setHeader('Content-type', 'text/html')
	const title = `Kaboom Demo - ${capitalize(name as string)}`;
	ctx.res.write(`
<!DOCTYPE html>
<head>
	<title>${title}</title>
	<link rel="icon" href="/site/img/k.png" />
	<meta name="twitter:card" content="player" />
	<meta name="twitter:title" content="${title}" />
	<meta name="twitter:site" content="@kaboomjs" />
	<meta name="twitter:player" content="https://kaboomjs.com/demo/${name}" />
	<meta name="twitter:player:width" content="480" />
	<meta name="twitter:player:height" content="480" />
	<style>
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}
		body,
		html {
			width: 100%;
			height: 100%;
		}
	</style>
</head>
<body>
	<script src="/dist/kaboom.js"></script>
	<script>
${code}
	</script>
</body>
	`);
	ctx.res.end();
	return {props: {}};
}

const EmptyPage: React.FC = () => <></>;
export default EmptyPage;
