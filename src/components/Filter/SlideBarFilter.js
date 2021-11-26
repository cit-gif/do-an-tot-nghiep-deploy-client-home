import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import ItemSile from "./ItemSlide";
import Badge from "./Badge";
import CallApi from "@src/config/axios";
import axios from "axios";
import { limit_product_in_search } from "@src/config/constrant";
const setStateFromUrl = (query, defaultData) => {
	if (query) {
		const arrayCheck = query.split(".");
		let newData = defaultData.data;
		const arrayData = newData.map(({ value }) => value);
		for (const item of arrayCheck) {
			const indexOf = arrayData.indexOf(item);
			if (indexOf >= 0) {
				newData[indexOf].checked = true;
			}
		}
		return { title: defaultData.title, data: newData };
	}
	return defaultData;
};
const defaultBrand = {
	title: "Thương hiệu",
	data: [
		{ label: "Xiaomi", checked: false, value: "Xiaomi" },
		{ label: "SamSung", checked: false, value: "SamSung" },
		{ label: "Apple", checked: false, value: "Apple" },
		{ label: "Vivo", checked: false, value: "Vivo" },
		{ label: "Oppo", checked: false, value: "Oppo" },
	],
};
const defaultType = {
	title: "Loại sản phẩm",
	data: [
		{ label: "Điện thoại", checked: false, value: "phone" },
		{ label: "Tablet", checked: false, value: "tablet" },
	],
};
const defaultMemory = {
	title: "Bộ nhớ trong",
	data: [
		{ label: "16 GB", checked: false, value: "16 GB" },
		{ label: "32 GB", checked: false, value: "32 GB" },
		{ label: "64 GB", checked: false, value: "64 GB" },
		{ label: "128 GB", checked: false, value: "128 GB" },
		{ label: "256 GB", checked: false, value: "256 GB" },
		{ label: "512 GB", checked: false, value: "512 GB" },
		{ label: "1 TB", checked: false, value: "1 TB" },
	],
};
const defaultRam = {
	title: "RAM",
	data: [
		{ label: "1 GB", checked: false, value: "1 GB" },
		{ label: "2 GB", checked: false, value: "2 GB" },
		{ label: "3 GB", checked: false, value: "3 GB" },
		{ label: "4 GB", checked: false, value: "4 GB" },
		{ label: "6 GB", checked: false, value: "6 GB" },
		{ label: "8 GB", checked: false, value: "8 GB" },
		{ label: "12 TB", checked: false, value: "12 GB" },
		{ label: "14 TB", checked: false, value: "14 GB" },
		{ label: "16 TB", checked: false, value: "16 GB" },
	],
};
const defaultPrice = {
	title: "Khoảng giá",
	data: [
		{ label: "Dưới 1 triệu", checked: false, value: "0-999999" },
		{ label: "1 triệu đến 5 triệu", checked: false, value: "1000000-5000000" },
		{ label: "5 triệu đến 10 triệu", checked: false, value: "5000000-10000000" },
		{ label: "10 triệu đến 15 triệu", checked: false, value: "10000000-15000000" },
		{ label: "15 đến 20 triệu", checked: false, value: "15000000-20000000" },
		{ label: "Trên 20 triệu", checked: false, value: "20000001-99999999999" },
	],
};
const defaultSale = {
	title: "Có khuyến mại",
	data: [{ label: "Có khuyến mại", checked: false, value: "true" }],
};
// const defaultDataFilter = {
// 	brands:
// }
function SlideBarFilter(props) {
	const router = useRouter();
	const pathname = router.pathname;
	const { brands, types, memorys, rams, prices, sales } = router.query;

	const [brand, setBrand] = useState(setStateFromUrl(brands, defaultBrand));
	const [type, setType] = useState(setStateFromUrl(types, defaultType));
	const [memory, setMemory] = useState(setStateFromUrl(memorys, defaultMemory));
	const [ram, setRam] = useState(setStateFromUrl(rams, defaultRam));
	const [price, setPrice] = useState(setStateFromUrl(prices, defaultPrice));
	const [sale, setSale] = useState(setStateFromUrl(sales, defaultSale));
	const { setProducts, setCountFilter } = props;
	const unCheck = data => {
		const lenght = data.data.length;
		let newData = data.data;
		for (let i = 0; i < lenght; i++) {
			if (newData[i].checked) {
				newData[i].checked = false;
			}
		}
		return { title: data.title, data: newData };
	};
	// check load từ server lần đầu. lần sau mới thực hiện gọi api
	// useEffect trc thì gọi trc
	const [isload, setIsLoad] = useState(false);

	useEffect(() => {
		//active when history go back()
		const hashchange = e => {
			window.location.reload();
		};
		window.addEventListener("popstate", hashchange);
		return () => {
			window.removeEventListener("popstate", hashchange);
		};
	}, []);
	// luôn load page=1 khi fillter
	const getDataAndGetUrlFromState = async (stateData, queryKey, cancelTokenSource) => {
		const urlSearchParams = new URLSearchParams(window.location.search);
		const query = Object.fromEntries(urlSearchParams.entries());
		let arrayyChecked = [];
		stateData.data.forEach(({ value, checked }) => {
			if (checked) {
				arrayyChecked.push(value);
			}
		});
		if (arrayyChecked.length !== 0) {
			if (isload) {
				try {
					const res = await CallApi.get("/api/public/search", {
						cancelToken: cancelTokenSource.token,
						params: {
							...query,
							[queryKey]: arrayyChecked.join("."),
							limit: limit_product_in_search,
							page: 1,
						},
					});
					setProducts(res.data);
				} catch (error) {
					window.location.reload();
				}
			}
			const newQuery = {
				query: {
					...query,
					[queryKey]: arrayyChecked.join("."),
					page: 1,
					limit: limit_product_in_search,
				},
			};
			router.push(router.pathname, newQuery, { shallow: true });
		} else {
			delete query[queryKey];
			if (isload) {
				try {
					const res = await CallApi.get("/api/public/search", {
						cancelToken: cancelTokenSource.token,
						params: {
							...query,
							limit: limit_product_in_search,
							page: 1,
						},
					});

					setProducts(res.data);
				} catch (error) {
					window.location.reload();
				}
			}
			router.push(
				router.pathname,
				{
					query: {
						...query,
						page: 1,
						limit: limit_product_in_search,
					},
				},
				{ shallow: true }
			);
		}
	};

	useEffect(() => {
		const cancelTokenSource = axios.CancelToken.source();
		getDataAndGetUrlFromState(defaultBrand, "brands", cancelTokenSource);
		return () => cancelTokenSource.cancel();
	}, [brand]);

	useEffect(() => {
		const cancelTokenSource = axios.CancelToken.source();
		getDataAndGetUrlFromState(defaultType, "types", cancelTokenSource);
		return () => cancelTokenSource.cancel();
	}, [type]);
	useEffect(() => {
		const cancelTokenSource = axios.CancelToken.source();
		getDataAndGetUrlFromState(defaultMemory, "memorys", cancelTokenSource);
		return () => cancelTokenSource.cancel();
	}, [memory]);
	useEffect(() => {
		const cancelTokenSource = axios.CancelToken.source();
		getDataAndGetUrlFromState(defaultRam, "rams", cancelTokenSource);
		return () => cancelTokenSource.cancel();
	}, [ram]);
	useEffect(() => {
		const cancelTokenSource = axios.CancelToken.source();
		getDataAndGetUrlFromState(defaultPrice, "prices", cancelTokenSource);
		return () => cancelTokenSource.cancel();
	}, [price]);
	useEffect(() => {
		const cancelTokenSource = axios.CancelToken.source();
		getDataAndGetUrlFromState(defaultSale, "sales", cancelTokenSource);
		return () => cancelTokenSource.cancel();
	}, [sale]);
	// đếm xem có bao nhiêu bộ lọc
	const refFilterCount = useRef(null);
	useEffect(() => {
		setCountFilter(refFilterCount.current.children.length);
	}, [brand, type, memory, sale, price, ram]);
	useEffect(() => {
		setIsLoad(true);
	}, []);
	const cancelFilter = () => {
		window.location.href = router.pathname;
	};

	return (
		<div className="w-full flex-col flex border-t">
			<div className="w-full transition-all py-2 border-b px-2">
				<div className="w-full flex items-center justify-between cursor-pointer  font-semibold select-none">
					<span className="lg:text-sm text-lg">Bộ lọc được chọn</span>
					<span onClick={cancelFilter} className="underline text-sm font-normal">
						Bỏ lọc
					</span>
				</div>
				<div className="transition-all flex flex-wrap space-x-1" ref={refFilterCount}>
					{brand.data.map((item, key) => {
						if (item.checked === true) {
							return <Badge data={item} currentData={brand} index={key} key={key} setData={setBrand} />;
						}
						return null;
					})}
					{type.data.map((item, key) => {
						if (item.checked === true) {
							return <Badge data={item} currentData={type} index={key} key={key} setData={setType} />;
						}
						return null;
					})}
					{memory.data.map((item, key) => {
						if (item.checked === true) {
							return <Badge data={item} currentData={memory} index={key} key={key} setData={setMemory} />;
						}
						return null;
					})}
					{ram.data.map((item, key) => {
						if (item.checked === true) {
							return <Badge data={item} currentData={ram} index={key} key={key} setData={setRam} />;
						}
						return null;
					})}
					{price.data.map((item, key) => {
						if (item.checked === true) {
							return <Badge data={item} currentData={price} index={key} key={key} setData={setPrice} />;
						}
						return null;
					})}
					{sale.data.map((item, key) => {
						if (item.checked === true) {
							return <Badge data={item} currentData={sale} index={key} key={key} setData={setSale} />;
						}
						return null;
					})}
				</div>
			</div>
			<ItemSile data={brand} setData={setBrand} />
			<ItemSile data={type} setData={setType} />
			<ItemSile data={memory} setData={setMemory} />
			<ItemSile data={ram} setData={setRam} />
			<ItemSile data={price} setData={setPrice} />
			<ItemSile data={sale} setData={setSale} />
		</div>
	);
}

export default SlideBarFilter;
