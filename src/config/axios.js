import axios from "axios";
import { serverApi } from "./constrant";

const instance = axios.create({
	baseURL: serverApi,
	withCredentials: true,
	headers: {
		"Access-Control-Allow-Origin": "*",
	},
});

export default instance;
