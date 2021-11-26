import TitleCate from "@src/components/common/TitleCate";
import SwiperProduct from "@src/components/common/SwiperProduct";
import ButtonWhite from "@src/components/common/ButtonWhite";
import { limit_product_in_search } from "@src/config/constrant";
function FeaturedPhone(props) {
	const { products } = props;

	return (
		<div className="my-8">
			<TitleCate title="Điện thoại bán chạy nhất" />
			<SwiperProduct products={products} />
			<div className="w-36 mx-auto">
				<ButtonWhite title="Xem thêm" href={`/dien-thoai?types=phone&limit=${limit_product_in_search}&page=1`} tag="a" />
			</div>
		</div>
	);
}

export default FeaturedPhone;
