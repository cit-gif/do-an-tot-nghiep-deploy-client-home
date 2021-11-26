import ButtonIcon from "@src/components/common/ButtonIcon";
import Dropdown from "@src/components/common/Dropdown";
import { Person, BoxArrowLeft, ArrowCounterclockwise, Bag } from "react-bootstrap-icons";

import { useState } from "react";
import { useContext } from "react";
import { AppContext } from "@src/context";
import Link from "next/link";
import Image from "next/image";
import { serverApi, qualityImage } from "@src/config/constrant";
import { logOutUser } from "@src/helper/logOut";
const Avatar = props => {
	const { user } = props;
	if (!user) {
		return (
			<button className="btn btn-ghost btn-circle text-2xl" aria-label="user">
				<Person />
			</button>
		);
		return (
			<ButtonIcon fontSize="text-2xl">
				<Person />
			</ButtonIcon>
		);
	}
	if (user.Avatar == "") {
		return (
			<ButtonIcon fontSize="text-2xl" custom="bg-primary text-white" hover="hover:bg-primaryDark">
				<span className="text-white">{user.Name.split(" ").pop()}</span>
			</ButtonIcon>
		);
	}
	if (user.Avatar != "" && user.Avatar) {
		return (
			<ButtonIcon fontSize="text-2xl" custom="bg-primary text-white relative overflow-hidden" hover="hover:bg-primaryDark">
				<Image quality={qualityImage} objectFit="fill" loading="eager" layout="fill" src={`${serverApi}/${user.Avatar}`} />
				<span className="text-white">{user.Name.split(" ").pop()}</span>
			</ButtonIcon>
		);
	}
};
function Account() {
	const [showModal, setShowModal] = useState(true);
	const { setChoiceFormLoginOrRegister, setShowFormLoginOrRegister, user } = useContext(AppContext);
	return (
		<div className="inline-block mx-5 xxl:mx-3 lg:mx-2 md:mx-1">
			<div className="dropdown dropdown-end dropdown-hover">
				<div tabIndex={0} className="btn btn-ghost btn-circle">
					<Avatar user={user} />
				</div>
				<div tabIndex="0" className="dropdown-content py-3">
					<ul className="menu shadow-dropdownAbsolute bg-base-100 rounded-box w-52">
						{!user ? (
							<>
								<li
									onClick={() => {
										setChoiceFormLoginOrRegister("login");
										setShowFormLoginOrRegister(true);
									}}>
									<a className="font-medium text-xl cursor-pointer">Đăng nhập</a>
								</li>
								<li
									className="font-medium text-xl cursor-pointer"
									onClick={() => {
										setChoiceFormLoginOrRegister("register");
										setShowFormLoginOrRegister(true);
									}}>
									<a className="font-medium text-xl cursor-pointer">Tạo tài khoản</a>
								</li>
							</>
						) : (
							[
								{ icon: <Person />, label: "Tài khoản", href: "/tai-khoan" },
								{ icon: <Bag />, label: "Giỏ hàng", href: "/gio-hang" },
								{ icon: <ArrowCounterclockwise />, label: "Lịch sử mua hàng", href: "/lich-su-mua-hang" },
								{ icon: <BoxArrowLeft />, label: "Đăng xuất", href: "/", key: "logOutUser" },
							].map((item, key) => {
								if (item.key === "logOutUser") {
									return (
										<li key={key}>
											<a
												href={item.href}
												onClick={e => {
													e.preventDefault();
													logOutUser();
												}}
												className="font-medium">
												<span className="text-xl mr-2">{item.icon}</span>
												{item.label}
											</a>
										</li>
									);
								}
								return (
									<li key={key}>
										<Link href={item.href}>
											<a className="font-medium">
												<span className="text-xl mr-2">{item.icon}</span>
												{item.label}
											</a>
										</Link>
									</li>
								);
							})
						)}
					</ul>
				</div>
			</div>
			{/* <Dropdown direction="left-down" relative={<Avatar user={user} />} absolute={<ul className="m-0 p-0 block w-full"></ul>} /> */}
		</div>
	);
}

export default Account;
