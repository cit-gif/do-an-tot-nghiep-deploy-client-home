import axios from "@src/config/axios";
import ContainerPropduct from "@src/components/common/ContainerPropduct";
import TitleCate from "@src/components/common/TitleCate";
import { useContext } from "react";
import { AppContext } from "@src/context";
import { limit_product_in_search } from "@src/config/constrant";
import Pagination from "@src/components/common/Pagination";
import Head from "next/head";
function Search({ data }) {
	const products = data.data[0].Data;
	const MetaData = data.data[0].MetaData[0];
	const currentPage = data.currentPage;
	const query = data.query;
	if (products.length == 0) {
		return (
			<div className="container mx-auto">
				<Head>
					<title>Kết quả tìm kiếm: {query}</title>
				</Head>
				<div className="w-full my-60">
					<h2 className="flex items-center text-2xl justify-center flex-col">
						<span>Từ khóa tìm kiếm</span>
						<span className="font-semibold">" {query} "</span>
						<span>Không tìm thấy sản phẩm nào</span>
					</h2>
				</div>
			</div>
		);
	}
	return (
		<div className="container mx-auto">
			<Head>
				<title>Kết quả tìm kiếm: {query}</title>
			</Head>
			<div className="w-full my-8">
				<h1 className="font-medium text-gray-500 my-12 text-3xl">
					Tìm thấy <strong className="text-black font-semibold">{MetaData.CountProduct}</strong> kết quả với từ khóa <strong className="text-black font-semibold">"{query}"</strong>
				</h1>
				<div className="mb-12">
					<ContainerPropduct products={data.data[0].Data} />
				</div>
				<div className="w-full my-12 flex items-center justify-center">
					<Pagination url={`/tim-kiem?search=${query}&page=`} className="pagination-bar" currentPage={currentPage} totalCount={MetaData.CountProduct} pageSize={limit_product_in_search} />
				</div>
			</div>
		</div>
	);
}

const getData = async (query = "^", price = "asc", page, limit) => {
	const data = {};
	data.check = true;
	try {
		const res = await axios.get(`/api/public/search/${encodeURIComponent(query)}?price=${price}&page=${page}&limit=${limit}`, { headers: { "Content-Type": "application/json" } });
		data.data = res.data;
	} catch (error) {
		console.log(error);
		data.check = false;
	}
	return data;
};

export const getServerSideProps = async ctx => {
	const query = ctx.query.search || "";
	const price = ctx.query.price;

	const page = ctx.query.page || 1;

	// const ur
	//nếu không nhập gì thì tìm tất cả
	let sort = "asc";
	if (price == "desc") {
		sort = "desc";
	}
	let data;
	if (!query || query == "") {
		data = await getData("^", sort, page, limit_product_in_search);
	} else {
		data = await getData(query, sort, page, limit_product_in_search);
	}

	if (!data.check) {
		return {
			redirect: {
				destination: "/404",
				permanent: false,
			},
		};
	}
	data.query = query;
	data.currentPage = parseInt(page);

	return {
		props: {
			data: data,
		},
	};
};

export default Search;
