import BoxShadow from "@src/components/common/BoxShadow";
import TitleCate from "@src/components/common/TitleCate";
const css_flex = "my-3 w-1/2 sm:w-full xs:w-full px-4";
import InputMain from "@src/components/common/InputMain";
import formatCurency from "@src/helper/FormatCurency";
import { useEffect, useState, useContext } from "react";
import { AppContext } from "src/context";
import Link from "next/link";
import Image from "next/image";
import { qualityImage, serverApi } from "@src/config/constrant";
import { ChevronRight } from "react-bootstrap-icons";
import ButtonColorMain from "@src/components/common/ButtonColorMain";
import ButtonWhite from "@src/components/common/ButtonWhite";
import axios from "@src/config/axios";
import { getCookie } from "@src/helper/helpCookie";
import { useSnackbar } from "notistack";
import Modal from "@src/components/common/Modal";
import validate from "@src/helper/validate";
import router from "next/router";
import { useRouter } from "next/router";
const TitleSmall = props => <h3 className="font-semibold text-base block pl-2">{props.children}</h3>;
const Main_Jsx = props => {
	const cssInputFlex = "w-1/2 px-2 sm:w-full xs:w-full mb-4 sm:text-sm xs:text-sm";
	const { user, setUser } = props;

	const { enqueueSnackbar } = useSnackbar();
	useEffect(() => {
		const getInforUser = async () => {
			if (user) {
				try {
					const accessToken = getCookie("accessToken");
					if (!accessToken || accessToken == "") {
						return;
					}
					const res = await axios.post("/api/user/profile", { accessToken });
					setProfile(res.data);
				} catch (error) {
					return enqueueSnackbar("Đã xảy ra lỗi. Vui lòng thử lại!", {
						variant: "warning",
					});
				}
			}
		};
		getInforUser();
	}, []);
	const [profile, setProfile] = useState({
		Address: {
			City: "",
			District: "",
			Wards: "",
			Details: "",
		},
		Avatar: "",
		_id: "",
		Name: "",
		PhoneNumber: "",
	});
	const [load, setLoad] = useState(false);
	useEffect(() => {
		// nếu chưa có user mà user đăng nhập lại thì reload lại page
		if (load) {
			const getInforUser = async () => {
				if (user) {
					try {
						const accessToken = getCookie("accessToken");
						if (!accessToken || accessToken == "") {
							return;
						}
						const res = await axios.post("/api/user/profile", { accessToken });
						setProfile(res.data);
					} catch (error) {
						return enqueueSnackbar("Đã xảy ra lỗi. Vui lòng thử lại!", {
							variant: "warning",
						});
					}
				}
			};
			getInforUser();
			// window.location.reload();
		}
	}, [user]);
	useEffect(() => {
		setLoad(true);
	}, []);
	const [show, setShow] = useState(false);
	const router = useRouter();
	const [isLoadingBtnSubmit, setIsLoadingBtnSubmit] = useState(false);
	if (user) {
		const totalMoney = user.Cart.reduce((total, item) => {
			// không tính tiền những sản phẩm đã hết hàng
			// hoặc số lượng order của khách hàng lớn hơn số
			if (item.RemainingAmount[0] > 0 && item.RemainingAmount >= item.Amount) {
				const price = item.PriceSale[0] > 0 ? item.PriceSale[0] : item.Price[0];
				total = total + item.Amount * price;
			}

			return total;
		}, 0);
		const checkButtonPaymentDisabled = () => {
			if (user.Cart.length === 0 || profile.Name.trim() == "" || profile._id.trim() == "" || profile.PhoneNumber.trim() == "" || profile.Address.City.trim() == "" || profile.Address.District.trim() == "" || profile.Address.Wards.trim() == "" || profile.Address.Details.trim() == "") {
				return true;
			}
			return false;
		};

		const handleSubmit = async () => {
			if (user) {
				try {
					const info = { Name: profile.Name, PhoneNumber: profile.PhoneNumber, Address: profile.Address };
					const { error } = await validate.userPayment(info);

					if (error) {
						return enqueueSnackbar(error.message, { variant: "error" });
					}
					const accessToken = getCookie("accessToken");
					if (!accessToken || accessToken == "") {
						return;
					}
					setIsLoadingBtnSubmit(true);

					const res = await axios.post("/api/user/payment", { accessToken, ...info });
					if (res.data.success) {
						// sản phẩm còn lại trong giỏ hàng
						const newCartId = res.data?.Cart?.map(item => item.Id_Product) || []; // danh sách id sản phẩm còn lại trong giỏ hàng

						setUser(prev => ({
							...prev,
							Cart: prev.Cart.filter(item => newCartId.includes(item.Id_Product)),
						}));
						setShow(false);
						enqueueSnackbar("Thanh toán thành công đơn hàng " + res.data.Id_Order, { variant: "success", autoHideDuration: 5000 });
						setIsLoadingBtnSubmit(false);
						router.push("/lich-su-mua-hang");
					}
				} catch (error) {
					setIsLoadingBtnSubmit(false);

					return enqueueSnackbar("Đã xảy ra lỗi. Vui lòng thử lại!", {
						variant: "warning",
					});
				}
			} else {
				return enqueueSnackbar("Bạn cần đăng nhập!", {
					variant: "warning",
				});
			}
		};
		const countProductsInTheOrder = user.Cart.filter(item => item.RemainingAmount[0] > 0 && item.RemainingAmount[0] >= item.Amount).length;
		return (
			<div className="flex flex-wrap my-4 w-full">
				<div className="w-7/12 sm:w-full xs:w-full py-4 border">
					<TitleSmall>Thông tin người nhận</TitleSmall>
					<div className="w-full flex my-2 flex-wrap">
						<div className={cssInputFlex}>
							<InputMain
								placeholder="Tên người nhận"
								customCss="text-black font-medium text-base"
								onChange={e => {
									setProfile({
										...profile,
										Name: e.target.value,
									});
								}}
								value={profile?.Name}
							/>
						</div>
						<div className={cssInputFlex}>
							<InputMain
								placeholder="Số điện thoại"
								customCss="text-black font-medium text-base"
								value={profile?.PhoneNumber}
								onChange={e => {
									setProfile({
										...profile,
										PhoneNumber: e.target.value,
									});
								}}
							/>
						</div>
					</div>
					<TitleSmall>Địa chỉ (Điền đầy đủ thông tin) </TitleSmall>
					<div className="w-full flex my-2 flex-wrap">
						<div className={cssInputFlex}>
							<InputMain
								placeholder="Tỉnh/Thành phố"
								customCss="text-black font-medium text-base"
								value={profile?.Address?.City}
								onChange={e => {
									setProfile({
										...profile,
										Address: {
											...profile.Address,
											City: e.target.value,
										},
									});
								}}
							/>
						</div>
						<div className={cssInputFlex}>
							<InputMain
								placeholder="Quận/Huyện"
								customCss="text-black font-medium text-base"
								value={profile?.Address?.District}
								onChange={e => {
									setProfile({
										...profile,
										Address: {
											...profile.Address,
											District: e.target.value,
										},
									});
								}}
							/>
						</div>
						<div className={cssInputFlex}>
							<InputMain
								placeholder="Xã/Phường"
								customCss="text-black font-medium text-base"
								value={profile?.Address?.Wards}
								onChange={e => {
									setProfile({
										...profile,
										Address: {
											...profile.Address,
											Wards: e.target.value,
										},
									});
								}}
							/>
						</div>
						<div className={cssInputFlex}>
							<InputMain
								placeholder="Địa chỉ cụ thể"
								customCss="text-black font-medium text-base"
								value={profile?.Address?.Details}
								onChange={e => {
									setProfile({
										...profile,
										Address: {
											...profile.Address,
											Details: e.target.value,
										},
									});
								}}
							/>
						</div>
						{/* <div className='w-full px-2'>
							<InputMain placeholder='Xã/Phường' customCss='text-black font-medium text-base' value={profile?.Address?.City} />
						</div> */}
					</div>
				</div>
				<div className="w-5/12 sm:w-full xs:w-full py-4 border">
					<ul className="flex flex-wrap w-full min-h-[200px] max-h-[500px] sm:max-h-[400px] xs:max-h-[400px] overflow-auto">
						{user.Cart.map((product, key) => {
							// không hiển thị những sản phẩm đã hết hàng
							// hoặc số lượng order nhiều hơn sosos lượn trong kho
							if (product.RemainingAmount[0] <= 0 || product.RemainingAmount[0] < product.Amount) {
								return null;
							}
							return (
								<li className="hover:bg-gray-100 w-full relative" key={key}>
									<Link href={"/" + product.Path[0]}>
										<a className="w-full block pl-2 pr-1 py-2 border-b">
											<div className="w-full flex items-center">
												<div className="relative inline-block h-12 w-12 rounded-full mr-3 select-none">
													<Image quality={qualityImage} layout="fill" src={`${serverApi}${product.DisplayImage[0]}`} />
												</div>
												<div className="flex flex-col word-wrap-global w-[calc(100%-3rem)] text-[.95rem]">
													<span className="text-sm font-medium">{product.ProductName[0]}</span>
													<span className="text-sm font-medium">
														{product.PriceSale[0] > 0 ? formatCurency(product.PriceSale[0]) : formatCurency(product.Price[0])}
														{" X " + product.Amount}
													</span>
												</div>
											</div>
										</a>
									</Link>
									<div className="absolute right-1 bottom-1 bg-primary text-white font-medium text-xs w-5 h-5 shadow rounded-full flex items-center justify-center">
										<span>{key + 1}</span>
									</div>
								</li>
							);
						})}
					</ul>
					<div className="w-full">
						<div className="flex item-center justify-between px-2 py-4 border-b border-t">
							<div>
								Đơn hàng <span className="text-primary font-medium">({countProductsInTheOrder})</span> sản phẩm
							</div>
							<Link href="/gio-hang">
								<a className="font-semibold text-primary hover:text-primaryDark flex items-center">
									Sửa <ChevronRight />
								</a>
							</Link>
						</div>
						<div className="flex item-center justify-between px-2 py-4 border-b">
							<div>Thành tiền</div>
							<span className="text-red-800 font-semibold">{user.Cart.length == 0 ? "Chưa có giá" : formatCurency(totalMoney)}</span>
						</div>
						<div className="flex item-center px-2 py-4 border-b justify-end">
							<Modal show={show}>
								<div className="px-2">
									<div className="bg-white max-w-3xl shadow rounded-lg overflow-auto max-h-[80vh] py-4">
										<div className="px-4 py-5 sm:px-6">
											<h3 className="text-lg leading-6 font-medium text-gray-900 text-center">Xác nhận thông tin thanh toán</h3>
										</div>
										<div className="border-t border-gray-200">
											<dl>
												<div className="bg-gray-100 px-4 py-5 flex flex-nowrap sm:flex-col xs:flex-col space-x-2 sm:space-x-0 xs:space-x-0">
													<dt className="text-sm  text-black font-bold w-[10rem]">Tên người nhận</dt>
													<dd className="text-sm text-gray-900 mt-0 col-span-2">{profile.Name}</dd>
												</div>
												<div className="bg-white px-4 py-5 flex flex-nowrap sm:flex-col xs:flex-col space-x-2 sm:space-x-0 xs:space-x-0">
													<dt className="text-sm  text-black font-bold w-[10rem]">Số điện thoại</dt>
													<dd className="text-sm text-gray-900 mt-0 col-span-2">{profile.PhoneNumber}</dd>
												</div>
												<div className="bg-gray-100 px-4 py-5 flex flex-nowrap sm:flex-col xs:flex-col space-x-2 sm:space-x-0 xs:space-x-0">
													<dt className="text-sm  text-black font-bold w-[10rem]">Địa chỉ</dt>
													<dd className="text-sm text-gray-900 mt-0 col-span-2">{`${profile.Address.City} - ${profile.Address.District}  -${profile.Address.Wards} - ${profile.Address.Details}`}</dd>
												</div>
												<div className="bg-white px-4 py-5 flex flex-nowrap sm:flex-col xs:flex-col space-x-2 sm:space-x-0 xs:space-x-0">
													<dt className="text-sm  text-black font-bold w-[10rem]">Đơn hàng</dt>
													<dd className="text-sm text-gray-900 mt-0 col-span-2">({countProductsInTheOrder}) sản phẩm</dd>
												</div>
												<div className="bg-gray-100 px-4 py-5 flex flex-nowrap sm:flex-col xs:flex-col space-x-2 sm:space-x-0 xs:space-x-0">
													<dt className="text-sm  text-black font-bold w-[10rem]">Tổng tiền</dt>
													<dd className="text-sm mt-0 col-span-2 text-red-800">{formatCurency(totalMoney)}</dd>
												</div>
												<div className="bg-white px-4 py-5 flex flex-nowrap sm:flex-col xs:flex-col space-x-2 sm:space-x-0 xs:space-x-0">
													<dt className="text-sm  text-black font-bold w-[10rem]">Hình thức thanh toán</dt>
													<dd className="text-sm text-gray-900 mt-0 col-span-2">Thanh toán khi nhận hàng</dd>
												</div>
											</dl>
											<div className="space-y-4 px-3">
												<ButtonColorMain disabled={isLoadingBtnSubmit} custom="w-full" onClick={handleSubmit}>
													Xác nhận thanh toán
												</ButtonColorMain>

												<ButtonWhite onClick={() => setShow(false)} title="Hủy bỏ" />
											</div>
										</div>
									</div>
								</div>
							</Modal>
							<ButtonColorMain disabled={isLoadingBtnSubmit} onClick={() => setShow(true)} title={checkButtonPaymentDisabled() ? "Vui lòng điền đầy đủ thông tin!" : ""} disabled={checkButtonPaymentDisabled()}>
								Thanh toán
							</ButtonColorMain>
						</div>
					</div>
				</div>
			</div>
		);
	}
	return (
		<div className="my-60 flex items-center justify-center w-full">
			<h2 className="inline-block text-2xl font-semibold">Bạn cần đăng nhập!</h2>
		</div>
	);
};
function Payment({ data }) {
	const { user, setUser } = useContext(AppContext);

	return (
		<div className="my-12">
			<BoxShadow>
				<div className="px-4 py-6 flex flex-wrap">
					<div className="w-full">
						<h1 className="text-2xl font-medium ">Đặt hàng</h1>
					</div>
					<Main_Jsx user={user} setUser={setUser} />
				</div>
			</BoxShadow>
		</div>
	);
}
export const getServerSideProps = async ctx => {
	return {
		props: {
			data: "",
		},
	};
};
export default Payment;
