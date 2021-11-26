import Rated from "@src/components/common/Rated";
import ButtonWhite from "@src/components/common/ButtonWhite";
import TitleCate from "@src/components/common/TitleCate";
import SwiperProductImage from "@src/components/common/SwiperProductImage";
import axios from "@src/config/axios";
import Image from "next/image";
import { serverApi, qualityImage, limit_evaluate_in_product_details, limit_comment_in_product_details } from "@src/config/constrant";
import Dropdown from "@src/components/common/Dropdown";
import { InfoCircle } from "react-bootstrap-icons";
import Link from "next/link";
import FormatCurency from "@src/helper/FormatCurency";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@src/context";

import { useRouter } from "next/router";
import FormatDate from "@src/helper/FormatDate";
import Pagination from "@src/components/common/Pagination";
import Modal from "@src/components/common/Modal";
import ButtonColorMain from "@src/components/common/ButtonColorMain";
const query_pageEvaluate = "pageEvaluate";
const query_pageComment = "pageComment";
import { getCookie } from "@src/helper/helpCookie";
import classnames from "classnames";
import { useSnackbar } from "notistack";
import Textarea from "@src/components/common/Textarea";
import QuillHtmlToJsx from "@src/components/ProducLink/QuillHtmlToJsx";
import { useAppDispatch, useAppSelector } from "@src/app/hooks";
import { productReducerActions } from "@src/features/product";
const LabelAdmin = ({ Name, Role }) => {
	return (
		<div className="flex space-x-2">
			<h3 className="flex items-center mb-1 font-semibold">{Name}</h3>
			{Role == "admin" && <span className="px-1 py-1 font-medium text-xs bg-gray-300 rounded-lg">Admin</span>}
		</div>
	);
};
const ReplyCommentItem = props => {
	const { Name, Avatar, ReplyContent, ReplyTime, Role, _id } = props.data;
	const { setReplyActive, replyActive, Id_Product, Id_Comment } = props;
	// const {} = props.metadata;
	return (
		<div className="relative flex my-4">
			<div className="rounded-full overflow-hidden w-16 h-16 mr-3 select-none">
				{Avatar[0] == "" ? (
					<div className="w-full h-full flex items-center bg-primary justify-center">
						<span className="text-white">{Name[0].split(" ").pop()}</span>
					</div>
				) : (
					<div className="w-full h-full block relative">
						<Image quality={qualityImage} objectFit="fill" loading="lazy" layout="fill" alt={Name} src={`${serverApi}/${Avatar}`} />
						<span className="text-white">{Name[0]?.split(" ")?.pop()}</span>
					</div>
				)}
			</div>
			<div className="w-[calc(100%-4.2rem)]">
				<LabelAdmin Name={Name} Role={Role} />

				<p>{ReplyContent}</p>
				<div className="my-2 flex items-center">
					<button
						onClick={() => {
							setReplyActive(_id);
						}}
						className="outline-none inline-block text-primaryDark text-sm font-semibold mr-2 active:text-primary">
						Trả lời
					</button>
					<span className="text-xs text-black">{FormatDate(ReplyTime)}</span>
				</div>
				{replyActive == _id && <ReplyForm Id_Product={Id_Product} Id_Comment={Id_Comment} setReplyActive={setReplyActive} />}

				<hr />
			</div>
		</div>
	);
};

const ReplyForm = props => {
	const { Id_Product, Id_Comment, setReplyActive } = props;

	const [text, setText] = useState("");
	const { enqueueSnackbar } = useSnackbar();
	const [optionName, setOptionName] = useState("admin"); /// chọn admin hoặc user để bình luận
	const router = useRouter();
	const handleSubmitComment = async () => {
		if (text == "") {
			return enqueueSnackbar("Bạn cần nhập bình luận!", {
				variant: "warning",
				preventDuplicate: true,
			});
		}
		try {
			const accessToken = getCookie("accessToken");
			const accessTokenAdmin = getCookie("accessTokenAdmin");

			if ((accessToken == "" || !accessToken) && (!accessTokenAdmin || accessTokenAdmin == "")) {
				return enqueueSnackbar("Bạn cần đăng nhập để bình luận!", {
					variant: "error",
					preventDuplicate: true,
				});
			}
			let res;
			if (admin && optionName == "admin") {
				res = await axios.post(
					`/api/admin/addReplyComment/${Id_Product}`,
					{
						ReplyContent: text,
						Id_Comment: Id_Comment,
					},
					{
						headers: { "Content-Type": "application/json", authorization: accessTokenAdmin },
					}
				);
			} else {
				res = await axios.post(`/api/user/addReplyComment/${Id_Product}`, {
					ReplyContent: text,
					Id_Comment: Id_Comment,
					accessToken,
				});
			}

			if (res.status == 200) {
				enqueueSnackbar("Đã bình luận thành công!", {
					variant: "success",
				});
				setReplyActive(0);
				router.push(window.location.pathname + window.location.search);
			}
		} catch (err) {
			const messageFromResponse = err?.response?.data?.message;
			if (messageFromResponse)
				return enqueueSnackbar(messageFromResponse, {
					variant: "warning",
				});
			return enqueueSnackbar("Đã xảy ra lỗi. Vui lòng thử lại!", {
				variant: "warning",
			});
		}
	};

	const { admin, user } = useContext(AppContext);
	return (
		<div className="w-full my-4 flex flex-col">
			<Textarea height="h-16" placeholder="Mời bạn để lại bình luận" cols="4" value={text} onChange={e => setText(e.target.value)} />
			<div className="flex items-center gap-2 justify-end mt-2">
				{admin && (
					<div className="text-sm font-medium">
						<label className="mr-1" htmlFor="optionUser">
							Chọn tên:
						</label>
						<select className="select select-bordered select-primary select-xs" id="optionUser" value={optionName} onChange={e => setOptionName(e.target.value)}>
							<option value="admin">Admin : {admin.DisplayName}</option>
							{user && <option value="user">User : {user.Name}</option>}
						</select>
					</div>
				)}
				<ButtonColorMain onClick={handleSubmitComment} padding="px-4 py-2 xs:px-6">
					Gửi
				</ButtonColorMain>
			</div>
		</div>
	);
};
const CommentItem = props => {
	const { Name, Avatar, CommentContent, Time, Reply, Role, _id, ReplyIsEmpty } = props.data;
	const { setReplyActive, replyActive, Id_Product } = props;

	// const {} = props.metadata;
	return (
		<div className="relative flex mb-8">
			<div className="rounded-full overflow-hidden w-16 h-16 mr-3 select-none">
				{Avatar[0] == "" ? (
					<div className="w-full h-full flex items-center bg-primary justify-center">
						<span className="text-white">{Name[0].split(" ").pop()}</span>
					</div>
				) : (
					<div className="w-full h-full block relative">
						<Image quality={qualityImage} objectFit="fill" loading="lazy" layout="fill" alt={Name} src={`${serverApi}/${Avatar}`} />
						<span className="text-white">{Name[0]?.split(" ")?.pop()}</span>
					</div>
				)}
			</div>
			<div className="w-[calc(100%-4.2rem)] pb-4 border-b-[1px]">
				<LabelAdmin Name={Name} Role={Role} />

				<p>{CommentContent}</p>
				<div className="mt-2 flex items-center mb-4">
					<button
						onClick={() => {
							setReplyActive(_id);
						}}
						className="outline-none inline-block text-primaryDark text-sm font-semibold mr-2 active:text-primary">
						Trả lời
					</button>

					<span className="text-xs text-black">{FormatDate(Time)}</span>
				</div>
				{replyActive == _id && <ReplyForm Id_Product={Id_Product} Id_Comment={_id} setReplyActive={setReplyActive} />}

				<hr />
				{ReplyIsEmpty == false &&
					Reply.map((data, key) => {
						return <ReplyCommentItem data={data} key={key} replyActive={replyActive} setReplyActive={setReplyActive} Id_Comment={_id} Id_Product={Id_Product} />;
					})}
			</div>
		</div>
	);
};
const Comments_JSX = props => {
	const { comment, url, currentPageComment, currentPageEvaluate, Id_Product } = props;

	const [replyActive, setReplyActive] = useState(null); // hiện form

	/// const [text, setText] = useState("");
	const [text, setText] = useState("");
	const { enqueueSnackbar } = useSnackbar();
	const router = useRouter();
	const handleSubmitComment = async () => {
		if (text == "") {
			return enqueueSnackbar("Bạn cần nhập bình luận!", {
				variant: "warning",
				preventDuplicate: true,
			});
		}

		try {
			const accessToken = getCookie("accessToken");
			if (accessToken == "") {
				return enqueueSnackbar("Bạn cần đăng nhập để bình luận!", {
					variant: "error",
					preventDuplicate: true,
				});
			}
			const res = await axios.post(`/api/user/addComment/${Id_Product}`, {
				CommentContent: text,
				accessToken,
			});

			if (res.status == 200) {
				enqueueSnackbar("Đã bình luận thành công!", {
					variant: "success",
				});
				setText("");
				router.push(window.location.pathname + window.location.search);
			}
		} catch (err) {
			return enqueueSnackbar("Đã xảy ra lỗi. Vui lòng thử lại!", {
				variant: "warning",
			});
		}
	};
	return (
		<>
			<TitleCate>
				<span>Bình luận</span> <span className="text-sm font-normal">{comment.MetaData[0]?.CountComment || 0} bình luận</span>
			</TitleCate>
			<div className="my-6">
				<h6 className="my-4 font-medium">Bình luận của bạn</h6>
				<div className="flex justify-end flex-wrap">
					<Textarea
						height="h-24"
						placeholder="Mời bạn để lại bình luận"
						cols="4"
						value={text}
						onChange={e => {
							setText(e.target.value);
						}}
					/>
					<ButtonColorMain onClick={handleSubmitComment} padding="px-4 py-2 xs:px-6">
						Gửi
					</ButtonColorMain>
				</div>

				<div className="mt-8">
					{comment?.Comment.map((data, key) => {
						return <CommentItem data={data} key={key} replyActive={replyActive} setReplyActive={setReplyActive} Id_Product={Id_Product} />;
					})}
					<Pagination url={`/${url}?${query_pageEvaluate}=${currentPageEvaluate}&${query_pageComment}=`} className="pagination-bar" currentPage={currentPageComment} totalCount={comment.MetaData[0]?.CountComment || 0} pageSize={limit_comment_in_product_details} />
				</div>
			</div>
		</>
	);
};
///////
const EvaluateItemjsx = props => {
	const { Name, Avatar, Star, ContentRated, Time } = props.data;
	// const {} = props.metadata;
	return (
		<div className="relative flex mb-8">
			<div className="rounded-full overflow-hidden w-16 h-16 mr-3 select-none">
				{Avatar[0] == "" ? (
					<div className="w-full h-full flex items-center bg-primary justify-center">
						<span className="text-white">{Name[0].split(" ").pop()}</span>
					</div>
				) : (
					<div className="w-full h-full relative block">
						<Image quality={qualityImage} objectFit="fill" loading="lazy" layout="fill" alt={Name} src={`${serverApi}/${Avatar}`} />
						<span className="text-white">{Name[0]?.split(" ")?.pop()}</span>
					</div>
				)}
			</div>
			<div className="w-[calc(100%-4.2rem)] pb-4 border-b-[1px]">
				<h3 className="flex items-center mb-1 font-semibold">
					<div className="w-32 mr-3 flex items-center">
						<span className="font-bold mr-1">{Star}</span> <Rated width="w-2/5" size="text-base" star={Math.ceil(Star)} />
					</div>
					{Name}
				</h3>
				<p>{ContentRated}</p>
				<div className="mt-2 flex items-center">
					<span className="text-xs text-black">{Time !== "Vừa xong" ? FormatDate(Time) : Time}</span>
				</div>
			</div>
		</div>
	);
};

const Section2 = props => {
	const { Describe, evaluate, currentPage, pageComment, url, Star, Id_Product, CountEvaluate, comment } = props;

	const [showModal_Evaluate, setShowModal_Evaluate] = useState(false);
	const [rated, setRated] = useState({
		Star: 0,
		ContentRated: "",
	});
	const router = useRouter();
	const { enqueueSnackbar } = useSnackbar();
	const handle_submit_evaluate = async () => {
		if (rated.ContentRated == "") {
			return enqueueSnackbar("Bạn cần nhập đánh giá!", {
				variant: "warning",
				preventDuplicate: true,
			});
		}
		try {
			const accessToken = getCookie("accessToken");
			if (accessToken == "") {
				return enqueueSnackbar("Bạn cần đăng nhập để đánh giá!", {
					variant: "error",
					preventDuplicate: true,
				});
			}
			const res = await axios.post(`/api/user/addEvaluate/${Id_Product}`, {
				...rated,
				accessToken,
			});
			if (res.status == 200) {
				setShowModal_Evaluate(false);
				enqueueSnackbar("Đã đánh giá thành công!", {
					variant: "success",
				});
				router.push(window.location.pathname + window.location.search);
			}
		} catch (err) {
			if (err?.response?.data?.message == "Bạn đã đánh giá!") {
				return enqueueSnackbar("Bạn đã đánh giá sản phẩm này", {
					variant: "warning",
					preventDuplicate: true,
				});
			}
			return enqueueSnackbar("Đã xảy ra lỗi", {
				variant: "warning",
			});
		}
	};
	return (
		<section className="min-container max-w-[810px] mx-auto">
			<div className="tong-quan">
				<div className="content-danhgia mb-10">
					<h2 className="font-primary font-bold text-[2rem] mb-4 mb-13 leading-tight">Đánh giá chi tiết</h2>

					<div className="w-full">
						<QuillHtmlToJsx html={Describe} />
						{/* {typeof Describe === "object" ? <DescribeComponent deltaOps={Describe} /> : ""} */}
					</div>
				</div>
			</div>
			<div className="border-t border-gray-100 mb-6" />
			<div className="text-sm">
				<div className="mb-12">
					<div className="flex xs:flex-col justify-between">
						<div className="vote">
							<h2 className="font-primary font-bold text-[2rem] leading-tight mb-5">
								<span>Đánh giá của khách hàng</span>
							</h2>
							<div className="flex items-center space-x-2">
								<span className="font-primary font-bold text-2rem leading-tight">5</span>
								<div className="w-32">
									<Rated star={Star} />
								</div>
								<a href="#" onClick={e => e.preventDefault()} className="underline text-sm leading-5">
									{CountEvaluate} đánh giá
								</a>
							</div>
						</div>
						{/* vietsd dánh giá */}
						<div className="inline-block xs:mt-4">
							<ButtonColorMain onClick={() => setShowModal_Evaluate(true)}>Viết đánh giá</ButtonColorMain>
						</div>
						<Modal show={showModal_Evaluate}>
							{/* <div className='w-full h-full flex items-center justify-center xs:overflow-scroll'> */}
							<div className="w-96 h-96 bg-white rounded-2xl shadow-dropdownAbsolute p-2 xs:overflow-scroll">
								<span className="flex items-center justify-center text-lg xs:text-sm font-semibold mt-2">Đánh giá của bạn về sản phẩm</span>
								<div className="w-1/2 flex items-center justify-center mx-auto my-6">
									<Rated click="true" star={rated.Star} size="text-2xl" changeClick={value => setRated({ ...rated, Star: value })} />
								</div>
								<textarea value={rated.ContentRated} onChange={e => setRated({ ...rated, ContentRated: e.target.value })} placeholder="Mời bạn để lại bình luận" className="bg-gray-100 rounded-lg focus:border-2 focus:border-primary focus:outline-none p-4 w-full h-[5rem] max-h-32 min-h-[4rem]"></textarea>
								<div className="flex items-center justify-center  flex-col space-y-4 mt-2">
									<ButtonColorMain padding="px-8 py-2 h-12" onClick={handle_submit_evaluate}>
										Gửi đánh giá
									</ButtonColorMain>
									<div className="w-1/3">
										<ButtonWhite title="Đóng" onClick={() => setShowModal_Evaluate(false)} />
									</div>
								</div>
							</div>
							{/* </div> */}
						</Modal>
					</div>
				</div>
				<div className="flex flex-col" id="box-vote">
					{/* đánh giá */}
					{evaluate.Data.map((item, key) => {
						return <EvaluateItemjsx key={key} data={item} />;
					})}
				</div>
				<Pagination startUrl={`/${url}?${query_pageEvaluate}=`} endUrl={`&${query_pageComment}=${pageComment}`} className="pagination-bar" currentPage={currentPage} totalCount={evaluate.MetaData[0].CountEvaluate} pageSize={limit_evaluate_in_product_details} />
			</div>
			<div id="box-comment" className="box-comment mt-8">
				<Comments_JSX comment={comment} url={url} Id_Product={Id_Product} currentPageComment={pageComment} currentPageEvaluate={currentPage} />
			</div>
		</section>
	);
};
const ProductOptions = props => {
	const { products, active_Id } = props;
	return (
		<>
			<div className="text-base font-semibold text-body-main leading-6">Có {products.length} cấu hình tùy chọn</div>
			{products.map((item, key) => (
				<Link href={`/${item.Path}`} key={key}>
					<a className={`relative cursor-pointer block border-2 rounded border-gray-100p-4 overflow-hidden p-1 ${active_Id == item._id ? "border-primary" : ""} `}>
						<div className="relative mb-4">
							<div className="flex-1 md:pr-5 mb-3 xs:mb-0">
								<div className="flex items-center list-label space-x-4 mb-2">
									<div className="text-xs font-semibold whitespace-nowrap leading-5 text-white bg-orange-400 py-1 px-3 flex items-center space-x-10px">{item.Information.RemainingAmount > 0 ? "Còn hàng" : "Hết hàng"}</div>
									<div className="text-lg xs:text-base h-12 font-semibold text-primaryDark leading-none flex items-center space-x-1">
										<p className="max-w-full  word-wrap-global block">{item.ProductName}</p>
									</div>
								</div>
								<div className="mb-2 flex items-center text-base font-semibold">
									<div className="relative w-[8rem] h-[8rem] md:w-[5rem] md:h-[5rem] mr-2">
										<Image quality={5} objectFit="fill" alt={item.ProductName} loading="lazy" layout="fill" src={`${serverApi}${item.Information.DisplayImage}`} />
									</div>
									<div className="w-[calc(100%-8rem)]">{item.Information.Configuration.map((info, id) => Object.values(info)[[0]] + ", ")}</div>
								</div>
								<div className="flex items-center text-base leading-6">
									<span className="mr-2">Hàng New Sealed, Nhập khẩu</span>
									<Dropdown
										relative={<InfoCircle />}
										absolute={
											<div className="bg-black text-white w-64 px-2 text-sm user-select-none">
												<p>Hàng nguyên niêm phong của nhà sản xuất, chưa mở. Tình trạng mới 100%. Phân phối bởi Phone X</p>
											</div>
										}
										background="bg-black before:bg-black"
										direction="center-up"
									/>
								</div>
							</div>
							<div className="text-sm">
								<div>
									Giá: <span className="text-red-400 font-semibold text-base">{item.Information.PriceSale > 0 ? FormatCurency(item.Information.PriceSale) : FormatCurency(item.Information.Price)}</span>
								</div>
								<strong className="line-through">{!item.Information.PriceSale > 0 ? FormatCurency(item.Information.PriceSale) : FormatCurency(item.Information.Price)}</strong>
							</div>
							<span className={`absolute bottom-1 right-6 border-2 w-5 h-5 rounded-md ${active_Id == item._id ? "bg-primaryDark" : ""}`} />
						</div>
						{/* <div className='flex items-center space-x-2 text-sm font-semibold pt-4 border-t border-solid border-brand border-opacity-20'>
							<svg xmlns='http://www.w3.org/2000/svg' className='w-5 h-5 icon icon-icons'>
								<use href='/_nuxt/9342dacb4eaef0aefc03c6d91ee1fb27.svg#i-bel' xlinkHref='/_nuxt/9342dacb4eaef0aefc03c6d91ee1fb27.svg#i-bel' />
							</svg>
							<span className='text-blue-400'>Nhận thông báo khi hàng về</span>
						</div> */}
					</a>
				</Link>
			))}
		</>
	);
};
const HeaderProduct = props => {
	const { css, ProductName, Star, CountEvaluate, CountComment } = props;
	return (
		<div className={css}>
			<h1 className="font-primary leading-tight text-4xl mb-4 font-bold">{ProductName}</h1>
			{/* <div className='text-sm font-semibold leading-5 flex items-center space-x-3 text-body-main mb-4'>
				<span>SKU: XPS930007NS</span>
			</div> */}
			<div className="flex items-center space-x-4 text-sm mb-5">
				<div className="flex items-center space-x-1">
					<span className="font-bold mr-1">{`${Star?.toFixed(1) || 0}`}</span> <Rated width="w-2/5" size="text-base" star={Math.ceil(Star || 0)} />
				</div>
				<a href="#box-vote" className="underline">
					{CountEvaluate} đánh giá
				</a>
				<a href="#box-comment" className="underline">
					{CountComment} bình luận
				</a>
			</div>
		</div>
	);
};
function LinkProduct({ data, PAGE_OF_EVALUATE, PAGE_OF_COMMENT }) {
	const { ProductName, Information, Brand, Id_Product, Describe, Star, Path, ProductType } = data.data[0];

	const images = data.data[0].Image;
	const { Configuration, Price, PriceSale, RemainingAmount, DisplayImage } = Information;
	const products_Options = data.options;
	const evaluate = data.evaluate[0];
	const comment = data.comment[0];

	const cssSectionTop = {
		left: "w-5/12 lg:w-7/12 md:w-full sm:w-full  xs:w-full",
		center: "w-3/12 lg:w-5/12 md:w-6/12 sm:w-full  xs:w-full mb-12 mt-4",
		right: "w-4/12 lg:w-7/12 md:w-6/12 sm:w-full xs:w-full",
	};
	const { enqueueSnackbar } = useSnackbar();

	// const handleClick = () => {

	// };
	const dispatch = useAppDispatch();
	const productsViewedState = useAppSelector(state => state.product.productsViewed);
	// cập nhật lượt xem
	// sản phẩm đã xem
	useEffect(() => {
		try {
			let newArrayProductsViewed = [];
			const productsViewed = JSON.parse(localStorage.getItem("productsViewed"));
			if (!productsViewed || Array.isArray(productsViewed) === false) {
				// nếu chưa có
				newArrayProductsViewed.push(Id_Product);
			} else {
				newArrayProductsViewed = [...productsViewed, Id_Product];
				newArrayProductsViewed.filter((v, i, a) => a.indexOf(v) === i); // unique array id product
			}
			localStorage.setItem("productsViewed", JSON.stringify(newArrayProductsViewed));
			// vì những trường của product details không giống vói product viewed
			//nên phải format lại
			const productDispatch = {
				BrandImage: [...data.data[0].Brand.BrandImage],
				BrandName: [...data.data[0].Brand.BrandName],
				CountEvaluate: data.data[0].CountReviews,
				DisplayImage: data.data[0].Information.DisplayImage,
				Id_Product: data.data[0].Id_Product,
				Path: data.data[0].Path,
				Price: data.data[0].Information.Price,
				PriceSale: data.data[0].Information.PriceSale,
				ProductName: data.data[0].ProductName,
				ProductType: data.data[0].ProductType,
				RemainingAmount: data.data[0].Information.RemainingAmount,
				Star: data.data[0].Star,
			};
			//kiểm tra xem trong redux có product này hay chưa
			const checkUnique = productsViewedState.findIndex(item => item.Id_Product === Id_Product);
			if (checkUnique === -1) {
				// nếu chưa có
				dispatch(productReducerActions.setProductViewed([...productsViewedState, productDispatch]));
			}
		} catch (error) {}
		// return () => {};
	}, [Id_Product]);
	// {BrandImage?: string[];
	// BrandName?: string[];
	// CountEvaluate?: number;
	// DisplayImage?: string;
	// Id_Product?: string;
	// Path?: string;
	// Price?: number;
	// PriceSale?: number;
	// ProductName?: string;
	// ProductType?: string;
	// RemainingAmount?: number;
	// Star?: number;}
	const { user, setUser } = useContext(AppContext);
	const handle_add_cart = async () => {
		try {
			const accessToken = getCookie("accessToken");
			if (accessToken == "") {
				return enqueueSnackbar("Bạn cần đăng nhập!", {
					variant: "error",
					preventDuplicate: true,
				});
			}
			const res = await axios.post(`/api/user/cart/add`, {
				Id_Product,
				accessToken,
			});
			if (res.status == 200) {
				enqueueSnackbar("Đã thêm vào giỏ hàng!", {
					variant: "success",
				});
				const currentCart = user.Cart;
				let positon_finded = -1;
				currentCart.forEach((cart, index) => {
					if (cart.Id_Product == Id_Product) {
						positon_finded = index;
						return false;
					}
				});
				if (positon_finded == -1) {
					// chưa có

					currentCart.unshift({
						Id_Product: Id_Product,
						ProductName: [ProductName],
						DisplayImage: [DisplayImage],
						Price: [Price],
						PriceSale: [PriceSale],
						Path: [Path],
						RemainingAmount: [RemainingAmount],
						Amount: res.data.Amount,
						BrandName: [[Brand.BrandName[0]]],
						BrandImage: [[Brand.BrandImage[0]]],
					});
					setUser({
						...user,
						Cart: currentCart,
					});
				} else {
					currentCart[positon_finded].Amount += 1;
					setUser({
						...user,
						Cart: currentCart,
					});
				}
			}
		} catch (err) {
			// console.log(err);
			// alert(err.response.data.message);
			return enqueueSnackbar("Đã xảy ra lỗi!", {
				variant: "error",
			});
		}
	};
	return (
		<main className="container mx-auto">
			<section className="my-16 xs:my-12 flex flex-wrap w-full">
				<div className={`${cssSectionTop.left}`}>
					<div className="w-full sticky top-0">
						<HeaderProduct Star={Star} css="hidden invisible xs:block xs:visible" ProductName={ProductName} CountEvaluate={evaluate.MetaData[0]?.CountEvaluate} CountComment={comment.MetaData[0]?.CountComment} />
						<SwiperProductImage images={images} />
					</div>
				</div>
				<div className={`${cssSectionTop.center}`}>
					<div className="flex flex-col pl-12 pr-1 xs:px-1 space-y-2 xs:space-y-1">
						<div className="flex items-center">
							<span className="text-sm mr-2 font-bold">Tình trạng:</span>
							<span className={classnames("text-lg font-bold", { "text-green-600": RemainingAmount > 0 }, { "text-gray-600": RemainingAmount <= 0 })}>{RemainingAmount > 0 ? "Còn hàng" : "Tạm hết hàng"}</span>
						</div>
						{PriceSale > 0 ? (
							<>
								<div className="flex items-center">
									<span className="text-sm mr-2 font-bold">Giá khuyến mại:</span>
									<span className="font-semibold text-red-400 text-lg">{FormatCurency(PriceSale)}</span>
								</div>
								<div className="flex items-center">
									<span className="text-sm mr-2 font-bold">Giá niêm yết:</span>
									<span className="line-through font-semibold">{FormatCurency(Price)}</span>
								</div>
								<span className="text-green-600 font-semibold">Tiết kiệm {FormatCurency(Price - PriceSale)} so với thị trường!</span>
							</>
						) : (
							<div className="flex items-center">
								<span className="text-sm mr-2 font-bold">Giá :</span>
								<span className="font-semibold text-red-400 text-lg">{FormatCurency(Price)}</span>
							</div>
						)}
						<div className="w-10/12 xs:mt-6">
							<ButtonColorMain disabled={RemainingAmount <= 0} rounded="rounded-lg" padding="px-8 py-2 h-12 mt-6" onClick={handle_add_cart}>
								Thêm vào giỏ hàng
							</ButtonColorMain>
						</div>
					</div>
				</div>
				<div className={`${cssSectionTop.right}`}>
					<HeaderProduct Star={Star} css="xs:hidden xs:invisible block visible" ProductName={ProductName} CountEvaluate={evaluate.MetaData[0]?.CountEvaluate} CountComment={comment.MetaData[0]?.CountComment} />
					<div className="flex justify-between flex-col mb-2">
						<div className="description flex-1 mb-4">
							<div className="flex items-center mb-3">
								<span>Thương hiệu:</span>
								<Link href={`/${ProductType === "phone" ? "dien-thoai" : "tablet"}?types=${ProductType}&brands=${Brand.BrandName[0]}&page=1`}>
									<a className="inline-block" title={Brand.BrandName[0]}>
										<div className="relative w-24 h-8">
											<Image quality={qualityImage} objectFit="fill" alt={Brand.BrandName[0]} loading="eager" layout="fill" src={`${serverApi}${Brand.BrandImage[0]}`} />
										</div>
									</a>
								</Link>
							</div>
							<div itemProp="description" className="pr-12">
								<ul>
									{Configuration.map((item, key) => {
										const keyOf_Item = Object.keys(item)[0];
										return (
											<li key={key}>
												<strong>{keyOf_Item}</strong>: {item[keyOf_Item]}
											</li>
										);
									})}
								</ul>
							</div>
							{/* màu sắc */}
							{/* <div className='changer_color mt-4'>
								<div>
									<strong>Màu sắc:</strong>
								</div>
								<div>Platinum Silver</div>
								<ul className='flex items-center space-x-2'>
									<li>
										<a href='#' className='inline-block align-top border-2 rounded-sm mt-1 w-10 h-10 border-brand'>
											<img src='' />
										</a>
									</li>
								</ul>
							</div> */}
						</div>
						<div>
							<div className="service text-sm text-dark-gray mb-4">
								<div className="border border-gray-100 rounded min-w-262px max-w-262px p-4">
									<div className="text-base font-semibold mb-2 leading-6">Bảo hành</div>
									<div>
										<ul>
											<li>
												Bảo hành <strong>12 tháng tại PhoneX</strong>
											</li>
											<li>Đổi mới trong 15 ngày đầu tiên</li>
										</ul>
									</div>
								</div>
							</div>
							{/* <div className='service text-sm text-dark-gray mb-4'>
								<div className='border border-gray-100 rounded min-w-262px max-w-262px p-4'>
									Giảm <span className='text-red-400 font-bold'>300.000&nbsp;₫</span> khi mua Microsoft Office 365 kèm laptop
								</div>
							</div> */}
						</div>
					</div>
					<div className="pt-22px border-t border-gray-100 space-y-2 md:space-y-4">
						<ProductOptions products={products_Options} active_Id={Id_Product} />
					</div>
				</div>
			</section>
			<Section2 Describe={Describe} comment={comment} evaluate={evaluate} currentPage={PAGE_OF_EVALUATE} pageComment={PAGE_OF_COMMENT} url={Path} Star={Star} Id_Product={Id_Product} CountEvaluate={evaluate.MetaData[0].CountEvaluate} />
		</main>
	);
}
const getData = async (product_link, pageEvaluate, pageComment) => {
	const data = {};
	data.check = true;
	try {
		const res = await axios.get("/api/public/products/" + product_link, {
			headers: { "Content-Type": "application/json" },
		});
		data.data = res.data;

		const options = await axios.get("/api/public/productoptions/" + product_link, {
			headers: { "Content-Type": "application/json" },
		});
		data.options = options.data;
		const evaluate = await axios.get(`/api/public/product/rated/${product_link}/${pageEvaluate}/${limit_evaluate_in_product_details}`, {
			headers: { "Content-Type": "application/json" },
		});
		data.evaluate = evaluate.data;
		const comment = await axios.get(`/api/public/product/comment/${product_link}/${pageComment}/${limit_comment_in_product_details}`, {
			headers: { "Content-Type": "application/json" },
		});
		data.comment = comment.data;
	} catch (error) {
		data.check = false;
	}
	return data;
};
export const getServerSideProps = async ctx => {
	const PAGE_OF_EVALUATE = parseInt(ctx.query[query_pageEvaluate]) || 1;
	const PAGE_OF_COMMENT = parseInt(ctx.query[query_pageComment]) || 1;
	const product_link = ctx.params.product_link;

	const data = await getData(product_link, PAGE_OF_EVALUATE, PAGE_OF_COMMENT);
	// nếu tông trang mà người dùng nhập vào lớn hơn tông trang của quey thì
	// if (PAGE_OF_EVALUATE > data.evaluate[0].MetaData[0].totalPage)
	// 	if (!data.check) {
	// 		return {
	// 			redirect: {
	// 				destination: "/404",
	// 				permanent: false,
	// 			},
	// 		};
	// 	}
	//nếu không tìm thấy sản phẩm
	if (data.check == false) {
		return {
			redirect: {
				destination: "/404",
				permanent: false,
			},
		};
	}
	return {
		props: {
			data,
			PAGE_OF_EVALUATE,
			PAGE_OF_COMMENT,
		},
	};
};
export default LinkProduct;
