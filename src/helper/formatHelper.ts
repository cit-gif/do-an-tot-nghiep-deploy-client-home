import { serverApi } from "@src/config/config";

export const formatUrlForImage = (url = "" || {}) => {
	if (typeof url === "object") {
		return url;
	}
	if (typeof url === "string" && url.startsWith("data:image")) return url;
	return `${serverApi}${url}`;
};
