import React from "react";
import axios from "@src/config/axios";
import QuillHtmlToJsx from "@src/components/ProducLink/QuillHtmlToJsx";
export default function PostDetails(props) {
	const { data } = props;

	return (
		<div className="max-w-3xl mx-auto my-12">
			<h2 className="text-3xl font-medium mb-4">{data.Title}</h2>

			<div>
				<QuillHtmlToJsx html={data?.Content?.html || ""} />
			</div>
		</div>
	);
}
const getData = async _idPost => {
	const countProductHome = 10;
	const maxResultsPost = 10;

	const data = {};
	data.check = true;
	try {
		console.log("/api/getDetailsPost/" + _idPost);
		const res = await axios.get("/api/getDetailsPost/" + _idPost, {
			headers: { "Content-Type": "application/json" },
		});
		data.data = res.data;
	} catch (error) {
		data.check = false;
	}
	return data;
};
export const getServerSideProps = async ctx => {
	const _idPost = ctx?.params?.id;

	const data = await getData(_idPost);
	if (!data.check) {
		if (data?.notFoundError) {
			return {
				redirect: {
					destination: "/404",
					permanent: false,
				},
			};
		}
		return {
			redirect: {
				destination: "/500",
				permanent: false,
			},
		};
	}
	return {
		props: {
			data: data.data,
		},
	};
};
