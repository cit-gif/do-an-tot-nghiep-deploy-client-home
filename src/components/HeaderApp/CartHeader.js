import ButtonIcon from "@src/components/common/ButtonIcon";
import Dropdown from "@src/components/common/Dropdown";
import { Person, Bag } from "react-bootstrap-icons";

import { useState, useEffect } from "react";
import { useContext } from "react";
import { AppContext } from "@src/context";
import Image from "next/image";
import { serverApi, qualityImage } from "@src/config/constrant";
import formatCurency from "@src/helper/FormatCurency";
import Link from "next/link";
import axios from "@src/config/axios";
import { getCookie } from "@src/helper/helpCookie";
const CartJSX = props => {
	const user = props.User;
	const onload = props.onload;
	if (!user) {
		return (
			<div className="w-64 flex items-center justify-center">
				<span>Bạn cần đăng nhập!</span>
			</div>
		);
	}
	if (user && user.Cart.length == 0 && onload == false) {
		return (
			<div className="w-64 flex items-center justify-center">
				<span>Giỏ hàng trống!</span>
			</div>
		);
	}
	if (user && user.Cart.length == 0 && onload == true) {
		return (
			<div className="absolute inset-0 flex items-center justify-center">
				<div className={`h-10 w-10`}>
					<span className="border-primary animate-spin border-4 rounded-full h-full w-full block border-r-transparent"></span>
				</div>
			</div>
		);
	}
	if (user && user.Cart.length !== 0) {
		const sum = user.Cart.reduce((total, item) => {
			const price = item.PriceSale[0] > 0 ? item.PriceSale[0] : item.Price[0];
			return total + item.Amount * price;
		}, 0);
		return (
			<>
				{user.Cart.map((product, key) => {
					return (
						<div className="w-full hover:bg-gray-100" key={key}>
							<Link href={`/${product.Path[0]}`}>
								<a className="w-full block px-4 py-3">
									<div className="w-full flex">
										<div className="relative inline-block h-12 w-12 rounded-full mr-3 select-none">
											<Image quality={qualityImage} layout="fill" src={`${serverApi}${product.DisplayImage[0]}`} />
											{/* <Image lazy='true' quality={qualityImage} layout='fill' src={`${serverApi}/${TuyChon?.DuongDanHinhAnh[0]}`} /> */}
										</div>
										<div className="flex flex-col word-wrap-global w-52">
											<span>{product.ProductName[0]}</span>
											<span>{formatCurency(product.PriceSale[0] > 0 ? product.PriceSale[0] : product.Price[0]) + " X " + product.Amount}</span>
										</div>
									</div>
								</a>
							</Link>
						</div>
					);
				})}
				<div className="px-4 my-4">
					<Link href="/gio-hang">
						<a className="flex items-center bg-primary text-white rounded-full px-8 py-3 font-bold">
							<strong className="mr-2">Giỏ hàng:</strong> <strong>{formatCurency(sum)}</strong>
						</a>
					</Link>
				</div>
			</>
		);
	}
};
const Badge = props => {
	const { user } = props;
	if (!user) {
		return "";
	}
	if (user.Cart.length == 0) {
		return "";
	}
	if (user.Cart.length > 0) {
		return <span className="overflow-hidden z-50 shadow-sm -top-3 -right-3 absolute p-4 max-w-[3.5rem] max=h-[3.5rem] w-[2.5rem] h-[2.5rem] border bg-primary  text-white font-semibold text-sm rounded-full whitespace-nowrap flex items-center justify-center">{user.Cart.length.toString()}</span>;
	}
};
function CartHeader() {
	const { user, setUser, loadCart, setLoadCart } = useContext(AppContext);

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
	//Load cart từ client;
	//nếu hover lần đầu và user đã đăng nhập thì load cart,
	// nếu user chưa đăng nhập thì không load
	// khi đăng nhập cần load cart và setlaod cart ==true =>khi hover vào cart thì load  cart
	// khi đăng xuất thì xóa cookie và reload lại page
	// getCart();

	return (
		<div className="inline-block mx-5 xxl:mx-3 lg:mx-2 md:mx-1 relative">
			<Badge user={user} />
			<Dropdown
				onMouseEnter={getCart}
				direction="center-down"
				relative={
					<ButtonIcon fontSize="text-2xl">
						<Bag />
					</ButtonIcon>
				}
				absolute={
					<div className="m-0 p-0 flex items-center flex-col relative min-h-[4rem] min-w-[8rem] max-h-[80vh] overflow-auto">
						<CartJSX onload={onloadCart} User={user} />
					</div>
				}
			/>
		</div>
	);
}

export default CartHeader;
