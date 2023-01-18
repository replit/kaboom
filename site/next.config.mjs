export default {
	reactStrictMode: true,
	swcMinify: true,
	compiler: {
		emotion: true,
	},
	headers: async () => [
		{ source: "/:path*", headers: [
			{ key: "Access-Control-Allow-Origin", value: "*" },
		] },
	],
	redirects: async () => [
		{ source: "/discord", destination: "https://discord.com/invite/aQ6RuQm3TF", permanent: false },
	],
}
