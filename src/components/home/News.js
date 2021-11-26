import React from "react";
import Link from "next/link";
function News(props) {
	const { data } = props;
	return (
		<div
			className="w-4/12 md:w-full sm:w-full xs:w-full pl-2 md:pl-0 sm:pl-0 xs:pl-0 md:mt-2
             sm:mt-2 xs:mt-2">
			{data?.map((newsItem, id) =>
				id == 0 ? (
					<h3 key={id} className="overflow-hidden mb-2 word-wrap-global h-[7rem] w-full  md:max-h-[5rem] sm:max-h-[5rem] xs:max-h-[5rem] xs:text-sm rounded-tl-2xl rounded-tr-lg relative bg-secondaryDark text-white before:absolute before:h-2 before:w-full before:bg-primary before:bottom-0 before:left-0 after:absolute after:top-0 after:bottom-0 after:bg-primary after:w-2 after:left-0">
						<Link href={`/post/${newsItem._id}`}>
							<a title={newsItem.Title} className="h-full w-full block p-4">
								{newsItem.Title}
							</a>
						</Link>
					</h3>
				) : (
					<h3 key={id} className={`overflow-hidden rounded-lg bg-gray-300 ${id == data.length - 1 ? "" : "mb-2"} h-[7rem] w-full  md:max-h-[5rem] sm:max-h-[4rem] xs:max-h-[4rem] xs:text-sm`}>
						<Link href={`/post/${newsItem._id}`}>
							<a title={newsItem.Title} className="h-full w-full block p-4 active:bg-secondaryDark active:text-white">
								{newsItem.Title}
							</a>
						</Link>
					</h3>
				)
			)}
			<Link href="/post">
				<a className="mt-2 block text-2xl text-secondaryDark font-medium hover:underline">Tất cả bài viết</a>
			</Link>
		</div>
	);
}

export default News;
