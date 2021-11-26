import DialogModal from "@src/components/common/DialogModal";
function Modal(props) {
	const { show, setShow, children, fullScreen } = props;
	const getfullScreen = (() => {
		if (fullScreen) {
			let classesFullyScreen = "";
			switch (fullScreen) {
				case "md":
					return (classesFullyScreen = "md:inset-0 md:translate-x-0 md:translate-y-0");
				case "sm":
					return (classesFullyScreen = "sm:inset-0 sm:translate-x-0 sm:translate-y-0");
				case "lg":
					return (classesFullyScreen = "lg:inset-0 lg:translate-x-0 lg:translate-y-0");
				case "xl":
					return (classesFullyScreen = "xl:inset-0 xl:translate-x-0 xl:translate-y-0");
				case "2xl":
					return (classesFullyScreen = "2xl:inset-0 2xl:translate-x-0 2xl:translate-y-0");
			}
			return classesFullyScreen;
		}

		return "";
	})();
	// left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
	return (
		<>
			<div className={`fixed z-50 bg-transparent flex items-center justify-center  inset-0 ${show ? "transition-all ease-out duration-400 scale-100 visible opacity-100 " : "scale-50 transition-all duration-200 ease-in invisible opacity-5"} `}>{children}</div>
			<DialogModal zIndex="z-40" show={show} />
		</>
	);
}

export default Modal;
