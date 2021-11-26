import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination, Controller, Thumbs, Autoplay, Lazy } from "swiper";
import Link from "next/link";
import { formatUrlForImage } from "@src/helper/formatHelper";
SwiperCore.use([Navigation, Pagination, Controller, Thumbs, Autoplay, Lazy]);
const SwiperSlideImageItem = props => {
	const { item } = props;
	const [loadingImg, setLoadingImage] = useState(false);

	return (
		<Link href={`/post/${item._id}`}>
			<a className="block w-full h-full relative">
				<img onLoad={() => setLoadingImage(true)} onError={() => setLoadingImage(false)} className="object-cover block h-64 xs:h-[12rem] w-full" src={formatUrlForImage(item.ThumbImage)} data-src={formatUrlForImage(item.ThumbImage)} alt={item.Title} />
				{/* {!loadingImg && (
					<div className="absolute inset-0 opacity-10">
						<img src="/default-image.jpg" className="h-full w-full object-cover" alt="Loading image" />
					</div>
				)} */}
			</a>
		</Link>
	);
};
function SlidesShow(props) {
	const {
		data, //danh sách post
	} = props;

	const [thumbs, setThumbs] = useState(null);
	const [controller, setController] = useState(null);
	const [activeIndex, setActiveIndex] = useState(null);
	const slides = [
		{
			img: "https://lumen.thinkpro.vn//backend/uploads/banner/2021/6/17/Untitled%204.jpg",
			title: "Rung phím cơ, Quẩy hết cỡ",
			href: "/",
		},
		{
			img: "https://lumen.thinkpro.vn//backend/uploads/banner/2021/6/7/Untitled.jpg",
			title: "SURFACE KHUYẾN MÃI, NGẬP TRÀN ƯU ĐÃI! ",
			href: "/",
		},
		{
			img: "https://lumen.thinkpro.vn//backend/uploads/banner/2021/5/27/BannerWeb.jpg",
			title: "ĐẶT TRƯỚC LG, MÊ LY QUÀ KHỦNG!",
			href: "/",
		},
		{
			img: "https://lumen.thinkpro.vn//backend/uploads/banner/2021/6/15/Mua%20m%C3%A1y%20t%C3%ADnh%20h%E1%BB%8Dc%20t%E1%BB%AB%20xa.jpg",
			title: "Mua máy tính học từ xa- hiệu quả, lại nhiều quà!",
			href: "/",
		},
	];

	return (
		<div className="w-8/12 md:w-full sm:w-full xs:w-full rounded-lg border overflow-hidden shadow-md">
			<Swiper
				lazy={true}
				thumbs={{ swiper: thumbs }}
				controller={{ control: controller }}
				tag="section"
				wrapperTag="ul"
				// navigation
				// pagination
				onSwiper={setController}
				spaceBetween={0}
				slidesPerView={1}
				onInit={swiper => {
					setActiveIndex(swiper.activeIndex);
				}}
				// watchSlidesVisibility
				// watchSlidesProgress
				onSlideChange={swiper => {
					setActiveIndex(swiper.activeIndex);
				}}
				// onReachEnd={() => console.log("Swiper end reached")}
				// onProgress={(swiper, progress) => console.log(progress)}
				autoplay={{ delay: 4000 }}
				className="rounded-t-lg overflow-hidden">
				{data?.map((item, index) => (
					<SwiperSlide key={`slide-${index}`} tag="li" className="cursor-pointer">
						{/* <Link href={`/post/${item._id}`}>
							<a className="block w-full h-full">
								<img className="object-cover block h-64 xs:h-[12rem] w-full swiper-lazy" loading="eager" data-src={formatUrlImage(item.ThumbImage)} alt={item.Title} />
								<div className="swiper-lazy-preloader border-4 border-primary border-t-transparent"></div>
							</a>
						</Link> */}
						<SwiperSlideImageItem key={index} item={item} />
					</SwiperSlide>
				))}
			</Swiper>
			<Swiper onSwiper={setThumbs} slidesPerView={4} wrapperTag="div" className="xs:hidden xs:invisible">
				{data?.map((item, index) => (
					<SwiperSlide key={`slide-${index}`} tag="li" className={`cursor-pointer relative px-1 py-2 h-24 ${index == data.length - 1 ? "" : "border-r"} ${activeIndex === index ? "before:top-0 before:absolute before:left-0 before:w-0 before:h-2 before:bg-primary before:block before:animate-progressSwiperNews" : ""}`}>
						<div className="block w-full h-full">
							<span className="font-medium  h-full w-full inline-block max-w-full max-h-full overflow-hidden text-sm lg:text-sm sm:text-xs xs:text-[10px]">{item.Title}</span>
						</div>
					</SwiperSlide>
				))}
			</Swiper>
			{/* <ol className='flex divide-x flex-row flex-nowrap '>
				{[1, 2, 3, 4].map((item, index) => (
					<li
						key={index}
						className={`w-1/4 px-1 py-2 h-24 relative cursor-pointer ${activeIndex === index ? "before:top-0 before:absolute before:left-0 before:w-0 before:h-2 before:bg-primary before:block before:animate-progressSwiperNews" : ""}`}
						onClick={() => {
							controller.slideTo(index);
						}}
					>
						{item.toString()}
					</li>
				))}
			</ol> */}
		</div>
	);
}

export default SlidesShow;
