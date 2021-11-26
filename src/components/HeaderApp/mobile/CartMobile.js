import DialogModal from "@src/components/common/DialogModal";
import Link from "next/link";
import { ChevronUp, Newspaper, Facebook, Youtube, Instagram } from "react-bootstrap-icons";
import ButtonIcon from "@src/components/common/ButtonIcon";
import { useState, createRef, useEffect } from "react";
import Image from "next/image";
import { serverApi, qualityImage } from "@src/config/constrant";
import formatCurency from "@src/helper/FormatCurency";
const Main_Jsx = props => {
	const user = props.User;
	const onload = props.onload;
	if (!user) {
		return (
			<div className="w-full flex items-center justify-center">
				<span>Bạn cần đăng nhập!</span>
			</div>
		);
	}
	if (user && user.Cart.length == 0 && onload == false) {
		return (
			<div className="flex items-center justify-center">
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
						<div className="hover:bg-gray-100 border-b" key={key}>
							<Link href={`/${product.Path[0]}`}>
								<a className="w-full block pl-2 pr-1 py-2">
									<div className="w-full flex items-center">
										<div className="relative inline-block h-12 w-12 rounded-full mr-3 select-none">
											<Image quality={qualityImage} layout="fill" src={`${serverApi}${product.DisplayImage[0]}`} />
											{/* <Image lazy='true' quality={qualityImage} layout='fill' src={`${serverApi}/${TuyChon?.DuongDanHinhAnh[0]}`} /> */}
										</div>
										<div className="flex flex-col word-wrap-global w-[calc(100%-3rem)] text-[.95rem]">
											<span className="font-medium">{product.ProductName[0]}</span>
											<span>{formatCurency(product.PriceSale[0] > 0 ? product.PriceSale[0] : product.Price[0]) + " X " + product.Amount}</span>
										</div>
									</div>
								</a>
							</Link>
						</div>
					);
				})}
				<div className="px-4 py-2 sticky bottom-0 inset-x-0 bg-gray-200 shadow-lg ">
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
function CartMobile(props) {
	const user = props.User;
	const onload = props.onload;

	const { show, setShow, tripgerScreen } = props;

	return (
		<>
			<div className={`fixed z-40 flex h-full overflow-x-hidden right-0 bottom-0 shadow w-full ${show && tripgerScreen ? "left-0 transition-all duration-450" : " left-full transition-all duration-150"}`}>
				<div
					className="w-4/12 h-full bg-transparent"
					onClick={() => {
						setShow(false);
					}}></div>
				<div className="h-full w-8/12 overflow-y-scroll overflow-x-hidden flex flex-col pt-3 bg-white text-lg relative">
					<Main_Jsx onload={onload} User={user} />
				</div>
			</div>
			<DialogModal zIndex="z-30" show={show && tripgerScreen} />
		</>
	);
}

export default CartMobile;
// {
// 	true ? (
// 		<>
// 			{cart.map((product, key) => {
// 				return (
// 					<li className='hover:bg-gray-100' key={key}>
// 						<Link href='/'>
// 							<a className='w-full block pl-2 pr-1 py-2'>
// 								<div className='w-full flex items-center'>
// 									<div className='relative inline-block h-12 w-12 rounded-full mr-3 select-none'>
// 										<Image quality={qualityImage} layout='fill' src={`${product.LinkProduct}`} />
// 										{/* <Image lazy='true' quality={qualityImage} layout='fill' src={`${serverApi}/${TuyChon?.DuongDanHinhAnh[0]}`} /> */}
// 									</div>
// 									<div className='flex flex-col word-wrap-global w-[calc(100%-3rem)] text-[.95rem]'>
// 										<span>{product.Name}</span>
// 										<span>{formatCurency(product.Price) + " X " + product.Amount}</span>
// 									</div>
// 								</div>
// 							</a>
// 						</Link>
// 					</li>
// 				);
// 			})}
// 			<div className='px-4 mt-8'>
// 				<Link href='/gio-hang'>
// 					<a className='flex items-center bg-primary text-white rounded-full px-3 py-3 text-sm font-bold'>
// 						<strong className='mr-auto'>Giỏ hàng:</strong> <strong>14.290.000&nbsp;₫</strong>
// 					</a>
// 				</Link>
// 			</div>
// 		</>
// 	) : (
// 		<div className='w-full flex items-center justify-center'>
// 			<span>Giỏ hàng trống</span>
// 		</div>
// 	);
// }
