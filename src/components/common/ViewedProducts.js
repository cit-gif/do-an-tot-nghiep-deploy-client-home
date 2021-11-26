import React, { useEffect } from "react";
import axios from "@src/config/axios";
import TitleCate from "@src/components/common/TitleCate";
import { useAppDispatch, useAppSelector } from "@src/app/hooks";
import SwiperProduct from "./SwiperProduct";
import { productReducerActions } from "@src/features/product";
export default function ViewedProducts() {
	const productViewedState = useAppSelector(state => state.product.productsViewed);
	const dispatch = useAppDispatch();
	useEffect(() => {
		//lấy danh sách sản phẩm đã xem
		// là 1 chuoix id
		const getProductsViewed = async () => {
			try {
				let productsViewed = JSON.parse(localStorage.getItem("productsViewed"));

				if (Array.isArray(productsViewed) && productsViewed.length > 0) {
					// tối da lấy 50 sản phẩm đã xem
					if (productsViewed.length > 50 > 50) {
						// nếu nhiều hơn 50 phần tử thì cắt bớt và lưu lại
						productsViewed.slice(-50);
						localStorage.set("productsViewed", JSON.stringify(productsViewed));
					}
					const res = await axios.post("/api/products/productviewed", productsViewed, {
						headers: {
							"Content-Type": "application/json",
						},
					});
					// dispatch reudux
					if (Array.isArray(res.data) && productViewedState) {
						dispatch(productReducerActions.setProductViewed(res.data));
					}
				}
			} catch (error) {
				console.log(error);
			}
		};
		getProductsViewed();
	}, []);

	if (productViewedState.length == 0) return null;
	return (
		<div className="container mx-auto">
			<TitleCate title="Sản phẩm đã xem" />
			{productViewedState.length !== 0 && <SwiperProduct products={[...productViewedState]} />}
		</div>
	);
}
