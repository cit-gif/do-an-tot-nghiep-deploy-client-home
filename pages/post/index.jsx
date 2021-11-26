import React from "react";
import axios from "@src/config/axios";
import PostItem from "@src/components/common/PostItem";
import Pagination from "@src/components/common/Pagination";
export default function Post(props) {
	const { data } = props;

	return (
		<div className="max-w-6xl mx-auto my-8 px-2 sm:px-1">
			<h2 className="my-4 block text-2xl font-medium">Bài viết gần đây - Trang {data?.metaData[0]?.page}</h2>
			<div className="grid grid-cols-3 2xl:grid-cols-3 xl:grid-cols-3 lg:grid-cols-2 sm:grid-cols-2 xs:grid-cols-2 gap-8 xs:gap-4">
				{data?.data?.map((item, key) => {
					return <PostItem key={key} data={item} />;
				})}
			</div>
			<Pagination totalCount={data?.metaData[0]?.total || 1} pageSize={data?.metaData[0]?.limit || 1} currentPage={data?.metaData[0]?.page} url={"/post?page="} />
		</div>
	);
}
const getData = async (currentPage = 1) => {
	const maxResultsPost = 12;

	const data = {};
	data.check = true;
	try {
		const res = await axios.get(`/api/getPost?page=${currentPage}&limit=${maxResultsPost}`, {
			headers: { "Content-Type": "application/json" },
		});
		data.data = res.data;
	} catch (error) {
		console.log(error);
		console.log(error?.response?.data);
		data.check = false;
	}
	return data;
};
export const getServerSideProps = async ctx => {
	const currentPage = ctx?.query?.page || 1;
	const data = await getData(currentPage);
	if (!data.check) {
		return {
			redirect: {
				destination: "/500",
				permanent: false,
			},
		};
	}
	return {
		props: {
			data: data.data[0],
		},
	};
};
