import TitleCate from "../common/TitleCate";
import FilterHeader from "./FilterHeader";
import SlideBarFilter from "./SlideBarFIlter";
import ContainerPropduct from "@src/components/common/ContainerPropduct";
import PaginationNotLink from "@src/components/common/Pagination/PaginationNotLink";
import { limit_product_in_search } from "@src/config/constrant";
import axios from "@src/config/axios";
import { useState } from "react";
import useMediaQuery from "@src/customhook/useMediaQuery";
function Fillter(props) {
	// const { Tag} = props;
	const { arrayProducts, setProducts, view, setView, metaData } = props;
	const getData = async page => {
		try {
			const urlSearchParams = new URLSearchParams(window.location.search);
			const query = Object.fromEntries(urlSearchParams.entries());
			const res = await axios.get("/api/public/search", {
				params: {
					...query,
					limit: limit_product_in_search,
					page: page,
				},
			});
			setProducts(res.data);
		} catch (error) {
			window.location.reload();
		}
	};
	const [showSlideBarFilter, setShowSlideBarFilter] = useState(true);
	const matchesMediaQuery = useMediaQuery("(max-width: 991px)");
	// đếm xem có bao nhiêu bộ lọc
	const [countFilter, setCountFilter] = useState(0);
	return (
		<div className="my-12  container mx-auto">
			<TitleCate>Điện thoại</TitleCate>
			<FilterHeader countFilter={countFilter} setShowSlideBarFilter={setShowSlideBarFilter} setView={setView} view={view} setProducts={setProducts} metaData={metaData} countArrayProduct={arrayProducts.length} />
			<div className="w-full flex flex-wrap">
				<div className={`${showSlideBarFilter && matchesMediaQuery ? "hidden invisible" : ""} w-2/12 md:w-full sm:w-full xs:w-full md:py-8 sm:py-8 xs:py-8 md:fixed sm:fixed xs:fixed md:inset-0 sm:inset-0 xs:inset-0 bg-white md:z-50 sm:z-50 xs:z-50 md:overflow-y-auto sm:overflow-y-auto xs:overflow-y-auto`}>
					<button
						onClick={() => {
							// ở đây hơi mông lung
							/// set show true mà đóng ;V
							setShowSlideBarFilter(true);
						}}
						className="hidden md:block sm:block xs:block outline-none bg-primary active:bg-primaryDark transition-all text-white text-center leading-8 h-8 w-full my-2 shadow-md">
						Đóng
					</button>
					<SlideBarFilter setProducts={setProducts} setCountFilter={setCountFilter} />
				</div>
				<div className="w-10/12 md:w-full sm:w-full xs:w-full">
					{arrayProducts.length !== 0 ? (
						<ContainerPropduct inFilter={true} products={arrayProducts} view={view} />
					) : (
						<div className="h-full w-full flex items-center justify-center">
							<span className="text-xl font-semibold">Không tìm thấy kết quả</span>
						</div>
					)}
				</div>
			</div>
			{metaData.length > 0 && (
				<div className="w-full flex items-center justify-center flex-wrap my-6">
					<PaginationNotLink queryKey="page" totalCount={metaData[0].CountProduct} currentPage={metaData[0].CurrentPage} pageSize={limit_product_in_search} handler={getData} />
				</div>
			)}
		</div>
	);
}

export default Fillter;
