import InputMain from "@src/components/common/InputMain";
import Image from "next/image";
import { useState, useRef } from "react";
import TitleCate from "@src/components/common/TitleCate";
import ButtonColorMain from "@src/components/common/ButtonColorMain";
import axios from "@src/config/axios";
const Title_small = props => <span className="text-lg font-semibold mb-2">{props.children}</span>;
const css_box = "p-4 flex flex-wrap w-full border rounded-lg mb-4";
const css_flex = "my-3 w-1/2 sm:w-full xs:w-full px-4";
import BoxShadow from "@src/components/common/BoxShadow";
import { useSnackbar } from "notistack";
import { serverApi, qualityImage } from "@src/config/constrant";
import { getCookie } from "@src/helper/helpCookie";
import { useRouter } from "next/router";
import validate from "src/helper/validate";
const Avatar_Jsx = props => {
	const { Avatar, Name } = props.user;
	const { file, src } = props.choiceAvatar;
	if (file) {
		return <img src={src} className="object-cover h-full w-full" />;
	}
	if (Avatar == "") {
		return <span className="text-white font-bold text-lg">{Name.split(" ")[1]}</span>;
	}
	return <Image quality={qualityImage} objectFit="fill" loading="eager" layout="fill" src={`${serverApi}${Avatar}`} />;
};
const Profile = props => {
	const { Name = "", PhoneNumber = "", Avatar = "" } = props.data;
	const { enqueueSnackbar } = useSnackbar();
	const [choiceAvatar, setChoiceAvatar] = useState({
		check: true,
		fileName: "",
		file: "",
		src: "",
	});
	const [state, setState] = useState({
		Avatar,
		Name,
		PhoneNumber,
		check: true,
	});
	const [progressBar, setProgress] = useState({
		show: false,
		value: 0,
	});
	const handleChangeName = e => {
		setState({
			...state,
			Name: e.target.value,
		});
	};

	const handle_choice_file = e => {
		if (e.target.files.length === 0) {
			return;
		}
		const file = e.target.files[0];
		const fileName = file.name;
		const allowed_types = ["image/jpeg", "image/png", "image/jpg"];
		const allowed_size_mb = 5;
		if (allowed_types.indexOf(file.type) === -1) {
			return enqueueSnackbar("Định dạng ảnh không được hỗ trợ!", { variant: "error" });
		}
		if (file.size > allowed_size_mb * 1024 * 1024) {
			return enqueueSnackbar("Kích thước ảnh <= 5 MB!", { variant: "error" });
		}

		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = e => {
			setChoiceAvatar({
				...choiceAvatar,
				src: e.target.result,
				fileName: fileName,
				file: file,
				check: true,
			});
		};
	};
	const input_file_ref = useRef(null);
	const router = useRouter();
	const handleSubmit = async e => {
		if (state.Name.trim().length === 0) {
			return enqueueSnackbar("Vui lòng kiểm tra lại thông tin!", { variant: "error" });
		}
		const accessToken = getCookie("accessToken");
		if (!accessToken || accessToken == "") {
			return enqueueSnackbar("Đã xảy ra lỗi, vui lòng reload lại trang!", { variant: "error" });
		}
		//submit
		try {
			const formData = new FormData();
			if (choiceAvatar.file) {
				formData.append("Avatar", choiceAvatar.file);
			}
			formData.append("Name", state.Name);

			const res = await axios.post("/api/user/profile/edit/profile", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					authorization: accessToken,
				},
				onUploadProgress: progressEvent => {
					let value = Math.round((progressEvent.loaded / progressEvent.total) * 100);
					if (value < 100) {
						setProgress({ ...progressBar, show: true, value });

						return;
					}
					return setProgress({ ...progressBar, show: false, value: 0 });
				},
			});
			enqueueSnackbar("Cập nhật thành công!", { variant: "success" });
		} catch (error) {
			return enqueueSnackbar("Đã xảy ra lỗi. Vui lòng thử lại!", { variant: "error" });
		}
	};
	return (
		<div className={css_box}>
			<div className="flex items-center flex-wrap w-full">
				<div className={`${css_flex} flex items-center flex-wrap`}>
					<div className="relative select-none mr-2 bg-primary flex flex-nowrap items-center justify-center w-16 h-16 rounded-full shadow-lg overflow-hidden">
						<Avatar_Jsx user={state} choiceAvatar={choiceAvatar} />
					</div>

					<div className="flex items-center justify-center">
						<input onChange={handle_choice_file} type="file" className="hidden invisible" ref={input_file_ref} accept="image/jpeg,image/png,image/jpg" />
						<ButtonColorMain onClick={() => input_file_ref.current.click()} padding="px-2 py-2 xs:px-4">
							Thay đổi ảnh đại diện
						</ButtonColorMain>
					</div>
					{choiceAvatar.file && <span className="my-1 w-full text-sm font-semibold truncate">{choiceAvatar.fileName}</span>}
				</div>
				<div className={`${css_flex}`}>
					<Title_small>Tên hiển thị</Title_small>
					<InputMain value={state.Name} onChange={handleChangeName} />
				</div>
			</div>
			<div className="flex items-center flex-wrap w-full">
				<div className={`${css_flex}`}>
					<Title_small>Số điện thoại</Title_small>
					<InputMain
						disabled
						value={state.PhoneNumber}
						onChange={e => {
							console.log(e);
						}}
					/>
				</div>
				<div className={`${css_flex} flex items-center justify-center`}>
					<ButtonColorMain onClick={handleSubmit}>Cập nhật thông tin</ButtonColorMain>
				</div>
			</div>
			<div className={`w-full rounded-full  bg-gray-200 relative ${progressBar.show ? "" : "hidden"}`}>
				<span className="absolute  left-1/2 -translate-x-1/2 bottom-full text-xs text-gray-500 font-semibold">{progressBar.value}%</span>
				<span style={{ width: progressBar.value + "%" }} className="flex rounded-full items-center justify-center w-1/2 h-2 bg-primary transition-all duration-300" />
			</div>
		</div>
	);
};

const Addresses_jsx = props => {
	const { Address } = props.data;
	const [state, setState] = useState({
		City: Address.City,
		District: Address.District,
		Wards: Address.Wards,
		Details: Address.Details,
	});
	const [change, setChange] = useState(false);
	const { enqueueSnackbar } = useSnackbar();

	const handleSubmit = async () => {
		if (!change) {
			return enqueueSnackbar("Vui lòng nhập thông tin!", { variant: "warning", preventDuplicate: true });
		}
		const { error } = await validate.addressUser(state);
		if (error) {
			return enqueueSnackbar("Vui lòng kiểm tra lại thông tin!", { variant: "error", preventDuplicate: true });
		}
		const accessToken = getCookie("accessToken");
		if (!accessToken || accessToken == "") {
			return enqueueSnackbar("Đã xảy ra lỗi, vui lòng reload lại trang!", { variant: "error", preventDuplicate: true });
		}
		try {
			const res = await axios.post("/api/user/profile/edit/address", state, {
				headers: {
					"Content-Type": "application/json",
					authorization: accessToken,
				},
			});
			setState(res.data.Address);
			enqueueSnackbar("Cập nhật thành công!", { variant: "success" });
		} catch (error) {
			enqueueSnackbar("Đã xảy ra lỗi!", { variant: "error" });
		}
	};
	return (
		<div className={css_box}>
			<div className={`${css_flex}`}>
				<Title_small>Tỉnh / Thành phố</Title_small>
				<InputMain
					value={state.City}
					onChange={e => {
						setChange(true);
						setState({ ...state, City: e.target.value });
					}}
				/>
			</div>
			<div className={`${css_flex}`}>
				<Title_small>Quận / Huyện</Title_small>
				<InputMain
					value={state.District}
					onChange={e => {
						setChange(true);

						setState({ ...state, District: e.target.value });
					}}
				/>
			</div>
			<div className={`${css_flex}`}>
				<Title_small>Phường / Xã</Title_small>
				<InputMain
					value={state.Wards}
					onChange={e => {
						setChange(true);

						setState({ ...state, Wards: e.target.value });
					}}
				/>
			</div>
			<div className={`${css_flex}`}>
				<Title_small>Số nhà / Mô tả cụ thể</Title_small>
				<InputMain
					value={state.Details}
					onChange={e => {
						setChange(true);

						setState({ ...state, Details: e.target.value });
					}}
				/>
			</div>
			<div className={`w-full flex  items-center justify-end px-4`}>
				<ButtonColorMain onClick={handleSubmit}>Cập nhật thông tin</ButtonColorMain>
			</div>
		</div>
	);
};
const ChangPassword_jsx = props => {
	const [state, setState] = useState({
		OldPassword: "",
		NewPassword: "",
		RetypePassword: "",
	});
	const { enqueueSnackbar } = useSnackbar();
	const [change, setChange] = useState(false);
	const handleChange = e => {
		setChange(true);

		setState({
			...state,
			[e.target.name]: e.target.value,
		});
	};
	const handleSubmit = async () => {
		if (!change) {
			return enqueueSnackbar("Vui lòng nhập thông tin!", { variant: "warning", preventDuplicate: true });
		}
		const { error } = await validate.changePassword(state);
		if (error) {
			return enqueueSnackbar("Vui lòng kiểm tra lại thông tin!", { variant: "error", preventDuplicate: true });
		}
		const accessToken = getCookie("accessToken");
		if (!accessToken || accessToken == "") {
			return enqueueSnackbar("Đã xảy ra lỗi, vui lòng reload lại trang!", { variant: "error", preventDuplicate: true });
		}
		if (state.NewPassword !== state.RetypePassword) {
			return enqueueSnackbar("Nhập lại mật khẩu không chính xác!", { variant: "error", preventDuplicate: true });
		}
		if (state.NewPassword == state.OldPassword) {
			return enqueueSnackbar("Mật khẩu mới trùng mật khẩu cũ!", { variant: "error", preventDuplicate: true });
		}
		try {
			const res = await axios.post("/api/user/profile/edit/password", state, {
				headers: {
					"Content-Type": "application/json",
					authorization: accessToken,
				},
			});
			setState({
				OldPassword: "",
				NewPassword: "",
				RetypePassword: "",
			});
			enqueueSnackbar("Cập nhật thành công!", { variant: "success" });
		} catch (error) {
			if (error.response) {
				return enqueueSnackbar(error.response.data.message, { variant: "error" });
			}
			enqueueSnackbar("Đã xảy ra lỗi!", { variant: "error" });
		}
	};
	return (
		<div className={css_box}>
			<div className="w-full flex items-center flex-wrap">
				<div className={`${css_flex}`}>
					<Title_small>Nhập mật khẩu hiện tại</Title_small>
					<InputMain value={state.OldPassword} name="OldPassword" onChange={handleChange} />
				</div>
				<div className={`${css_flex} sm:hidden sm:invisible xs:hidden xs:invisible`}></div>
			</div>
			<div className="w-full flex items-center flex-wrap">
				<div className={`${css_flex}`}>
					<Title_small>Mật khẩu mới</Title_small>
					<InputMain name="NewPassword" value={state.NewPassword} onChange={handleChange} />
				</div>
				<div className={`${css_flex}`}>
					<Title_small>Nhập lại mật khẩu mới</Title_small>
					<InputMain name="RetypePassword" value={state.RetypePassword} onChange={handleChange} />
				</div>
			</div>
			<div className={css_flex}>
				<ButtonColorMain onClick={handleSubmit}>Cập nhật</ButtonColorMain>
			</div>
		</div>
	);
};
function Account({ data }) {
	if (!data.check) {
		return (
			<BoxShadow>
				<div className="flex items-center justify-center py-20">
					<TitleCate>Bạn cần đăng nhập!</TitleCate>
				</div>
			</BoxShadow>
		);
	}
	const user = data.data;
	return (
		<div className="my-12">
			<BoxShadow>
				<div className="flex ">
					<div className="w-full p-4 px-5 py-5">
						<div className="flex flex-col ">
							<div className="col-span-2 p-5">
								<TitleCate>Thông tin tài khoản</TitleCate>
								<Profile data={user} />
								{/* -- */}
								<TitleCate>Địa chỉ giao hàng</TitleCate>
								<Addresses_jsx data={user} />
								{/* -- */}

								<TitleCate>Đổi mật khẩu</TitleCate>
								<ChangPassword_jsx />
							</div>
						</div>
					</div>
				</div>
			</BoxShadow>
		</div>
	);
}
const getData = async accessToken => {
	const data = {};
	data.check = true;

	try {
		const res = await axios.post("/api/user/profile", {
			accessToken,
		});

		data.data = res.data;
	} catch (error) {
		data.check = false;
	}
	return data;
};
export const getServerSideProps = async ctx => {
	const accessToken = ctx.req.cookies.accessToken;
	if (accessToken) {
		const data = await getData(accessToken);
		if (data.check) {
			return {
				props: {
					data: data,
				},
			};
		}
	}

	return {
		props: {
			data: { check: false },
		},
	};
};
export default Account;
