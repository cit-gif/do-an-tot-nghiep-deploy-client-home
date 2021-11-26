import DialogModal from "@src/components/common/DialogModal";
import Link from "next/link";
import { ChevronUp, Newspaper, Facebook, Youtube, Instagram, Person, BoxArrowLeft, ArrowCounterclockwise, Bag } from "react-bootstrap-icons";
import ButtonIcon from "@src/components/common/ButtonIcon";
import { useState, createRef, useContext } from "react";
import Image from "next/image";
import { serverApi, qualityImage } from "@src/config/constrant";
import { AppContext } from "@src/context";
const Avatar = props => {
	const { user } = props;
	if (!user) {
		return (
			<div className=" bg-primary text-4xl rounded-full border-[1px] border-gray-300 h-12 w-12 flex items-center justify-center">
				<Person />
			</div>
		);
	}
	if (user.Avatar == "") {
		return (
			<div className=" bg-primary flex items-center justify-center w-12 h-12 rounded-full shadow bg-primary hover-primaryDark">
				<span className="text-white">{user.Name.split(" ").pop()}</span>
			</div>
		);
	}
	if (user.Avatar != "" && user.Avatar) {
		return (
			<div className=" bg-primary relative flex items-center justify-center w-12 h-12 rounded-full shadow bg-primary hover-primaryDark overflow-hidden">
				<Image quality={qualityImage} objectFit="fill" title={user.Name} alt={user.Name} loading="eager" layout="fill" src={`${serverApi}/${user.Avatar}`} />
				<span className="text-white">{user.Name.split(" ").pop()}</span>
			</div>
		);
	}
};
function MenuMobile(props) {
	const { show, setShow, tripgerScreen, listMenu } = props;
	const [openTab, setOpenTab] = useState({
		0: false,
		1: false,
	});
	const { user, setChoiceFormLoginOrRegister, setShowFormLoginOrRegister } = useContext(AppContext);
	const [openAccount, setOpenAccount] = useState(false);
	return (
		<>
			<div className={`fixed z-40 flex h-full overflow-x-hidden bottom-0 shadow w-full ${show && tripgerScreen ? "left-0 transition-all duration-450" : "-left-full transition-all duration-150"}`}>
				<ul className="h-full min-w-max w-9/12 overflow-y-scroll py-3 flex flex-col bg-white text-lg">
					{/* đăng nhập đang kí */}
					<li className="flex flex-col items-center w-full min-w-max">
						<div
							onClick={() => {
								setOpenAccount(!openAccount);
							}}
							className=" cursor-pointer flex flex-nowrap items-center justify-between w-full border-b-[1px] border-gray-200 active:bg-gray-100">
							<a className="max-w-max py-4 pl-4 font-semibold">Tài khoản</a>
							<ButtonIcon custom={`px-1 py-1 ml-6 mr-1  ${openAccount ? "rotate-90" : "rotate-180"}`} width="w-8" height="h-8" fontSize="text-sm">
								<ChevronUp />
							</ButtonIcon>
						</div>
						<div className={`flex flex-col items-center w-full min-w-max transition-all ease-in duration-300 ${!openAccount ? "max-h-0 overflow-hidden" : "max-h-full py-5"}`}>
							<div className="relative inline-block h-12 w-12 rounded-full select-none">
								<Avatar user={user} />
							</div>
							{!user ? (
								<div className="w-full mt-3 flex flex-nowrap">
									<button
										onClick={e => {
											e.preventDefault();
											setShow(false);
											setChoiceFormLoginOrRegister("login");

											setShowFormLoginOrRegister(true);
										}}
										className="w-1/2 font-semibold py-2">
										Đăng nhập
									</button>
									<button
										onClick={e => {
											e.preventDefault();
											setShow(false);
											setChoiceFormLoginOrRegister("register");
											setShowFormLoginOrRegister(true);
										}}
										className="w-1/2 font-semibold py-2">
										Đăng kí
									</button>
								</div>
							) : (
								<div className="flex mt-2 flex-col w-full">
									{[
										{ icon: <Person />, label: "Tài khoản", href: "/tai-khoan" },
										{ icon: <Bag />, label: "Giỏ hàng", href: "/gio-hang" },
										{ icon: <ArrowCounterclockwise />, label: "Lịch sử mua hàng", href: "/lich-su-mua-hang" },
										{ icon: <BoxArrowLeft />, label: "Đăng xuất", href: "/" },
									].map((itemAccount, id) => {
										return (
											<Link key={id} href={itemAccount.href}>
												<a className="block text-lg font-semibold py-2 px-2 hover:bg-gray-300">
													<div className="flex items-center flex-nowrap">
														{itemAccount.icon}
														<span className="ml-4">{itemAccount.label}</span>
													</div>
												</a>
											</Link>
										);
									})}
								</div>
							)}
						</div>
					</li>
					{listMenu.map((item, key) => {
						return (
							<li key={key} className="transition-all ease-in duration-300">
								<div className="flex flex-nowrap items-center justify-between border-b-[1px] border-gray-200">
									<Link href={item.href}>
										<a className="max-w-max py-4 pl-4 font-semibold" title={item.title}>
											{item.title}
										</a>
									</Link>
									<ButtonIcon
										onClick={() => {
											setOpenTab({
												...openTab,
												[key]: !openTab[key],
											});
										}}
										custom={`px-1 py-1 ml-6 mr-1  ${openTab[key] ? "rotate-90" : "rotate-180"}`}
										width="w-8"
										height="h-8"
										fontSize="text-sm">
										<ChevronUp />
									</ButtonIcon>
								</div>
								<div className={`transition-all ease-in duration-300 text-base ${!openTab[key] ? "max-h-0 overflow-hidden" : "max-h-full"} `}>
									{item.items.map((item2, key2) => (
										<Link href={item2.href} key={key2}>
											<a className="block pl-10  py-2 border-b-[1px] border-gray-200 hover:bg-gray-300" title={item2.title}>
												{item2.title}
											</a>
										</Link>
									))}
								</div>
							</li>
						);
					})}
					<li>
						<Link href="/">
							<a className="block pl-4 text-lg font-semibold py-4 border-b-[1px] border-gray-200 hover:bg-gray-300">
								<div className="flex items-center flex-nowrap">
									<Newspaper />
									<span className="ml-5">Tin tức</span>
								</div>
							</a>
						</Link>
					</li>
					<li>
						<Link href="/">
							<a className="block pl-4 text-lg font-semibold py-4 border-b-[1px] border-gray-200 hover:bg-gray-300">
								<div className="flex items-center flex-nowrap">
									<Newspaper />
									<span className="ml-5">Cập nhât mới</span>
								</div>
							</a>
						</Link>
					</li>
					<li className="flex flex-col py-2">
						<span className="pl-4 text-sm">HotLine</span>
						<Link href="tel:123456789">
							<a className="block pl-4 text-lg font-semibold py-1 border-gray-200 ">123.456.789</a>
						</Link>
					</li>
					<li className="flex flex-nowrap justify-center items-center py-2">
						{[
							{
								label: "Facebook",
								icon: <Facebook />,
							},
							{
								label: "Youtube",
								icon: <Youtube />,
							},
							{
								label: "Instagram",
								icon: <Instagram />,
							},
						].map((itemSocial, id) => (
							<Link href="/" key={id}>
								<a title={itemSocial.label} className="mx-4 text-3xl rounded-lg overflow-hidden font-semibold border-gray-200 bg-primaryDark">
									{itemSocial.icon}
								</a>
							</Link>
						))}
					</li>
				</ul>
				<div
					className="w-3/12 h-full bg-transparent"
					onClick={() => {
						setShow(false);
					}}></div>
			</div>
			<DialogModal zIndex="z-30" show={show && tripgerScreen} />
		</>
	);
}

export default MenuMobile;
