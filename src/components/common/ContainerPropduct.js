import { useState } from "react";
import formatCurency from "@src/helper/FormatCurency";
import Image from "next/image";
import { serverApi, qualityImage } from "@src/config/constrant";
import Link from "next/link";
import Rated from "@src/components/common/Rated";
import { BagPlusFill } from "react-bootstrap-icons";
import Button from "@src/components/common/Button";
import { AppContext } from "@src/context";
import { useContext } from "react";
import { useSnackbar } from "notistack";
import { getCookie } from "@src/helper/helpCookie";
import axios from "@src/config/axios";
function ContainerPropduct(props) {
	const { products, inFilter = false, view = "gird" } = props;
	const cssPageFilter = {
		default: "w-1/4 max-w-[25%]",
		lg: "lg:w-1/3 lg:max-w-[33.33333%]",
		md: "md:w-1/3 md:max-w-[33.33333%]",
		sm: "sm:w-1/3 sm:max-w-[33.33333%]",
		xs: "xs:w-1/2 xs:max-w-[50%]",
	};

	const css = {
		default: "w-1/4 max-w-[20%]",
		lg: "lg:w-1/4 lg:max-w-[25%]",
		md: "md:w-1/3 md:max-w-[33.33333%]",
		sm: "sm:w-1/3 sm:max-w-[33.33333%]",
		xs: "xs:w-1/2 xs:max-w-[50%]",
	};

	const getCss = (() => {
		if (inFilter) {
			if (view === "gird") {
				return Object.keys(cssPageFilter)
					.map(key => cssPageFilter[key])
					.join(" ");
			}
			return "w-full";
		}
		return Object.keys(css)
			.map(key => css[key])
			.join(" ");
	})();
	const [hoverItem, setHoverItem] = useState(false);
	const objLoaded = {};
	products.forEach((item, key) => {
		objLoaded[key] = false;
	});
	const [imgLoaded, setImageLoaded] = useState(objLoaded);
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
				enqueueSnackbar("Đã thêm vào giỏ hàng!", {
					variant: "success",
				});
			}
		} catch (err) {
			return enqueueSnackbar("Đã xảy ra lỗi!", {
				variant: "error",
			});
		}
	};

	return (
		<div className="flex flex-wrap w-full">
			{products.map((item, key) => {
				return (
					<div
						key={key}
						onMouseOver={e => {
							// vì true!== 0
							setHoverItem(key + 1);
						}}
						onMouseLeave={() => {
							setHoverItem(false);
						}}
						className={`swiper-slide relative ${getCss}  flex flex-col transition-shadow ${view == "gird" ? "hover:shadow-propductShadow" : "hover:shadow-lg py-4"} xs:hover:shadow hover:z-[1] bg-white border`}>
						<div className={`p-2 h-full ${view !== "gird" && "flex"}`}>
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
							<div className={`mt-2 ${view === "gird" ? "w-full" : "w-[calc(100%-12rem)]"}`}>
								{/* loading */}
								{!imgLoaded[key] && (
									<div className="w-full">
										<Link href={"/" + item.Path}>
											<a className="bg-gray-300 w-full h-8 block text-center overflow-hidden font-semibold text-sm md:text-base mb-1 md:mb-1 text-body-main leading-5 animate-pulse rounded-2xl"></a>
										</Link>
										<div className="h-16">
											<div className="flex items-center flex-wrap space-y-2">
												<span className="text-sm text-black leading-5 w-full h-4 animate-pulse bg-gray-300 rounded-2xl"></span>
												<span className="text-lg xl:text-lg text-red-400 w-full h-4 leading-7 font-semibold animate-pulse bg-gray-300 rounded-2xl"></span>
											</div>
											<div className="text-sm line-through text-black leading-5 animate-pulse bg-gray-300 w-9/12 h-4  rounded-2xl mt-2"></div>
										</div>
									</div>
								)}
								<div className={`w-full ${!imgLoaded[key] ? "hidden invisible" : ""} `}>
									<Link href={"/" + item.Path}>
										<a className={`w-full ${view === "gird" ? "h-16 xs:h-20 text-center" : "h-12 xs:h-16"} block  overflow-hidden font-semibold text-sm md:text-base mb-1 md:mb-1 text-body-main leading-5`}>{item?.ProductName}</a>
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
											<span className="text-sm font-bold mr-2">{`${item.Star?.toFixed(1) || 0}`}</span> <Rated width={view === "gird" ? "w-2/5" : "w-28"} size="text-base" star={Math.ceil(item.Star)} />
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

						{view === "gird" && (
							<div className={`absolute z-10 left-0 right-0 top-full h-20 flex items-center bg-white shadow-propductShadow px-10 lg:px-4 md:px-5 sm:px-2 xs:px-1 rounded-b-lg xs:hover:shadow ${hoverItem == key + 1 && imgLoaded[key] ? "" : "hidden invisible"}`}>
								<Button disabled={item.RemainingAmount <= 0} onClick={() => handle_add_cart(item)} iconStart={<BagPlusFill />} title="Thêm giỏ hàng" rounded="rounded-none" />
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}

export default ContainerPropduct;
