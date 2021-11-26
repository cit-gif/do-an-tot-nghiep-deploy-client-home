import React, { useState, useEffect, createRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Controller, Thumbs, Autoplay } from "swiper";
import Link from "next/link";
import ButtonWhite from "@src/components/common/ButtonWhite";
import "swiper/css";

import Image from "next/image";
import { ChevronRight, ChevronLeft, BagPlusFill } from "react-bootstrap-icons";
import { serverApi, qualityImage } from "@src/config/constrant";
import Button from "./Button";
import ButtonControlSwiper from "./ButtonControlSwiper";
SwiperCore.use([Controller, Thumbs, Autoplay]);

function SwiperProductImage(props) {
	const { images } = props;
	const [controller, setController] = useState(null);
	const [activeIndex, setActiveIndex] = useState(null);
	const [isEnd, setIsEnd] = useState(null);
	//thumbs
	const [thumbsSwiper, setThumbsSwiper] = useState(null);
	const [controllerThumb, setControllerThumb] = useState(null);
	const [activeIndexThumb, setActiveIndexThumb] = useState(null);
	const [isEndThumb, setIsEndThumb] = useState(null);

	const objLoaded = {};
	images.forEach((item, key) => {
		objLoaded[key] = false;
	});
	const length = images.length;
	const [imgLoaded, setImageLoaded] = useState(objLoaded);
	// if (images.length == 0) {
	// 	return "";
	// }
	return (
		<div className="w-full">
			<div className="w-full relative xs:my-8">
				<Swiper
					controller={{ control: controller }}
					tag="div"
					wrapperTag="div"
					onSwiper={setController}
					spaceBetween={0}
					slidesPerView={1}
					onInit={swiper => {
						setActiveIndex(swiper.activeIndex);
					}}
					onSlideChange={swiper => {
						setActiveIndex(swiper.activeIndex);
						setIsEnd(swiper.isEnd);
					}}
					onReachBeginning={() => {
						setIsEnd(false);
					}}
					onReachEnd={() => {
						setIsEnd(true);
					}}
					thumbs={{ swiper: thumbsSwiper }}
					autoplay={{ delay: 4000 }}
					// 'vì slide overflow hidden nên ta phải set cho nó padding mà ring như dưới để hiển thị phần absolate'
					// className={`${!hoverItem ? "pb-[320px] mb-[-320px]" : "pb-0 mb-0"}`}
				>
					{images.map((itemSrc, key, arr) => {
						return (
							<SwiperSlide key={key} className={`w-full p-1 bg-white cursor-[grab]`}>
								{/* tỉ lệ ảnh 1.5 w/h */}
								<div className="relative mx-auto select-none w-full h-[22rem] xs:w-full xs:h-[16rem]">
									<Image
										quality={qualityImage}
										objectFit="cover"
										lazy="true"
										onLoad={() => {
											setImageLoaded({
												...imgLoaded,
												[key]: true,
											});
										}}
										className={`${imgLoaded[key] ? "" : "invisible hidden"}`}
										layout="fill"
										src={`${serverApi}${itemSrc}`}
									/>
									{imgLoaded[key] == false && (
										// <div className={` absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 `}>
										// 	<span className='border-primary animate-spin border-4 rounded-full h-full w-full block border-r-transparent'></span>
										// </div>
										<Image quality={qualityImage} objectFit="contain" loading="eager" layout="fill" src={`/default-image.jpg`} />
									)}

									{/* <Image lazy='true' quality={qualityImage} layout='fill' src={`${serverApi}/${TuyChon?.DuongDanHinhAnh[0]}`} /> */}
								</div>
							</SwiperSlide>
						);
					})}

					<div className={`absolute left-1 z-10 top-1/2 -translate-y-1/2  inline-block ${activeIndex == 0 || length == 0 ? "hidden invisible" : ""}`}>
						<ButtonControlSwiper
							icon={<ChevronLeft />}
							onClick={() => {
								controller.slidePrev();
							}}
						/>
					</div>
					<div className={`absolute right-1 z-10 top-1/2 -translate-y-1/2  inline-block ${isEnd || length == 0 ? "hidden invisible" : ""}`}>
						<ButtonControlSwiper
							icon={<ChevronRight />}
							onClick={() => {
								controller.slideNext();
							}}
						/>
					</div>

					<div className="w-full  py-2 text-center font-medium">
						<span className={`${length == 0 ? "hidden invisible" : ""}`}>
							{activeIndex + 1}/{images.length}
						</span>
					</div>
				</Swiper>
			</div>

			<div className="w-full relative">
				<Swiper
					spaceBetween={20}
					slidesPerView={5}
					onSwiper={setThumbsSwiper}
					onSlideChange={swiper => {
						// setActiveIndex(swiper.activeIndex);
						setIsEndThumb(swiper.isEnd);
					}}
					onReachBeginning={() => {
						setIsEndThumb(false);
					}}
					onReachEnd={() => {
						setIsEndThumb(true);
					}}
					breakpoints={{
						1200: {
							slidesPerView: 5,
							spaceBetween: 20,
						},
						992: {
							slidesPerView: 5,
							spaceBetween: 20,
						},
						768: {
							slidesPerView: 5,
							spaceBetween: 20,
						},
						576: {
							slidesPerView: 4,
							spaceBetween: 8,
						},
						300: {
							slidesPerView: 4,
							spaceBetween: 5,
						},
					}}>
					{images.map((itemSrc, key, arr) => {
						return (
							<SwiperSlide key={key} className={`w-full p-1 bg-white rounded ${activeIndex == key ? "border-2 border-primary" : ""}`}>
								{/* tỉ lệ ảnh 1.5 w/h */}
								<div className="relative mx-auto select-none w-full h-[66px] xs:w-full xs:h-[46px]">
									<Image
										quality={qualityImage}
										objectFit="cover"
										lazy="true"
										onLoad={() => {
											setImageLoaded({
												...imgLoaded,
												[key]: true,
											});
										}}
										className={`${imgLoaded[key] ? "" : "invisible hidden"}`}
										layout="fill"
										src={`${serverApi}${itemSrc}`}
									/>
									{imgLoaded[key] == false && (
										// <div className={` absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 `}>
										// 	<span className='border-primary animate-spin border-4 rounded-full h-full w-full block border-r-transparent'></span>
										// </div>
										<Image quality={qualityImage} objectFit="contain" loading="eager" layout="fill" src={`/default-image.jpg`} />
									)}
									{/* <Image
										quality={15}
										objectFit='fill'
										lazy='true'
										onLoad={() => {
											setImageLoaded({
												...imgLoaded,
												[key]: true,
											});
										}}
										className={`${imgLoaded[key] ? "" : "invisible hidden"}`}
										layout='fill'
										src={`${serverApi}${itemSrc}`}
									/>
									{imgLoaded[key] == false && (
										// <div className={` absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 `}>
										// 	<span className='border-primary animate-spin border-4 rounded-full h-full w-full block border-r-transparent'></span>
										// </div>
										<Image quality={40} objectFit='contain' loading='eager' layout='fill' src={`/default-image.jpg`} />
									)} */}

									{/* <Image lazy='true' quality={qualityImage} layout='fill' src={`${serverApi}/${TuyChon?.DuongDanHinhAnh[0]}`} /> */}
								</div>
							</SwiperSlide>
						);
					})}
				</Swiper>

				<div className={`absolute left-1 z-10 top-1/2 -translate-y-1/2  inline-block ${activeIndex == 0 || length == 0 ? "hidden invisible" : ""}`}>
					<ButtonControlSwiper
						icon={<ChevronLeft />}
						onClick={() => {
							controller.slidePrev();
						}}
					/>
				</div>
				<div className={`absolute right-1 z-10 top-1/2 -translate-y-1/2  inline-block ${isEnd || length == 0 ? "hidden invisible" : ""}`}>
					<ButtonControlSwiper
						icon={<ChevronRight />}
						onClick={() => {
							controller.slideNext();
						}}
					/>
				</div>
			</div>
		</div>
	);
}

export default SwiperProductImage;
