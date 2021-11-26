import Modal from "@src/components/common/Modal";
import InputOutLineNone from "@src/components/common/InputOutLineNone";
import Button from "@src/components/common/Button";
import { Person, ShieldLock } from "react-bootstrap-icons";
import { useContext } from "react";
import { AppContext } from "@src/context";
import { useState } from "react";
import validate from "@src/helper/validate";
import axios from "@src/config/axios";
import { getCookie, setCookie } from "@src/helper/helpCookie";
import decodeJwt from "@src/helper/decodeJwt";
import { useSnackbar } from "notistack";
function FormLoinOrRegister(props) {
	const { choiceForm = "login", show } = props;
	const { setUser, setChoiceFormLoginOrRegister, setShowFormLoginOrRegister, loadCart, setLoadCart } = useContext(AppContext);
	const { enqueueSnackbar } = useSnackbar();
	const configLoin = {
		check: true,
		PhoneNumber: "",
		Password: "",
		errorText: "Thông tin nhập vào chưa chính xác!",
	};
	const [stateLogin, setStateLogin] = useState(configLoin);
	const handleLogin = async e => {
		e.preventDefault();
		const req = {
			PhoneNumber: stateLogin.PhoneNumber,
			Password: stateLogin.Password,
		};
		const { error } = await validate.login(req);
		if (error) {
			return setStateLogin({
				...stateLogin,
				check: false,
			});
		}
		setStateLogin({
			...stateLogin,
			check: true,
		});
		try {
			const res = await axios.post("/api/user/login", req);
			if (res.status === 200) {
				setStateLogin(configLoin);
				const accessToken = res.data.accessToken;
				setCookie("accessToken", "beare " + accessToken);
				setUser({
					...decodeJwt(accessToken),
					Cart: [],
				});
				setShowFormLoginOrRegister(false);
			}
		} catch (err) {
			setStateLogin({
				...stateLogin,
				check: false,
			});
		}
	};
	const handleInputLogin_PhoneNumber_Change = e => {
		setStateLogin({
			...stateLogin,
			PhoneNumber: e.target.value,
		});
	};
	const handleInputLogin_Password_Change = e => {
		setStateLogin({
			...stateLogin,
			Password: e.target.value,
		});
	};

	// --- Register
	const configRegister = {
		check: true,
		errorText: "Thông tin nhập vào chưa chính xác!",
		PhoneNumber: "",
		Password: "",
		Name: "",
	};
	const [stateRegister, setStateRegister] = useState(configRegister);
	const handleRegister = async e => {
		e.preventDefault();
		const req = {
			Name: stateRegister.Name,
			Password: stateRegister.Password,
			PhoneNumber: stateRegister.PhoneNumber,
		};
		const { error } = await validate.register(req);
		if (error) {
			return setStateRegister({
				...stateRegister,
				check: false,
			});
		}

		setStateRegister({
			...stateRegister,
			check: true,
		});
		try {
			const res = await axios.post("/api/user/register", req);
			setStateRegister(configRegister);
			setChoiceFormLoginOrRegister("login");
			enqueueSnackbar("Đăng kí thành công!", { variant: "success" });
		} catch (err) {
			setStateRegister({
				...stateRegister,
				check: false,
				errorText: err?.response?.data?.error?.message,
			});
		}
	};

	const handleInputRegister_PhoneNumber_Change = e => {
		setStateRegister({
			...stateRegister,
			PhoneNumber: e.target.value,
		});
	};
	const handleInputRegister_Password_Change = e => {
		setStateRegister({
			...stateRegister,
			Password: e.target.value,
		});
	};
	const handleInputRegister_Name_Change = e => {
		setStateRegister({
			...stateRegister,
			Name: e.target.value,
		});
	};
	return (
		<Modal show={show}>
			<div className="flex flex-col max-w-[90%] w-96 xs:w-[90%] max-h-full py-3 rounded-lg bg-white overflow-auto">
				<div className="flex w-100%">
					<div
						onClick={() => {
							setChoiceFormLoginOrRegister("login");
						}}
						className={`flex font-medium text-lg items-center justify-center px-3 py-2 w-1/2 border-b-4 ${choiceForm == "login" ? "border-primary" : "border-white"}`}>
						Đăng nhập
					</div>
					<div
						onClick={() => {
							setChoiceFormLoginOrRegister("register");
						}}
						className={`flex font-medium text-lg items-center justify-center px-3 py-2 w-1/2 border-b-4  ${choiceForm == "register" ? "border-primary" : "border-white"}`}>
						Tạo tài khoản
					</div>
				</div>
				{choiceForm == "login" ? (
					<form className="py-6 flex flex-col items-center justify-center" onSubmit={handleLogin}>
						{!stateLogin.check && <div className="block w-full text-center px-1 my-1 text-red-600">{stateLogin.errorText}</div>}
						<div className="block w-64 h-12 px-4 my-6">
							<InputOutLineNone name="PhoneNumber" label="Số điện thoại" type="text" icon={<Person />} onChange={handleInputLogin_PhoneNumber_Change} value={stateLogin.PhoneNumber} />
						</div>
						<div className="block w-64 h-12 px-4 my-6">
							<InputOutLineNone name="Password" label="Mật khẩu" type="password" onChange={handleInputLogin_Password_Change} icon={<ShieldLock />} value={stateLogin.Password} />
						</div>
						<div className="block w-64 px-4 h-8 my-6">
							<Button type="submit" title="Đăng nhập" />
						</div>
						<div className="block w-64 px-4 h-8 my-6">
							<Button
								onClick={e => {
									e.preventDefault();
									setShowFormLoginOrRegister(false);
								}}
								title="Đóng"
								color="white"
							/>
						</div>
					</form>
				) : (
					<form className="py-6 flex flex-col items-center justify-center" onSubmit={handleRegister}>
						{!stateRegister.check && <div className="block w-full text-center px-1 my-1 text-red-600">{stateRegister.errorText}</div>}
						<div className="block w-64 h-12 px-4 my-6">
							<InputOutLineNone name="PhoneNumber" label="Số điện thoại" icon={<Person />} value={stateRegister.PhoneNumber} type="text" onChange={handleInputRegister_PhoneNumber_Change} />
						</div>
						<div className="block w-64 h-12 px-4 my-6">
							<InputOutLineNone name="Name" label="Họ và tên" icon={<Person />} type="text" value={stateRegister.Name} onChange={handleInputRegister_Name_Change} />
						</div>
						<div className="block w-64 h-12 px-4 my-6">
							<InputOutLineNone name="Password" label="Mật khẩu" icon={<ShieldLock />} value={stateRegister.Password} type="password" onChange={handleInputRegister_Password_Change} />
						</div>
						<div className="block w-64 px-4 h-8 my-6">
							<Button type="submit" title="Tạo tài khoản" />
						</div>
						<div className="block w-64 px-4 h-8 my-6">
							<Button
								onClick={e => {
									e.preventDefault();
									setShowFormLoginOrRegister(false);
								}}
								title="Đóng"
								color="white"
							/>
						</div>
					</form>
				)}
			</div>
		</Modal>
	);
}

export default FormLoinOrRegister;
