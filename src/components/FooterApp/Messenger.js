import { XCircle, Telegram } from "react-bootstrap-icons";
import ButtonIcon from "@src/components/common/ButtonIcon";
import { useEffect, useState, createRef, useContext, useRef } from "react";
import Image from "next/image";
import { AppContext } from "@src/context";
// import innerHeight from "ios-inner-height";
import { serverApi, qualityImage } from "@src/config/constrant";
const LineMessage = props => {
	const { Avatar, From_Id_User, MessengerContent, Name, Role, Time, _id } = props.Mess;
	const MyRole = "user";

	const isMyType = MyRole === Role ? true : false;
	return (
		<div title={isMyType ? "Tôi" : Name} className={`w-full flex flex-nowrap mb-4 ${isMyType ? "justify-end" : ""}`}>
			<div className={`flex flex-row items-center w-9/12 ${isMyType ? "justify-end" : ""}`}>
				{!isMyType && (
					<div className="relative border-2 inline-block rounded-full h-9 w-9 mr-2 border-gray-400 overflow-hidden select-none">
						<Image quality={qualityImage} layout="fill" objectFit="cover" src={`${serverApi}${Avatar}`} />
					</div>
				)}
				<span className={`p-3 rounded-lg text-base font-sans ${isMyType ? "bg-primary text-white" : "bg-gray-200 LineMessage"} word-wrap-global`}>
					{/* LineMessage css global  */}
					{MessengerContent}
				</span>
			</div>
		</div>
	);
};
function Messenger(props) {
	const { show } = props;
	const BodyMessage = createRef(null);
	const { socket, messages, setMessages, user } = useContext(AppContext);
	const [listMessenger, setListMessenger] = useState([]);

	useEffect(() => {
		const scrollBottom = function (event) {
			const { currentTarget: target } = event;
			target.scroll({ top: target.scrollHeight, behavior: "smooth" });
			// check if user scroll not bottom
			// controller.abort();
		};
		const controller = new AbortController();
		BodyMessage.current.addEventListener("DOMNodeInserted", scrollBottom, { signal: controller.signal });
		return () => {
			controller.abort();
		};
	}, []);
	const [loadMess, setLoadMess] = useState(false);
	const [chatOnFocus, setChatOnFocus] = useState(false);
	useEffect(() => {
		if (socket) {
			socket.emit("getMessage", null);
			socket.on("getMessageUser", data => {
				setMessages(data);
			});
			socket.on("message", messData => {
				setMessages(prev => [...prev, messData]);
			});
			socket.on("inputOnFocus", userId => {
				// nếu tag đang hoạt dộng bằng với user id thì
				// hiển thị biểu tượng đang nhập
				setChatOnFocus(true);
			});
			socket.on("deleteAllMessage", () => {
				setMessages([]);
			});
			socket.on("inputOnBlur", userId => {
				// ---
				setChatOnFocus(false);
			});
		}
		return () => {
			if (socket) {
				["getMessageUser", "message"].forEach(x => socket.removeAllListeners(x));
			}
		};
	}, [socket]);

	const [InputValue, setInputValue] = useState("");

	const handleSendMess = async e => {
		e.preventDefault();
		if (socket) {
			if (InputValue.trim() === "") {
				return;
			}
			socket.emit("sendMessage", {
				MessengerContent: InputValue.trim(),
				Avatar: user.Avatar,
			});
			setInputValue("");
		}
	};
	const { setMessShow } = useContext(AppContext);
	return (
		// header body footer position absolute , body top bottom = header and footer height
		<div id="aaa" className={`${show ? "fixed " : "hidden invisible"} flex-col w-80 right-12 bottom-0 rounded-t-xl xs:rounded-none overflow-hidden bg-white z-30 shadow-xl h-96 xs:inset-x-0 xs xs:w-full xs:h-full`}>
			<div className={`flex w-full flex-nowrap justify-between items-center bg-primary shadow-dropdownAbsolute h-14 absolute top-0 inset-x-0`}>
				<div className={`flex items-center justify-center`}>
					<div className="relative w-12 h-12  ml-5">
						<div className="relative h-full w-full border-2 rounded-full border-gray-400 overflow-hidden select-none">
							<Image quality={qualityImage} layout="fill" src={`/admin.png`} />
							{/* <Image lazy='true' quality={qualityImage} layout='fill' src={`${serverApi}/${TuyChon?.DuongDanHinhAnh[0]}`} /> */}
						</div>
						<span className="absolute rounded-full right-0 bottom-2 h-2 w-2 bg-green-600"></span>
					</div>
					<div className="flex flex-col items-center ml-5">
						<span className="text-white font-medium text-base">Admin</span>
						<span className="text-white font-light text-sm">Sẵn sàng hỗ trợ bạn</span>
					</div>
				</div>
				<span
					onClick={() => {
						setMessShow(false);
					}}
					className="px-6 cursor-pointer text-white rounded-full h-full hover:bg-white hover:bg-opacity-10 active:bg-opacity-30 transition-all ease-out duration-300 text-xl flex justify-center items-center py-4">
					<XCircle />
				</span>
			</div>
			<div ref={BodyMessage} className="overflow-y-scroll overflow-x-hidden  flex flex-col  top-14 bottom-12 xs:bottom-14 left-0 right-0 absolute py-2 px-3">
				{messages.map((Mess, key) => {
					return <LineMessage key={key} Mess={Mess} />;
				})}
				{chatOnFocus && (
					<div className="my-4 flex-grow px-10 relative flex items-end py-1  w-full">
						<div className="dot-falling"></div>
					</div>
				)}
			</div>
			<form onSubmit={handleSendMess} className="flex flex-nowrap items-center ms:w-full justify-between shadow-lg h-12 xs:h-14 py-1 px-3 xs:pr-10 xs:pl-6  bg-gray-200 absolute inset-x-0 bottom-0">
				<input
					placeholder="Soạn tin nhắn"
					value={InputValue}
					onFocus={e => {
						if (socket) {
							socket.emit("OnFocus");
						}
					}}
					onBlur={e => {
						if (socket) {
							socket.emit("OnBlur");
						}
					}}
					onChange={e => {
						e.preventDefault();
						setInputValue(e.target.value);
					}}
					className="border-primary w-8/12 h-full px-4 bg-gray-50 rounded-full  focus:outline-none border-0"
					type="text"
				/>
				<ButtonIcon background_color="disabled:bg-gray-500" disabled={InputValue.trim() === "" ? true : false} fontSize="text-2xl" type="submit">
					<Telegram />
				</ButtonIcon>
			</form>
		</div>
	);
}

export default Messenger;
