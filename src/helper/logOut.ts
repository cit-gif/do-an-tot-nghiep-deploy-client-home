import { setCookie } from "./helpCookie";

export const logOutUser = () => {
	if (typeof window !== "undefined") {
		setCookie("accessToken", "");
		window.location.href = "/";
	}
};
export const logOutAdmin = () => {
	if (typeof window !== "undefined") {
		setCookie("accessTokenAdmin", "");
		window.location.href = "/";
	}
};
