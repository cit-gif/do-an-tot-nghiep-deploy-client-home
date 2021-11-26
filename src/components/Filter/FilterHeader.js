import { Funnel, ListUl, Grid } from "react-bootstrap-icons";
import ButtonIcon from "../common/ButtonIcon";
import ButtonWhite from "../common/ButtonWhite";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import CallApi from "@src/config/axios";
import { limit_product_in_search } from "@src/config/constrant";
const TitileCountNumber = props => {
	const { metaData, countArrayProduct } = props;
	const startPage = (() => {
		return metaData[0].Skip + 1;
	})();
	const endPage = (() => {
		return metaData[0].Skip + countArrayProduct;
	})();
	return (
		<>
			<span className=" font-medium mr-1">
				{startPage}-{endPage}
			</span>
			<span>trên {metaData[0].CountProduct} sản phẩm</span>
		</>
	);
};
function FilterHeader(props) {
	const { setView, view, setProducts, metaData, countArrayProduct, setShowSlideBarFilter, countFilter } = props;
	const router = useRouter();
	const sortQuery = router.query.sort || "priceUp";
	const ArrayValueSort = [
		{ label: "Giá tăng dần", value: "priceUp" },
		{ label: "Giá giảm dần", value: "priceDown" },
		{ label: "Tên từ A-Z", value: "AZ" },
		{ label: "Tên từ Z-A", value: "ZA" },
	];
	const handleSetViewList = () => {
		const urlSearchParams = new URLSearchParams(window.location.search);
		const query = Object.fromEntries(urlSearchParams.entries());
		const pathname = router.pathname;
		setView("list");
		router.push(
			pathname,
			{
				query: { ...query, view: "list" },
			},
			{ shallow: true }
		);
	};
	const indexOfSort = ArrayValueSort.indexOf(sortQuery);
	let selectValue, setValue;
	if (indexOfSort >= 0) {
		[selectValue, setValue] = useState(ArrayValueSort[indexOfSort]);
	} else {
		[selectValue, setValue] = useState(ArrayValueSort[0]);
	}

	const handleSetViewGird = () => {
		const urlSearchParams = new URLSearchParams(window.location.search);
		const query = Object.fromEntries(urlSearchParams.entries());
		const pathname = router.pathname;
		setView("gird");
		router.push(
			pathname,
			{
				query: { ...query, view: "gird" },
			},
			{ shallow: true }
		);
	};
	const [load, setLoad] = useState(false);
	useEffect(() => {
		const cancelTokenSource = axios.CancelToken.source();
		const getDataSort = async () => {
			if (load) {
				try {
					const urlSearchParams = new URLSearchParams(window.location.search);
					const query = Object.fromEntries(urlSearchParams.entries());
					const res = await CallApi.get("/api/public/search", {
						cancelToken: cancelTokenSource.token,
						params: {
							...query,
							limit: limit_product_in_search,
							sort: selectValue,
						},
					});
					setProducts(res.data);
					router.push(
						router.pathname,
						{
							query: {
								...query,
								limit: limit_product_in_search,
								sort: selectValue,
							},
						},
						{ shallow: true }
					);
				} catch (error) {
					window.location.reload();
				}
			}
		};
		getDataSort();
		return () => cancelTokenSource.cancel();
	}, [selectValue]);
	useEffect(() => {
		setLoad(true);
	}, []);
	return (
		<div className="flex items-center flex-wrap md:space-y-4 sm:space-y-4 xs:space-y-4">
			<div className="flex flex-wrap items-center w-2/12 space-y-2 md:w-full sm:w-full xs:w-full">
				<div className="flex items-center text-sm">
					{metaData.length > 0 ? (
						<TitileCountNumber metaData={metaData} countArrayProduct={countArrayProduct} />
					) : (
						<>
							<span className=" font-medium mr-1">0</span>
							<span>trên 0 sản phẩm</span>
						</>
					)}
				</div>
				<div className="hidden md:w-full md:block sm:w-full sm:block xs:block xs:w-full">
					<ButtonWhite
						onClick={() => {
							setShowSlideBarFilter(false);
						}}
						padding="px-4 py-0"
						iconStart={<Funnel />}
						title="Lọc"
						iconEnd={<span className="text-secondary text-base">({countFilter})</span>}
					/>
				</div>
			</div>

			<div className="flex items-center justify-between w-10/12  md:w-full sm:w-full xs:w-full">
				<div className="flex items-center">
					<span className="mr-2">Sắp xếp theo</span>
					<select
						onChange={e => {
							setValue(e.target.value);
						}}
						value={selectValue}
						className="block w-36 text-gray-700 py-1 px-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
						{ArrayValueSort.map((item, key) => {
							return (
								<option value={item.value} key={key}>
									{item.label}
								</option>
							);
						})}
					</select>
				</div>
				<div className="flex space-x-1">
					<ButtonIcon background_color={view !== "gird" ? "bg-gray-50" : ""} text_color={view !== "gird" ? "text-primary" : "text-black"} onClick={handleSetViewList}>
						<ListUl />
					</ButtonIcon>
					<ButtonIcon background_color={view === "gird" ? "bg-gray-50" : ""} text_color={view === "gird" ? "text-primary" : "text-black"} onClick={handleSetViewGird}>
						<Grid />
					</ButtonIcon>
				</div>
			</div>
		</div>
	);
}

export default FilterHeader;
