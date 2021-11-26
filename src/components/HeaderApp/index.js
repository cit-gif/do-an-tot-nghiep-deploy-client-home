import React, { useState, useEffect, useMemo, useRef } from "react";
import Logo from "./Logo";
import Link from "next/link";
import ButtonIcon from "../common/ButtonIcon";
import { List, People, Search, Bag } from "react-bootstrap-icons";
import useMediaQuery from "@src/customhook/useMediaQuery";
import useScrollTrigger from "@src/customhook/useScrollTrigger";
import DialogModal from "@src/components/common/DialogModal";
import Account from "./Account";
import CartHeader from "./CartHeader";
import Notification from "./Notification";
import MenuMobile from "./mobile/MenuMobile";
import CartMobile from "./mobile/CartMobile";
import SearchMoblie from "./mobile/SearchMoblie";
import { useContext } from "react";
import { AppContext } from "src/context";
import { useRouter } from "next/router";
import axios from "@src/config/axios";
import Image from "next/image";
import { serverApi, qualityImage, limit_product_in_search } from "@src/config/constrant";
import formatCurency from "@src/helper/FormatCurency";
import { getCookie } from "@src/helper/helpCookie";
import { formatUrlForImage } from "@src/helper/formatHelper";
import { logOutAdmin } from "@src/helper/logOut";
import { adminDomain } from "@src/config/config";
// const Banner = props => {
// 	const bannerHide = "max-h-0 invisible -translate-y-full";
// 	return (
// 		<div className={`w-full bg-secondary transition-transform ease-out duration-300 ${!props.show ? bannerHide : ""}`} data-banner>
// 			<div className="container mx-auto h-20 relative bg-primary">
// 				<Image quality={qualityImage} objectFit="cover" loading="eager" layout="fill" src="/banner.jpg" />
// 			</div>
// 		</div>
// 	);
// };
const ProductItem = props => {
	const { ProductName, Path, Price, PriceSale, DisplayImage } = props.data;
	const [img_loaded, setImg_loaded] = useState(false);
	return (
		<li className="w-full flex items-center border-b-2 py-2">
			<Link href={`/${Path}`}>
				<a className="flex items-center w-full">
					<div className="w-2/12 h-[4rem] relative ">
						{img_loaded == false && <Image quality={50} objectFit="fill" loading="eager" layout="fill" src={`/default-image.jpg`} />}
						<Image
							quality={qualityImage}
							onLoad={() => {
								setImg_loaded(true);
							}}
							objectFit="fill"
							loading="lazy"
							layout="fill"
							src={`${serverApi}/${DisplayImage}`}
						/>
					</div>
					<div className="w-10/12 pl-3 flex flex-col">
						<p className="text-sm font-semibold">{ProductName}</p>
						<div className="flex space-x-2 items-center">
							<span className="text-sm text-red-400 leading-7 font-semibold">{PriceSale > 0 ? formatCurency(PriceSale) : formatCurency(Price)}</span>
							<div className="text-sm line-through text-black leading-5">{PriceSale > 0 ? formatCurency(Price) : ""}</div>
						</div>
					</div>
				</a>
			</Link>
		</li>
	);
};

const SearchComponent = () => {
	const { searchInput, setSearchInput } = useContext(AppContext);
	const [focused, setFocused] = useState(false);
	const router = useRouter();

	const handleSubmit = e => {
		e.preventDefault();
		router.push(`/tim-kiem?search=${encodeURIComponent(searchInput)}`);
	};

	//debounce search input
	useEffect(() => {
		return () => {
			clearTimeout(typingTimeoutRef.current);
		};
	}, []);
	const default_search = {
		Phone: [],
		Tablet: [],
	};
	const [search_data, setSearch_data] = useState(default_search);
	const typingTimeoutRef = useRef(null);
	const handle_fetch_data = async (query = "^", limit = 3) => {
		try {
			const res = await axios.get(`/api/public/search_in_header/${query}/${limit}`, { headers: { "Content-Type": "application/json" } });
			setSearch_data({
				Phone: res.data[0].Phone,
				Tablet: res.data[0].Tablet,
			});
		} catch (error) {
			setSearch_data(default_search);
		}
	};

	const handleChange = e => {
		const value = e.target.value;
		setSearchInput(e.target.value);
		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current);
		}
		if (value.trim() != "") {
			typingTimeoutRef.current = setTimeout(() => {
				handle_fetch_data(value.trim());
			}, 600);
		}
	};

	return (
		<form
			onMouseEnter={() => {
				setFocused(true);
			}}
			onMouseLeave={() => {
				setFocused(false);
			}}
			onSubmit={handleSubmit}
			className={`flex flex-row flex-nowrap relative border-2 rounded-full  pl-4 pr-1 py-1 hover:border-primary  ease-linear transition-all duration-200 ${focused ? "border-primary" : ""}`}>
			<input type="text" className="outline-none text-sm w-96 xxl:w-80 xl:w-80 lg:w-72 md:w-40  bg-transparent" onChange={handleChange} value={searchInput} placeholder="Nhập từ khóa" />
			<ButtonIcon type="submit" height="h-8" width="w-8" fontSize="text-xl">
				<Search />
			</ButtonIcon>
			<div className={`absolute top-full w-[28rem] h-[40rem] max-h-screen  left-1/2 -translate-x-1/2 pt-4  ${focused ? "" : "hidden invisible"}`}>
				<div className={`w-full h-full bg-gray-50 p-2 rounded-2xl overflow-auto shadow-propductShadow`}>
					<h3 className="text-xl font-bold my-2">Điện thoại di động</h3>
					<ul className="min-h-[14rem] relative">
						{/* loading */}
						{searchInput.trim() == "" && search_data.Phone.length == 0 && search_data.Tablet.length == 0 && (
							<div className="absolute inset-0 flex items-center justify-center">
								<div className={`h-10 w-10`}>
									<span className="border-primary animate-spin border-4 rounded-full h-full w-full block border-r-transparent"></span>
								</div>
							</div>
						)}
						{searchInput.trim() !== "" && search_data.Phone.length == 0 && (
							<div className="absolute inset-0 flex items-center justify-center">
								<span className="text-gray-500 font-semibold text-lg">Không tìm thấy kết quả</span>
							</div>
						)}
						{search_data.Phone.map((data, key) => {
							return <ProductItem key={key} data={data} />;
						})}
					</ul>
					<h3 className="text-xl font-bold my-2">Máy tính bảng</h3>
					<ul className="min-h-[12rem] relative">
						{/* loading */}
						{searchInput.trim() == "" && search_data.Tablet.length == 0 && search_data.Phone.length == 0 && (
							<div className="absolute inset-0 flex items-center justify-center">
								<div className={`h-10 w-10`}>
									<span className="border-primary animate-spin border-4 rounded-full h-full w-full block border-r-transparent"></span>
								</div>
							</div>
						)}
						{searchInput.trim() !== "" && search_data.Tablet.length == 0 && typingTimeoutRef.current && (
							<div className="absolute inset-0 flex items-center justify-center">
								<span className="text-gray-500 font-semibold text-lg">Không tìm thấy kết quả</span>
							</div>
						)}
						{search_data.Tablet.map((data, key) => {
							return <ProductItem key={key} data={data} />;
						})}
					</ul>
				</div>
			</div>
		</form>
	);
};
const listMenu = [
	{
		title: "Điện Thoại",
		href: `/dien-thoai?types=phone&limit=${limit_product_in_search}&page=1`,
		items: [
			{ title: "Xiaomi", href: `/dien-thoai?types=phone&brands=Xiaomi&limit=${limit_product_in_search}&page=1` },
			{ title: "SamSung", href: `/dien-thoai?types=phone&brands=SamSung&limit=${limit_product_in_search}&page=1` },
			{ title: "Apple", href: `/dien-thoai?types=phone&brands=Apple&limit=${limit_product_in_search}&page=1` },
			{ title: "Oppo", href: `/dien-thoai?types=phone&brands=Oppo&limit=${limit_product_in_search}&page=1` },
			{ title: "Vivo", href: `/dien-thoai?types=phone&brands=Vivo&limit=${limit_product_in_search}&page=1` },
		],
	},
	{
		title: "Tablet",
		href: `/tablet?types=tablet&limit=${limit_product_in_search}&page=1`,
		items: [
			{ title: "SamSung", href: `/tablet?types=tablet&brands=SamSung&limit=${limit_product_in_search}&page=1` },
			{ title: "Apple", href: `/tablet?types=tablet&brands=Apple&limit=${limit_product_in_search}&page=1` },
		],
	},
];
const NavLink = props => {
	const { title, href, items } = props.menuItems;
	const [showMenu, setShowMenu] = useState(false);
	return (
		<>
			<li
				className="list-none"
				onMouseOver={e => {
					setShowMenu(true);
				}}
				onMouseLeave={() => {
					setShowMenu(false);
				}}>
				<Link href={href}>
					<a className={`nav_link py-5 px-3 block text-lg ${showMenu ? "active" : ""}`}>{title}</a>
				</Link>
				<div className={`absolute top-full left-0 bg-white shadow-2xl w-full h-full overflow-hidden  ease-out transition-all duration-200 rounded-b-lg ${showMenu ? "max-h-full" : "max-h-0"}`}>
					<ul className="flex items-center">
						{items.map((item, key) => (
							<li className="w-1/4 h-full text-center text-lg font-semibold" key={key}>
								<Link href={item.href}>
									<a title={item.title}>{item.title}</a>
								</Link>
							</li>
						))}
					</ul>
				</div>
			</li>
			<DialogModal show={showMenu} />
		</>
	);
};
//để header nổi lên khi hover menu được ta phải cho set position cho nó
// và set z-index lớn hơn của modal kia
function Header() {
	const tripgerScreen = useMediaQuery("(max-width:800px)");
	const [showMenuMobile, setShowMenuMobile] = useState(false);
	const [showCartMobile, setShowCartMobile] = useState(false);
	const [showSearchMobile, setShowSearchMobile] = useState(false);
	const classes = (() => {
		const tripgerScroll = useScrollTrigger(5);
		if (tripgerScroll == "default") {
			return {
				container: "",
				bannerShow: true,
			};
		}
		if (tripgerScroll == "hidden") {
			return {
				container: "-translate-y-full",
				bannerShow: false,
			};
		}
		if (tripgerScroll == "show") {
			return {
				container: "top-0 shadow-xl",
				bannerShow: false,
			};
		}
	})();
	const { setChoiceFormLoginOrRegister, setShowFormLoginOrRegister } = useContext(AppContext);
	const { user, setUser, loadCart, setLoadCart, admin } = useContext(AppContext);

	const getCart = async () => {
		try {
			if (user && !loadCart) {
				setLoadCart(true);
				setOnLoadCart(true);
				const accessToken = getCookie("accessToken");
				if (accessToken == "") {
					return;
				}
				const res = await axios.post("/api/user/cart", {
					accessToken,
				});
				setUser({ ...user, Cart: res.data });
				setOnLoadCart(false);
			}
		} catch (error) {
			setLoadCart(false);
		}
	};
	const [onloadCart, setOnLoadCart] = useState(false);
	return (
		<>
			{/* kiểm tra admin */}
			{admin && (
				<div className="mx-64 border-b xxl:mx-56  xl:mx-24 lg:mx-5 md:mx-0 sm:mx-0 xs:mx-0 p-2 flex items-center justify-between">
					<div className=" flex flex-wrap items-center gap-4">
						<div className="relative w-10 h-10 rounded-full overflow-hidden ">
							<Image layout="fill" alt={admin.DisplayName} src={formatUrlForImage(admin.Avatar)} quality={qualityImage} />
						</div>
						<div className="font-medium">
							<span className="mr-2">Chào admin:</span>
							<span>{admin.DisplayName}</span>
						</div>
						<div className="border-l pl-2">
							<a className="hover:underline cursor-pointer text-sm font-medium" href={adminDomain} target="_blank">
								Đến trang quản trị
							</a>
						</div>
					</div>
					<div>
						<a
							className="hover:underline font-medium cursor-pointer"
							onClick={e => {
								e.preventDefault();
								logOutAdmin();
							}}>
							Đăng xuất
						</a>
					</div>
				</div>
			)}
			<div data-header className={`w-full z-30 bg-white sticky transition-all ease-out duration-500 ${classes.container}`}>
				{/* <Banner show={classes.bannerShow} /> */}
				<header className={`w-full flex items-center justify-center ${showSearchMobile && tripgerScreen ? "hidden invisible " : ""}`}>
					<div className="container  relative mx-64 xxl:mx-56  xl:mx-24 lg:mx-5 md:mx-0 sm:mx-0 xs:mx-0">
						<div className="flex items-center justify-between">
							<div className={`flex items-center justify-between ${tripgerScreen ? "w-full px-4 py-2" : ""}`}>
								{/* hiển thị mobile */}
								<div data-mobile className={tripgerScreen ? "inline-block" : "hidden invisible"}>
									<ButtonIcon
										custom="xs:text-3xl"
										onClick={() => {
											setShowMenuMobile(true);
										}}>
										<List />
									</ButtonIcon>
								</div>
								<Logo />

								<div className="flex items-center justify-center">
									<div data-mobile className={tripgerScreen ? "inline-block" : "hidden invisible"}>
										<ButtonIcon
											height="h-8"
											width="w-8"
											custom="xs:text-xl border-[1px] border-gray-200"
											onClick={() => {
												setShowSearchMobile(true);
											}}>
											<Search />
										</ButtonIcon>
									</div>
									<span className="w-8 xs:w-5"></span>
									<div data-mobile className={tripgerScreen ? "inline-block" : "hidden invisible"}>
										{/* // giỏ hangg */}
										<ButtonIcon
											height="h-8"
											width="w-8"
											custom="xs:text-xl "
											onClick={() => {
												setShowCartMobile(true);
												getCart();
											}}>
											<Bag />
										</ButtonIcon>
									</div>
								</div>
							</div>
							<div className={tripgerScreen ? "hidden invisible" : "flex"}>
								<div className="flex items-center justify-between gap-4">
									{listMenu.map((menu, index) => {
										return <NavLink key={index} menuItems={menu} />;
									})}
								</div>
							</div>
							<div className={tripgerScreen ? "hidden invisible" : ""}>
								<SearchComponent />
							</div>
							<div className={tripgerScreen ? "hidden invisible" : "flex items-center justify-between"}>
								<Notification />
								<CartHeader />
								<Account />
							</div>
						</div>
					</div>
				</header>
				<SearchMoblie
					show={tripgerScreen && showSearchMobile}
					setShow={value => {
						setShowSearchMobile(value);
					}}
				/>
			</div>
			<div data-show="mobile">
				<MenuMobile
					listMenu={listMenu}
					tripgerScreen={tripgerScreen}
					show={showMenuMobile}
					setShow={value => {
						setShowMenuMobile(value);
					}}
				/>
				<CartMobile
					tripgerScreen={tripgerScreen}
					show={showCartMobile}
					setShow={value => {
						setShowCartMobile(value);
					}}
					onload={onloadCart}
					User={user}
				/>
			</div>
		</>
	);
}

export default Header;
