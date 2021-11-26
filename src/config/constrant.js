const serverApi = process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:3000";
const hostApi = process.env.NEXT_PUBLIC_HOST || "localhost:3000";
const qualityImage = 100;
const limit_evaluate_in_product_details = 5;
const limit_comment_in_product_details = 2;
const limit_product_in_search = 15;

module.exports = {
	serverApi,
	hostApi,
	qualityImage,
	limit_evaluate_in_product_details,
	limit_comment_in_product_details,
	limit_product_in_search,
};
