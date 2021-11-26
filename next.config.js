const { PAGE_URL } = process.env;
const { hostApi } = require("./src/config/constrant");
const path = require("path");
module.exports = {
	images: {
		domains: [hostApi],
	},
	// sassOptions: {
	// 	includePaths: [path.join(__dirname, "styles")],
	// },

	async rewrites() {
		return [
			// {
			// 	source: "/:path*",
			// 	destination: `/:path*`,
			// },
			// {
			// 	source: "/admin",
			// 	destination: `${PAGE_URL}/admin`,
			// },
			// {
			// 	source: "/admin/:path*",
			// 	destination: `${PAGE_URL}/admin/:path*`,
			// },
			// {
			// 	source: "/api/:slug*",
			// 	destination: "http://localhost:5000/api/:slug*",
			// },
		];
	},
};
