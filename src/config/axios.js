import axios from "axios";
import { serverApi } from "./constrant";

const instance = axios.create({
	baseURL: serverApi,
	withCredentials: true,
});

export default instance;
