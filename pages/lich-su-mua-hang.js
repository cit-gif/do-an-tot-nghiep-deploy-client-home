import BoxShadow from "@src/components/common/BoxShadow";
import TitleCate from "@src/components/common/TitleCate";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@src/context";
import MessageAndGoHome from "@src/components/common/MessageAndGoHome";
import axios from "@src/config/axios";
import { getCookie } from "@src/helper/helpCookie";
import { useSnackbar } from "notistack";
import formatCurency from "@src/helper/FormatCurency";
import FormatDate from "@src/helper/FormatDate";
import Modal from "@src/components/common/Modal";
import Image from "next/image";
import { serverApi, qualityImage } from "@src/config/constrant";
import Link from "next/link";

const Table = props => {
	const { data } = props;
	const [show, setShow] = useState(false);
	const [dataModal, setDataModal] = useState({
		_id: "",
		Name: "",
		Address: {
			City: "",
			District: "",
			Wards: "",
			Details: "",
		},
		Products: [],
		Status: "",
		PhoneNumber: "",
		Time: "",
		TotalMoney: 0,
	});
	const { enqueueSnackbar } = useSnackbar();
	let Id_History = 0;
	const handleGetDetailsHistory = async _id => {
		setShow(true);
		if (Id_History == _id) {
			return;
		}
		try {
			const accessToken = getCookie("accessToken");
			if (!accessToken || accessToken == "") {
				return enqueueSnackbar("Đã xảy ra lỗi. Vui lòng tải lại trang!", {
					variant: "error",
				});
			}
			const res = await axios.get("/api/user/shoppingHistory/" + _id, { headers: { "Content-Type": "application/json", authorization: accessToken } });
			// nếu trang chưa được reload mà gửi lệnh thì
			if (res.data[0].ShoppingHistory.length === 0) {
				return enqueueSnackbar("Đã xảy ra lỗi. Vui lòng tải lại trang!", {
					variant: "error",
				});
			}
			setDataModal(res.data[0].ShoppingHistory);
			Id_History = _id;
		} catch (error) {
			return enqueueSnackbar("Đã xảy ra lỗi. Vui lòng thử lại!", {
				variant: "warning",
			});
		}
	};
	return (
		<div className="container mx-auto px-4  max-w-3xl">
			<div className="py-8">
				<div className="flex flex-row mb-1 justify-between w-full">
					<h2 className="text-2xl leading-tight">Lịch sử mua hàng</h2>
				</div>
				<div className="-mx-4  px-4 py-4 overflow-x-auto">
					<div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
						<table className="min-w-full leading-normal">
							<thead>
								<tr>
									{["Mã đơn hàng", "Thời gian", "Tổng tiền", "Tình trạng"].map((x, key) => (
										<th key={key} scope="col" className="bg-gray-300 px-5 py-3  border-b border-gray-200 text-gray-900  text-left text-sm uppercase font-bold">
											{x}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{data.map((x, key) => (
									<tr key={key}>
										<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
											<a
												title="Xem chi tiết"
												onClick={e => {
													e.preventDefault();

													handleGetDetailsHistory(x.Id_History);
												}}
												className="text-primaryDark active:text-primary underline cursor-pointer font-bold whitespace-nowrap">
												{x.Id_History}
											</a>
										</td>
										<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
											<p className="text-gray-900 whitespace-nowrap">{FormatDate(x.Time)}</p>
										</td>
										<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
											<p className=" whitespace-nowrap text-red-800 font-semibold">{formatCurency(x.TotalMoney)}</p>
										</td>
										<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
											<span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
												<span aria-hidden="true" className="absolute inset-0 bg-green-200 opacity-50 rounded-full "></span>
												<span className="relative whitespace-nowrap">{x.Status}</span>
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<Modal show={show}>
						<div className="overflow-auto rounded-md py-8 max-w-[90%] min-w-[24rem]  max-h-[80vh] bg-white">
							<div className="w-full flex justify-end px-4">
								<span title="Đóng" onClick={() => setShow(false)} className="font-semibold text-3xl cursor-pointer">
									X
								</span>
							</div>
							<h2 className="text-center font-semibold text-xl">Chi tiết đơn hàng</h2>
							<div className="flex flex-col my-6">
								<div className="flex items-center flex-nowrap bg-gray-100 py-4 px-3">
									<span className="w-40 min-w-[10rem] text-sm text-gray-900 font-medium whitespace-nowrap">Mã đơn hàng</span>
									<span className="text-primaryDark">{dataModal._id}</span>
								</div>
								<div className="flex items-center flex-nowrap bg-white py-4 px-3">
									<span className="w-40 min-w-[10rem] text-sm text-gray-900 font-medium whitespace-nowrap">Tên người nhận</span>
									<span>{dataModal.Name}</span>
								</div>
								<div className="flex items-center flex-nowrap bg-gray-100 py-4 px-3">
									<span className="w-40 min-w-[10rem] text-sm text-gray-900 font-medium whitespace-nowrap">Tình trạng</span>
									<span className="bg-green-200 text-green-800 text-sm font-bold rounded-full px-2 py-1">{dataModal.Status}</span>
								</div>
								<div className="flex items-center flex-nowrap bg-white py-4 px-3">
									<span className="w-40 min-w-[10rem] text-sm text-gray-900 font-medium whitespace-nowrap">Số điện thoại</span>
									<span>{dataModal.PhoneNumber}</span>
								</div>
								<div className="flex items-center flex-nowrap bg-gray-100 py-4 px-3">
									<span className="w-40 min-w-[10rem] text-sm text-gray-900 font-medium  whitespace-nowrap">Địa chỉ</span>
									<span>{`${dataModal.Address.City}-${dataModal.Address.District}-${dataModal.Address.Wards}-${dataModal.Address.Details}`}</span>
								</div>
								<div className="flex items-center flex-nowrap bg-white py-4 px-3">
									<span className="w-40 min-w-[10rem] text-sm text-gray-900 font-medium whitespace-nowrap">Tổng tiền</span>
									<span className="text-red-800">{formatCurency(dataModal.TotalMoney)}</span>
								</div>
								<div className="flex items-center flex-nowrap bg-gray-100 py-4 px-3">
									<span className="w-40 min-w-[10rem] text-sm text-gray-900 font-medium whitespace-nowrap">Hình thức thanh toán</span>
									<span>Gửi tiền khi nhận được hàng</span>
								</div>
								<div className="w-full">
									{dataModal.Products.map((x, key) => (
										<Link href={`/${x.Path}`} key={key}>
											<a className="px-2 py-5 w-full block border-b border-gray-200 bg-white text-sm">
												<div className="flex items-center w-full">
													<div className="flex-shrink-0">
														<div className="block relative h-16 w-16">
															<Image alt={x.ProductName} src={`${serverApi}${x.DisplayImage}`} layout="fill" objectFit="cover" quality={qualityImage} loading="lazy" />
														</div>
													</div>
													<div className="ml-3">
														<p className="text-gray-900 whitespace-nowrap">{x.ProductName}</p>
														<p className="text-gray-900 whitespace-nowrap text-sm">{`${x.Amount} x ${x.PriceSale > 0 ? formatCurency(x.PriceSale) : formatCurency(x.Price)} `}</p>
													</div>
												</div>
											</a>
										</Link>
									))}
								</div>
							</div>
						</div>
					</Modal>
				</div>
			</div>
		</div>
	);
};

const Main_Jsx = props => {
	const { user, setUser } = useContext(AppContext);
	const [table, setTable] = useState([]);
	const { enqueueSnackbar } = useSnackbar();
	useEffect(() => {
		const getShoppingHistory = async () => {
			if (user) {
				try {
					const accessToken = getCookie("accessToken");
					if (!accessToken || accessToken == "") {
						return;
					}
					const res = await axios.get("/api/user/shoppingHistory", { headers: { "Content-Type": "application/json", authorization: accessToken } });
					setTable(res.data);
				} catch (error) {
					return enqueueSnackbar("Đã xảy ra lỗi. Vui lòng thử lại!", {
						variant: "warning",
					});
				}
			}
		};
		getShoppingHistory();
	}, []);
	const [load, setLoad] = useState(false);
	useEffect(() => {
		if (load) {
			const getShoppingHistory = async () => {
				if (user) {
					try {
						const accessToken = getCookie("accessToken");
						if (!accessToken || accessToken == "") {
							return;
						}
						const res = await axios.get("/api/user/shoppingHistory", { headers: { "Content-Type": "application/json", authorization: accessToken } });
						setTable(res.data);
					} catch (error) {
						return enqueueSnackbar("Đã xảy ra lỗi. Vui lòng thử lại!", {
							variant: "warning",
						});
					}
				}
			};
			getShoppingHistory();
			// window.location.reload();
		}
	}, [user]);
	useEffect(() => {
		setLoad(true);
	}, []);

	if (!user) {
		return <MessageAndGoHome message="Bạn cần đăng nhập!" />;
	}
	// if(table.length===0){ return}
	if (user) {
		const TotalMoneyAll = table.reduce((pre, current) => {
			return (pre += current.TotalMoney);
		}, 0);
		return (
			<div className="p-4">
				<div className="flex flex-wrap items-center">
					<div className="w-1/2 sm:w-full xs:w-full">
						<TitleCate>Lịch sử mua hàng</TitleCate>
					</div>
					<div className="w-1/2 sm:w-full xs:w-full h-16">
						<span className="text-sm mr-1">Tổng số tiền đã giao dịch:</span>
						<span className="font-bold mr-1">{TotalMoneyAll === 0 ? "Chưa có giá " : formatCurency(TotalMoneyAll)} /</span>
						<span className="font-bold mr-1">{table.length}</span>
						<span className="text-sm">đơn hàng</span>
					</div>
				</div>
				<Table data={table} />
			</div>
		);
	}
};
function ShoppingHistory() {
	return (
		<div className="my-12">
			<BoxShadow>
				<Main_Jsx />
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

export default ShoppingHistory;
