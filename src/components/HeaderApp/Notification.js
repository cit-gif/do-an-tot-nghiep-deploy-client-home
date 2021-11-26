import ButtonIcon from "@src/components/common/ButtonIcon";
import Dropdown from "@src/components/common/Dropdown";
import { Bell } from "react-bootstrap-icons";

import { useState, useEffect } from "react";
import { useContext } from "react";
import { AppContext } from "@src/context";
import Image from "next/image";
// import innerHeight from "ios-inner-height";
import { serverApi, qualityImage } from "@src/config/constrant";
import formatCurency from "@src/helper/FormatCurency";
import Link from "next/link";
function Notification() {
	const [notification, setNotification] = useState([]);
	useEffect(() => {
		const getNotification = () => {
			return [
				{ Name: "ip 12 pro max 512g xanh adas", Amount: 1, Price: 1230000, LinkProduct: "/admin.png" },
				{ Name: "ip 12 pro max 512g xanh adas", Amount: 1, Price: 1230000, LinkProduct: "/user.png" },
				{ Name: "ip 12 pro max 512g xanh adas", Amount: 1, Price: 1230000, LinkProduct: "/user.png" },
				{ Name: "ip 12 pro max 512g xanh adas", Amount: 1, Price: 1230000, LinkProduct: "/user.png" },
			];
		};
		setNotification(getNotification());
	}, []);
	return null;

	return (
		<div className="inline-block mx-5 xxl:mx-3 lg:mx-2 md:mx-1">
			<Dropdown
				direction="center-down"
				relative={
					<ButtonIcon fontSize="text-2xl">
						<Bell />
					</ButtonIcon>
				}
				absolute={
					<ul className="m-0 p-0 flex items-center flex-col">
						{false ? (
							<li>dsa</li>
						) : (
							<li className="w-64 flex items-center justify-center">
								<span>Giỏ hàng trống</span>
							</li>
						)}
					</ul>
				}
			/>
		</div>
	);
}

export default Notification;
