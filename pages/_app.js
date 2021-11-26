import "styles/globals.css";
// import "@material-tailwind/react/tailwind.css";
import "nprogress/nprogress.css";
// import "swiper/swiper-bundle.css";
import NextNProgress from "nextjs-progressbar";

// import Head from "next/head";
// import dynamic from "next/dynamic";
import HeaderApp from "@src/components/HeaderApp";
import FooterApp from "@src/components/FooterApp";
import { ContextProvider } from "@src/context";
import { useEffect, useState } from "react";

import App from "next/app";
import axios from "@src/config/axios";
import CustomSnackbarProvider from "@src/components/CustomSnackbarProvider";
import * as React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { store } from "@src/app/store";
import DefaultLayout from "@src/layouts/Default";
function MyApp({ Component, pageProps }) {
	// useEffect(() => {
	// 	if ("serviceWorker" in navigator) {
	// 		window.addEventListener("load", function () {
	// 			navigator.serviceWorker.register("/sw.js").then(
	// 				function (registration) {
	// 					console.log("Service Worker registration successful with scope: ", registration.scope);
	// 				},
	// 				function (err) {
	// 					console.log("Service Worker registration failed: ", err);
	// 				}
	// 			);
	// 		});
	// 	}
	// }, []);
	useEffect(() => {
		// const browser = browser || chrome;
		// console.log(browser.cookie);
		// browser.cookies.onChanged.addListener(function (changeInfo) {
		// 	console.log("Cookie changed: " + "\n * Cookie: " + JSON.stringify(changeInfo.cookie) + "\n * Cause: " + changeInfo.cause + "\n * Removed: " + changeInfo.removed);
		// });
	}, []);
	const [user, setUser] = useState(pageProps.user);
	const [loadCart, setLoadCart] = useState(pageProps.loadCartServer);

	return (
		<Provider store={store}>
			{/* <Head>
				<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
				<link rel="manifest" href="/site.webmanifest"></link>
				<title>Phone X</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head> */}
			<CustomSnackbarProvider>
				<ContextProvider user={user} setUser={setUser} loadCart={loadCart} setLoadCart={setLoadCart}>
					{/* progress bar */}
					<NextNProgress color="#29D" startPosition={0.3} stopDelayMs={200} height={3} showOnShallow={true} options={{ easing: "ease", speed: 500 }} />
					<DefaultLayout>
						<Component {...pageProps} />
					</DefaultLayout>
				</ContextProvider>
			</CustomSnackbarProvider>
		</Provider>
	);
}
//load cart if url = /gio hang
const getCart = async accessToken => {
	const data = {};
	data.check = true;
	try {
		const res = await axios.post("/api/user/cart", { accessToken: accessToken });
		data.data = res.data;
	} catch (err) {
		// console.log(err.response.data);
		data.check = false;
	}
	return data;
};
//login serverSide
const getLogin = async accessToken => {
	const data = {};
	data.check = true;
	try {
		const res = await axios.post("/api/user", { accessToken: accessToken });
		data.data = res.data;
	} catch (err) {
		// console.log(err.response.data);
		data.check = false;
	}
	return data;
};
MyApp.getInitialProps = async appContext => {
	// ctx.req.headers.cookie;
	// console.log(appContext.ctx.req.headers.cookie);
	// console.log(appContext.ctx.req.cookies.accessToken);
	const cookie = appContext?.ctx?.req?.cookies?.accessToken;
	const url = appContext?.ctx?.req?.url;
	const accessToken = cookie;
	// console.log(cookie);
	if (!accessToken || accessToken == "") {
		const appProps = await App.getInitialProps(appContext);
		appProps.pageProps.user = null;
		return {
			...appProps,
		};
	}
	const user = await getLogin(accessToken);
	let cartInitProps = [];
	let loadCartServer = false;
	//muốn khi vào trang giỏ hàng thì server side giỏ hàng .
	//còn những trang khác thì  load ở client
	const listUrl = ["/gio-hang", "/dat-hang"];
	if (user.check == true && listUrl.includes(url)) {
		const cart = await getCart(accessToken);
		if (cart.check == true) {
			cartInitProps = cart.data;
			loadCartServer = true;
		}
	}
	const appProps = await App.getInitialProps(appContext);

	// console.log(user);
	if (user.check === false) {
		appProps.pageProps.user = null;
		appProps.pageProps.loadCartServer = loadCartServer;
	} else {
		appProps.pageProps.user = user.data;
		appProps.pageProps.user.Cart = cartInitProps; //set arry cho cart/ để clieent load
		appProps.pageProps.loadCartServer = loadCartServer;
	}
	return {
		...appProps,
	};
};
export default MyApp;
