import React, { createContext, useState, useRef, useEffect } from "react";
const AppContext = createContext();
import { io } from "socket.io-client";
import { useRouter } from "next/router";
// import cookieCutter from "cookie-cutter";
import { getCookie } from "@src/helper/helpCookie";
import callApi from "../config/axios";
import axios from "axios";
import { serverApi } from "@src/config/config";
// import { io } from "socket.io-client";
// import { serverApi } from "../../../constants/global";
// const socket = io(serverApi);

const ContextProvider = props => {
	const router = useRouter();
	const { children, user, setUser, loadCart, setLoadCart } = props;

	const [choiceFormLoginOrRegister, setChoiceFormLoginOrRegister] = useState("login");
	const [showFormLoginOrRegister, setShowFormLoginOrRegister] = useState(false);
	// const [user, setUser] = useState(null);
	const [messShow, setMessShow] = useState(false);
	//get query from url
	const search_Input_From_Url = router.pathname == "/tim-kiem" && router.query.search ? router.query.search : "";
	const [searchInput, setSearchInput] = useState(search_Input_From_Url);

	const [socket, setSocket] = useState(null);
	const [messages, setMessages] = useState([]);
	const [admin, setAdmin] = useState(null);
	// kiểm tra xem có phải admin ko
	// vì cookie đc chia sẽ cả hai app
	const getAdmin = async (accessTokenAdmin, cancelTokenSource) => {
		try {
			const res = await callApi.post(
				"/api/admin",
				{},
				{
					headers: {
						"Content-Type": "application/json",
						authorization: accessTokenAdmin,
					},
					cancelToken: cancelTokenSource.token,
				}
			);
			setAdmin(res.data);
		} catch (error) {}
	};
	useEffect(() => {
		const accessTokenAdmin = getCookie("accessTokenAdmin");
		if (!accessTokenAdmin || accessTokenAdmin === "") return;
		const cancelTokenSource = axios.CancelToken.source();
		getAdmin(accessTokenAdmin, cancelTokenSource);
		return () => {
			cancelTokenSource.cancel();
		};
	}, []);

	useEffect(() => {
		//socket chỉ kết nối khi  có user và chưa có socket ;
		if (!user) return;
		if (socket) return;
		const accessToken = getCookie("accessToken");
		if (accessToken && accessToken !== "") {
			const newSocket = io(`${serverApi}/chat`, {
				path: "/socket.io",
				auth: {
					accessToken: accessToken,
				},
			});
			setSocket(newSocket);
		}

		return () => {
			if (!user && socket) {
				socket.close();
			}
		};
	}, [user]);

	return (
		<AppContext.Provider
			value={{
				choiceFormLoginOrRegister,
				setChoiceFormLoginOrRegister,
				showFormLoginOrRegister,
				setShowFormLoginOrRegister,
				user,
				setUser,

				messShow,
				setMessShow,
				// redirecNonLogin,
				searchInput,
				setSearchInput,
				loadCart,
				setLoadCart,
				socket,
				messages,
				setMessages,
				admin,
			}}>
			{children}
		</AppContext.Provider>
	);
};

export { ContextProvider, AppContext };
