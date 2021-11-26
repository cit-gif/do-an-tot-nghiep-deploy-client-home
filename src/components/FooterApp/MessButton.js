import { Messenger } from "react-bootstrap-icons";
import { useContext } from "react";
import { AppContext } from "src/context";

function MessButton() {
	const { setMessShow } = useContext(AppContext);

	return (
		<div
			onClick={() => {
				setMessShow(true);
			}}
			className="fixed right-[10%] bottom-[10%] cursor-pointer inline-block bg-primary rounded-full overflow-hidden shadow-dropdownAbsolute active:bg-opacity-80 z-30">
			<div className="flex items-center justify-center text-white w-12 h-12  text-4xl px-2 py-2">
				<Messenger />
			</div>
		</div>
	);
}

export default MessButton;
