import fs from "fs/promises";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Head from "comps/Head";
import GameView from "comps/GameView";
import Nav from "comps/Nav";
import Text from "comps/Text";
import Button from "comps/Button";
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
	ctx.res.write(`
<!DOCTYPE html>
<head>
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
