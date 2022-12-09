export default {
	reactStrictMode: true,
	swcMinify: true,
	headers: async () => [
		{ source: "/:path*", headers: [
			{ key: "Access-Control-Allow-Origin", value: "*" },
		] },
	],
	redirects: async () => [
		{ source: "/discord", destination: "https://discord.com/invite/aQ6RuQm3TF", permanent: false },
	],
}
