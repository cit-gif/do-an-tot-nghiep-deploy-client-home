import { useContext, useState, useEffect } from "react";
import Head from "next/head";
import { AppContext } from "@src/context";
import { PlusLg, DashLg, Trash, ArrowLeft } from "react-bootstrap-icons";
import formatCurency from "@src/helper/FormatCurency";
import Image from "next/image";
import { serverApi, qualityImage } from "@src/config/constrant";
import Link from "next/link";
import axios from "@src/config/axios";
import { useSnackbar } from "notistack";
import { getCookie } from "@src/helper/helpCookie";
import BoxShadow from "@src/components/common/BoxShadow";
import MessageAndGoHome from "@src/components/common/MessageAndGoHome";
const BtnSmall = props => {
	const { disabled, children, onClick = e => {}, text = "", title = "", type = "button" } = props;
	return (
		<button disabled={disabled} type={type} title={title} className={`${disabled && "cursor-not-allowed"} w-8 h-8 flex items-center justify-center outline-none rounded-full shadow transition-all active:bg-gray-400 bg-gray-50 ${text}`} onClick={e => onClick(e)}>
			{children}
		</button>
	);
};
const ProductItem = props => {
	const { ProductName, DisplayImage, Id_Product, Path, Price, PriceSale, Amount, RemainingAmount } = props.data;
	const { setUser, user } = useContext(AppContext);
	const { enqueueSnackbar } = useSnackbar();
	const handle_add_cart = async () => {
		try {
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
						BrandName: [[Brand.BrandName[0]]],
						BrandImage: [[Brand.BrandImage[0]]],
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
	const handlePull = async () => {
		try {
			const accessToken = getCookie("accessToken");
			if (accessToken == "") {
				return enqueueSnackbar("Bạn cần đăng nhập!", {
					variant: "error",
					preventDuplicate: true,
				});
			}
			const res = await axios.post(`/api/user/cart/subtract`, {
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
					// chưa nếu server có mà clieent ko có
					// thông báo lỗi reload lại page/
					window.location.reload();
					return enqueueSnackbar("Đã xảy ra lỗi!", {
						variant: "error",
					});
				}
				//nếu có và res.data.Amount = -1
				const newAmout = res.data.Amount;
				if (newAmout == -1) {
					// xóa sản phẩm này
					currentCart.splice(positon_finded, 1);
					setUser({
						...user,
						Cart: currentCart,
					});
				} else {
					currentCart[positon_finded].Amount -= 1;
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
	const handleDelete = async () => {
		try {
			const accessToken = getCookie("accessToken");
			if (accessToken == "") {
				return enqueueSnackbar("Bạn cần đăng nhập!", {
					variant: "error",
					preventDuplicate: true,
				});
			}
			const res = await axios.post(`/api/user/cart/delete`, {
				Id_Product,
				accessToken,
			});
			if (res.status == 200) {
				enqueueSnackbar("Đã xóa thành công!", {
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
					//nếu xóa thành công trên server vmaf ko tìm thấy ở client thì reload
					return window.location.reload();
				} else {
					//nếu cả hai thành công
					currentCart.splice(positon_finded, 1);
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
	const [imageLoaded, setImageLoaded] = useState(false);
	return (
		<div className="flex justify-between items-center xs:flex-col xs:items-stretch mt-6 pt-6 border-t">
			<Head>
				<title>Đặt hàng</title>
			</Head>
			<div className="flex items-center">
				<div className="relative w-16 h-16 rounded border mr-2">
					{!imageLoaded && <Image quality={qualityImage} objectFit="cover" loading="eager" layout="fill" src={`/default-image.jpg`} />}
					<Image quality={qualityImage} onLoad={() => setImageLoaded(true)} objectFit="fill" alt={`a`} loading="lazy" layout="fill" src={`${serverApi}${DisplayImage[0]}`} />
				</div>
				<div className="flex flex-col ml-3">
					<span className="xs:text-sm font-medium">{ProductName[0]}</span>

					{PriceSale[0] > 0 ? (
						<>
							<span className="font-bold text-red-400">{formatCurency(PriceSale[0])}</span>
							<span className="line-through text-sm font-medium">{formatCurency(Price)}</span>
						</>
					) : (
						<span className="font-medium">{formatCurency(Price)}</span>
					)}
					<div>
						<span className="text-sm font-semibold mr-2">Số lượng mua:</span>
						<span className="font-semibold">{Amount}</span>
					</div>
					<div>
						<span className="text-sm font-semibold mr-2">Số lượng trong kho:</span>
						<span className="font-semibold">{RemainingAmount}</span>
					</div>
					<div>
						<span className="mr-2 text-sm font-semibold">Thành tiền:</span>
						<span>{PriceSale > 0 ? formatCurency(Amount * PriceSale) : formatCurency(Amount * Price)}</span>
					</div>
					<div>
						<span className="font-medium text-sm mr-2">Tình trạng:</span>
						<span className={`${RemainingAmount[0] > 0 && RemainingAmount[0] >= Amount ? "text-green-600" : "text-gray-600"} font-bold`}>{RemainingAmount[0] > 0 && RemainingAmount[0] >= Amount ? "Còn hàng" : "Không đủ đáp ứng"}</span>
					</div>
				</div>
			</div>
			<div className="flex justify-center items-center xs:mt-4 space-x-2">
				<div className="pr-8 flex items-center space-x-4">
					<BtnSmall disabled={RemainingAmount <= 0} onClick={handlePull}>
						<DashLg />
					</BtnSmall>

					<input type="text" disabled className="focus:outline-none bg-white border h-6 w-8 rounded text-sm px-2 mx-2" value={Amount} />
					{/* không cho cộng thêm nếu đã hết hàng hoặc số lượn còn lại ít hơn số lượng trong kho */}
					<BtnSmall disabled={RemainingAmount <= 0 || RemainingAmount <= Amount} onClick={handle_add_cart}>
						<PlusLg />
					</BtnSmall>
				</div>

				<div>
					<BtnSmall onClick={handleDelete} title="Xóa sản phẩm này" text="font-medium text-xl text-red-400">
						<Trash />
					</BtnSmall>
				</div>
			</div>
		</div>
	);
};
const CartUserJSX = props => {
	const { user } = props;

	if (!user) {
		return (
			<BoxShadow>
				<MessageAndGoHome message="Bạn cần đăng nhập!" />
			</BoxShadow>
		);
	}
	if (user.Cart.length == 0) {
		return (
			<BoxShadow>
				<MessageAndGoHome message="Giỏ hàng trống!" />
			</BoxShadow>
		);
	}
	const totalMoney = user.Cart.reduce((total, item) => {
		if (item.RemainingAmount[0] > 0 && item.RemainingAmount[0] >= item.Amount) {
			const price = item.PriceSale[0] > 0 ? item.PriceSale[0] : item.Price[0];
			total = total + item.Amount * price;
		}
		return total;
	}, 0);
	return (
		<div className="my-12">
			<BoxShadow>
				<div className="flex ">
					<div className="w-full p-4 px-5 py-5">
						<div className="flex flex-col ">
							<div className="col-span-2 p-5">
								<h1 className="text-2xl font-medium ">Giỏ hàng</h1>
								<span>({user.Cart.length} sản phẩm)</span>
								{user.Cart.map((product, key) => {
									return <ProductItem data={product} key={key} />;
								})}
								<div className="flex justify-between items-center mt-6 pt-6 border-t xs:flex-col-reverse">
									<Link href="/">
										<a className="flex items-center xs:mt-8">
											<ArrowLeft /> <span className="ml-2 text-md font-medium text-blue-500">Tiếp tục mua sắm</span>
										</a>
									</Link>

									<div className="flex justify-center items-center">
										<span className="text-lg font-medium text-gray-700 mr-3">Tổng cộng:</span> <span className="text-xl font-bold text-gray-800 ">{formatCurency(totalMoney)}</span>
									</div>
								</div>
								<div className="w-full flex flex-col gap-2 items-center justify-end mt-4">
									<Link href="/dat-hang">
										<a className="bg-primary font-semibold text-white px-4 py-2 rounded-2xl hover:shadow-nextShadow transition-all">Tiến hành đặt hàng</a>
									</Link>
									<span className="text-sm">Những sản phẩm "Không đủ đáp ứng" sẽ được loại bỏ khi tiến hành thanh toán</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</BoxShadow>
		</div>
	);
};
function CartUser({ data }) {
	const { user } = useContext(AppContext);

	return (
		<div className="container mx-auto">
			<CartUserJSX user={user} />
		</div>
	);
}
// const getData = async (accessToken) => {
// 	const data = {};

// 	try {
// 		data.check = true;
// 		const res = await axios.post("/api/user/cart", { accessToken });
// 		data.data = res.data;
// 		return data;
// 	} catch (error) {
// 		data.check = false;
// 		return data;
// 	}
// };
export const getServerSideProps = async ctx => {
	return {
		props: {
			data: "",
		},
	};
};
export default CartUser;
