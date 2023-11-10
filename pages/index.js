import { useState } from "react";
import Link from "next/link";
import ManipulatingSwiper from "@src/components/home/SlidesShow";
import ContainerPropduct from "@src/components/common/ContainerPropduct";
import News from "@src/components/home/News";
import FeaturedPhone from "@src/components/home/FeaturedPhone";
import axios from "@src/config/axios";
import TitleCate from "@src/components/common/TitleCate";
import { limit_product_in_search } from "@src/config/constrant";
import ViewedProducts from "@src/components/common/ViewedProducts";
import Head from "next/head";
export default function Home({ data }) {
	const { check, bestsellingPhone, newestPhone, newestTablet, newestPost } = data;
	// chia bài viết mới thành 2 danh sách
	// 3 tin đầu tiên là của cột bên phải
	const newestPostSlice = newestPost?.[0]?.data?.reduce(
		(prev, current, index) => {
			if (index < 3) {
				prev[0].push(current);
			} else {
				prev[1].push(current);
			}
			return prev;
		},
		[[], []]
	);
	if (check) {
		return (
			<div className="container my-12 mx-auto">
				<Head>
					<title>Shop điện tử PhoneX</title>
				</Head>
				<div className="flex flex-wrap">
					<ManipulatingSwiper data={newestPostSlice[1] || []} />
					<News data={newestPostSlice[0] || []} />
				</div>
				<FeaturedPhone products={bestsellingPhone} />
				<div className="w-full my-3">
					<TitleCate title="Điện thoại mới nhất" />

					<div className="mb-8 flex justify-between flex-wrap  items-center">
						<span className="text-base font-semibold">Khoảng giá</span>
						<div className="ml-2  my-2 flex flex-wrap items-center divide-x-2  sm:w-full xs:w-full">
							{[
								{ title: "1 triệu đến 5 triệu", href: `/dien-thoai?types=phone&prices=1000000-5000000&limit=${limit_product_in_search}&page=1` },
								{ title: "5 triệu đến 10 triệu", href: `/dien-thoai?types=phone&prices=5000000-10000000&limit=${limit_product_in_search}&page=1` },
								{ title: "10 triệu đến 15 triệu", href: `/dien-thoai?types=phone&prices=10000000-15000000&limit=${limit_product_in_search}&page=1` },
							].map((item, key) => (
								<Link href={item.href} key={key}>
									<a className="mr-2 bg-gray-300 text-base font-semibold transition-all hover:bg-primary hover:text-white hover:shadow-nextShadow px-3 py-2 rounded-2xl sm:text-sm xs:text-sm">{item.title}</a>
								</Link>
							))}
						</div>
					</div>
					<ContainerPropduct products={newestPhone} />
				</div>

				<div className="w-full my-3">
					<TitleCate title="Tablet mới nhất" />
					<div className="mb-8 flex justify-between flex-wrap  items-center">
						<span className="text-base font-semibold">Khoảng giá</span>
						<div className="ml-2  my-2 flex flex-wrap items-center divide-x-2  sm:w-full xs:w-full">
							{[
								{ title: "1 triệu đến 5 triệu", href: `/tablet?types=tablet&prices=1000000-5000000&limit=${limit_product_in_search}&page=1` },
								{ title: "5 triệu đến 10 triệu", href: `/tablet?types=tablet&prices=5000000-10000000&limit=${limit_product_in_search}&page=1` },
								{ title: "10 triệu đến 15 triệu", href: `/tablet?types=tablet&prices=10000000-15000000&limit=${limit_product_in_search}&page=1` },
							].map((item, key) => (
								<Link href={item.href} key={key}>
									<a className="mr-2 bg-gray-300 text-base font-semibold transition-all hover:bg-primary hover:text-white hover:shadow-nextShadow px-3 py-2 rounded-2xl sm:text-sm xs:text-sm">{item.title}</a>
								</Link>
							))}
						</div>
					</div>
					<ContainerPropduct products={newestTablet} />
				</div>
				{/* sản phẩm đã xem */}
				<ViewedProducts />
			</div>
		);
	}
	return "";
}

const getData = async () => {
	const countProductHome = 10;
	const maxResultsPost = 10;

	const urls = [
		{
			id: "newestPost",
			link: "/api/getPost?limit=" + maxResultsPost,
		},
		{
			id: "bestsellingPhone",
			link: `/api/public/products/bestsellingphone/${countProductHome}`,
		},
		{
			id: "newestPhone",
			link: `/api/public/products/newestphone/${countProductHome}`,
		},
		{
			id: "newestTablet",
			link: `/api/public/products/newesttablet/${countProductHome}`,
		},
	];
	const data = {};
	data.check = true;
	let index = 0;
	let urlsLength = urls.length;
	for (index; index < urlsLength; index++) {
		try {
			const res = await axios.get(urls[index].link, {
				headers: { "Content-Type": "application/json" },
			});
			data[urls[index].id] = res.data;
		} catch (error) {
			console.log("error: ", error);
			data.check = false;
		}
	}
	return data;
};
export const getServerSideProps = async ctx => {
	const data = await getData();
	return {
		props: {
			data,
		},
	};
};
