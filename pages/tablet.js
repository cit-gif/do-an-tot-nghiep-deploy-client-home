import Filter from "@src/components/Filter";
import axios from "@src/config/axios";
import { limit_product_in_search } from "@src/config/constrant";
import { useState } from "react";
function Tablet({ data }) {
	const [products, setProducts] = useState(data.data);
	const [view, setView] = useState(data.view);
	return (
		<>
			<Filter arrayProducts={products[0].Data} setProducts={setProducts} view={view} setView={setView} metaData={products[0].MetaData} />
		</>
	);
}

const getData = async query => {
	const data = {};
	data.check = true;

	try {
		const types = query.types ? query.types + ".tablet" : "tablet";
		const res = await axios.get("/api/public/search", {
			headers: { "Content-Type": "application/json" },
			params: {
				...query,
				types: types,
			},
		});
		data.data = res.data;
	} catch (error) {
		data.check = false;
	}
	return data;
};
export const getServerSideProps = async ctx => {
	const page = ctx.query.page || 1;
	const query = {
		...ctx.query,
		page,
		limit: limit_product_in_search,
	};
	const view = ctx.query.view || "gird";
	const data = await getData(query);
	data.view = view;
	if (data.check) {
		return {
			props: {
				data: data,
			},
		};
	} else {
		return {
			redirect: {
				destination: "/404",
				permanent: false,
			},
		};
	}
};

// load sản phẩm từ server và khi reload lại url thì filter vẫn giũ nguyên
/// khi load xuống client những lần lọc ở client tiếp theo sẽ ko reload hoặc router.push lại trang // muốn dùng router.push như bt thì salow:false;
// khi lui trang sẽ reload lại trang
//  sau khi xóa  bộ thì sẽ reload lại trang
export default Tablet;
