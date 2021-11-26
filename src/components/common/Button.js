function Button(props) {
	const { disabled = false, title, type = "button", iconStart, iconEnd, onClick, rounded = "rounded-full", color, size = "lg" } = props;
	const getSize = () => {
		let css = "";
		switch (size) {
			case "lg":
				return (css = "px-4 py-2");
			case "md":
				return (css = "px-2 py-2");
			case "sm":
				return (css = "px-2 py-1");
			case "xs":
				return (css = "px-0 py-0");
			default:
				return (css = "px-4 py-2");
		}
	};
	return color == "white" ? (
		<button disabled={disabled} type={type} onClick={onClick} className={`w-full flex flex-nowrap outline-none ${getSize()} text-black border-gray-400 border-2 items-center justify-center transition-all ease-out duration-300 shadow-sm hover:shadow-nextShadow hover:border-primary bg-white hover:bg-primary hover:text-white active:bg-primaryDark  ${disabled && "!bg-gray-600 !text-white"} ${rounded}`}>
			{iconStart && <span className="flex mr-2 items-center justify-between text-2xl md:text-xl">{iconStart}</span>}
			{title}
			{iconEnd && <span className="flex ml-2 items-center justify-between text-2xl md:text-xl">{iconEnd}</span>}
		</button>
	) : (
		<button disabled={disabled} type={type} onClick={onClick} className={`w-full flex flex-nowrap outline-none ${getSize()} text-white items-center justify-center transition-all ease-out duration-300 shadow-sm hover:shadow-nextShadow bg-primary active:bg-primaryDark ${disabled && "!bg-gray-600 !text-white"} ${rounded}`}>
			{iconStart && <span className="flex mr-2 items-center justify-between text-2xl md:text-xl">{iconStart}</span>}
			{title}
			{iconEnd && <span className="flex ml-2 items-center justify-between text-2xl md:text-xl">{iconEnd}</span>}
		</button>
	);
}

export default Button;
