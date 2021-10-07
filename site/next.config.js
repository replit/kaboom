/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
	async redirects(data) {
		return [
			{ source: "/demo", destination: "/play", permanent: false },
			{ source: "/lib/:path*", destination: "/legacy/lib/:path*", permanent: false },
			{ source: "/pub/legacy/kbmsprite.js", destination: "/legacy/kbmsprite.js", permanent: false },
		]
	},
}
