import React, { useState, useEffect, createRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// import SwiperCore, { Navigation, Pagination, Controller, Thumbs, Autoplay, Lazy } from "swiper";
import Link from "next/link";
import ButtonWhite from "@src/components/common/ButtonWhite";
import formatCurency from "@src/helper/FormatCurency";
import Image from "next/image";
import { serverApi, qualityImage } from "@src/config/constrant";
import Rated from "@src/components/common/Rated";
import "swiper/css";

import { ChevronRight, ChevronLeft, BagPlusFill } from "react-bootstrap-icons";

import Button from "./Button";
// SwiperCore.use([Navigation, Pagination, Controller, Thumbs, Autoplay, Lazy]);
import ButtonControlSwiper from "./ButtonControlSwiper";
import { AppContext } from "@src/context";
import { useContext } from "react";
import { useSnackbar } from "notistack";
import axios from "@src/config/axios";
import { getCookie } from "@src/helper/helpCookie";

function SwiperProduct(props) {
	const { products = [] } = props;

	const [controller, setController] = useState(null);
	const [activeIndex, setActiveIndex] = useState(null);
	const [isEnd, setIsEnd] = useState(null);
	let objLoaded = {};
	products.forEach((item, key) => {
		objLoaded[key] = false;
	});
	const [imgLoaded, setImageLoaded] = useState(objLoaded);
	const [hoverItem, setHoverItem] = useState(false);
	const { user, setUser } = useContext(AppContext);
	const { enqueueSnackbar } = useSnackbar();
	const handle_add_cart = async params => {
		try {
			const { Id_Product, ProductName, DisplayImage, Price, PriceSale, Path, RemainingAmount, BrandImage, BrandName } = params;
			const accessToken = getCookie("accessToken");
			if (accessToken == "") {
				return enqueueSnackbar("Bạn cần đăng nhập!", {
					variant: "error",
					preventDuplicate: true,
				});
			}
			const res = await axios.post(`/api/user/cart/add`, {
				Id_Product,
				accessToken,
			});
			if (res.status == 200) {
				enqueueSnackbar("Đã thêm vào giỏ hàng!", {
					variant: "success",
				});
				const currentCart = user.Cart;
				let positon_finded = -1;
				currentCart.forEach((cart, index) => {
					if (cart.Id_Product == Id_Product) {
						positon_finded = index;
						return false;
					}
				});
				if (positon_finded == -1) {
					// chưa có
					currentCart.unshift({
						Id_Product: Id_Product,
						ProductName: [ProductName],
						DisplayImage: [DisplayImage],
						Price: [Price],
						PriceSale: [PriceSale],
						Path: [Path],
						RemainingAmount: [RemainingAmount],
						Amount: res.data.Amount,
						BrandName: [[BrandName[0]]],
						BrandImage: [[BrandImage[0]]],
					});
					setUser({
						...user,
						Cart: currentCart,
					});
				} else {
					currentCart[positon_finded].Amount += 1;
					setUser({
						...user,
						Cart: currentCart,
					});
				}
			}
		} catch (err) {
			return enqueueSnackbar("Đã xảy ra lỗi!", {
				variant: "error",
			});
		}
	};

	return (
		<div className="w-100% relative my-12">
			<Swiper
				controller={{ control: controller }}
				tag="div"
				wrapperTag="div"
				onSwiper={setController}
				spaceBetween={0}
				slidesPerView={5}
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
				// autoplay={{ delay: 4000 }}
				breakpoints={{
					1200: {
						slidesPerView: 5,
						// spaceBetween: 20,
					},
					992: {
						slidesPerView: 4,
						// spaceBetween: 20,
					},
					768: {
						slidesPerView: 3,
						// spaceBetween: 20,
					},
					576: {
						slidesPerView: 2,
						// spaceBetween: 20,
					},
					300: {
						slidesPerView: 2,
						// spaceBetween: 20,
					},
				}}
				// 'vì slide overflow hidden nên ta phải set cho nó padding mà ring như dưới để hiển thị phần absolate'
				style={hoverItem ? { paddingBottom: "320px", marginBottom: "-320px" } : { paddingBottom: "0", marginBottom: "0" }}
				// className={`${!hoverItem ? "pb-[320px] mb-[-320px]" : "pb-0 mb-0"}`}
			>
				{products.map((item, key, arr) => {
					return (
						<SwiperSlide
							key={key}
							onMouseOver={e => {
								// vì true!== 0
								setHoverItem(key + 1);
							}}
							onMouseLeave={() => {
								setHoverItem(false);
							}}
							className={` w-full flex flex-col justify-between content-between transition-shadow hover:shadow-propductShadow xs:hover:shadow hover:z-[1] bg-white border-t border-l border-b ${key == arr.length - 1 ? "border-r" : ""}`}>
							<div className="p-2 h-full">
								<Link href={"/" + item.Path}>
									<a className="w-48 h-48 sm:w-40 sm:h-40 xs:w-36 xs:h-36 block mx-auto">
										<div className="relative w-full h-full select-none">
											<Image
												quality={qualityImage}
												objectFit="fill"
												loading="lazy"
												onLoad={() => {
													setImageLoaded({
														...imgLoaded,
														[key]: true,
													});
												}}
												className={`${imgLoaded[key] ? "" : "invisible hidden"}`}
												layout="fill"
												src={`${serverApi}/${item?.DisplayImage}`}
											/>
											{imgLoaded[key] == false && (
												// <div className={` absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 `}>
												// 	<span className='border-primary animate-spin border-4 rounded-full h-full w-full block border-r-transparent'></span>
												// </div>
												<Image quality={qualityImage} objectFit="cover" loading="eager" layout="fill" src={`/default-image.jpg`} />
											)}

											{/* <Image lazy='true' quality={qualityImage} layout='fill' src={`${serverApi}/${TuyChon?.DuongDanHinhAnh[0]}`} /> */}
										</div>
									</a>
								</Link>
								<div className="mt-2 w-full">
									{/* loading */}
									{!imgLoaded[key] && (
										<div className="w-full">
											<Link href={"/" + item.Path}>
												<a className="bg-gray-300 w-full h-8 block text-center overflow-hidden font-semibold text-sm md:text-base mb-1 md:mb-1 text-body-main leading-5 animate-pulse rounded-2xl"></a>
											</Link>
											<div className="h-12">
												<div className="flex items-center flex-wrap space-y-2">
													<span className="text-sm text-black leading-5 w-full h-4 animate-pulse bg-gray-300 rounded-2xl"></span>
													<span className="text-lg xl:text-lg text-red-400 w-full h-4 leading-7 font-semibold animate-pulse bg-gray-300 rounded-2xl"></span>
												</div>
												{/* <div className='text-sm line-through text-black leading-5 animate-pulse bg-gray-300 w-9/12 h-4  rounded-2xl mt-2'></div> */}
											</div>
										</div>
									)}
									<div className={`w-full ${!imgLoaded[key] ? "hidden invisible" : ""} `}>
										<Link href={"/" + item.Path}>
											<a className="w-full h-16 xs:h-20 block text-center overflow-hidden font-semibold text-sm md:text-base mb-1 md:mb-1 text-body-main leading-5">{item?.ProductName}</a>
										</Link>
										<div className="h-32">
											<div className="flex items-center space-x-1 mb-1">
												<span className="text-xs text-black xs:text-sm leading-5">Tình trạng :</span> <span className="text-sm leading-7 font-medium">{item.RemainingAmount > 0 ? "Còn hàng" : "Tạm hêt hàng"}</span>
											</div>
											{item.PriceSale && item.PriceSale > 0 ? (
												<>
													<div className="flex items-center space-x-1 mb-1">
														<span className="text-sm text-black leading-5">Giá :</span> <span className="text-lg xs:text-base text-red-400 leading-7 font-semibold">{formatCurency(item.PriceSale)}</span>
													</div>
													<div className="text-sm line-through text-black leading-5">{formatCurency(item.Price)}</div>
												</>
											) : (
												<>
													<div className="flex items-center space-x-1 mb-1">
														<span className="text-sm text-black leading-5">Giá :</span> <span className="text-lg xs:text-base text-red-400 leading-7 font-semibold">{formatCurency(item.Price)}</span>
													</div>
													{/* <div className='text-sm line-through text-black leading-5'></div> */}
												</>
											)}
											<div className="flex items-center">
												<span className="text-sm font-bold mr-2">{`${item.Star?.toFixed(1) || 0}`}</span> <Rated width="w-2/5" size="text-base" star={Math.ceil(item.Star)} />
											</div>
											<div className="flex items-center text-sm ">
												<span className="mr-1">{item.CountEvaluate}</span>

												<span>đánh giá</span>
											</div>
										</div>
									</div>
								</div>
							</div>
							{/* 'absolate hover và hiển thị' */}
							{/* không cho mua thêm giỏ hàng khi hết hàng */}
							<div className={`absolute z-10 left-0 right-0 top-full h-20 flex items-center bg-white shadow-propductShadow px-10 lg:px-4 md:px-5 sm:px-2 xs:px-1 rounded-b-lg xs:hover:shadow ${hoverItem == key + 1 && imgLoaded[key] ? "" : "hidden invisible"}`}>
								<Button disabled={item.RemainingAmount <= 0} onClick={() => handle_add_cart(item)} iconStart={<BagPlusFill />} title="Thêm giỏ hàng" rounded="rounded-none" />
							</div>
						</SwiperSlide>
					);
				})}
				<div className={`absolute left-1 z-10 top-40 xs:top-28  inline-block ${activeIndex == 0 ? "hidden invisible" : ""}`}>
					<ButtonControlSwiper
						icon={<ChevronLeft />}
						onClick={() => {
							controller.slidePrev();
						}}
					/>
				</div>
				<div className={`absolute right-1 z-10 top-40 xs:top-28 inline-block ${isEnd ? "hidden invisible" : ""}`}>
					<ButtonControlSwiper
						icon={<ChevronRight />}
						onClick={() => {
							controller.slideNext();
						}}
					/>
				</div>
			</Swiper>
		</div>
	);
}

export default SwiperProduct;
