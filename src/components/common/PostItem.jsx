import React from "react";
import Link from "next/link";
import { formatUrlForImage } from "@src/helper/formatHelper";
import formatDate from "@src/helper/FormatDate";
export default function PostItem(props) {
	const { data } = props;
	return (
		<div className="overflow-hidden shadow-sm border  bg-white rounded-lg">
			<Link href={`/post/${data._id}`}>
				<a>
					<img src={formatUrlForImage(data.ThumbImage)} className="object-cover w-full h-64 sm:h-52 rounded-lg" alt={data.Title} />
				</a>
			</Link>

			<div className="py-5 px-2">
				<p className="mb-2 text-xs font-semibold text-gray-600 uppercase">{formatDate(data.createdAt)}</p>
				<Link href={`/post/${data._id}`}>
					<a className="inline-block mb-3 text-black transition-colors duration-200 hover:text-deep-purple-accent-700">
						<p className="text-2xl font-bold leading-5">{data.Title}</p>
					</a>
				</Link>
			</div>
		</div>
	);
}
