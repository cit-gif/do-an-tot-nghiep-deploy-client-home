function ButtonColorMain(props) {
	const { disabled = false, children, onClick, title = "", type = "button", padding = "px-8 py-3 xs:px-16", rounded = "rounded-full", fontSize = "font-medium", custom = "" } = props;
	return (
		<button title={title} disabled={disabled} type={type} onClick={onClick} className={`disabled:bg-gray-400 disabled:hover:shadow-none disabled:cursor-not-allowed outline-none ${padding} ${fontSize} whitespace-nowrap transition-all ease-out duration-300 shadow-sm  bg-primary hover:shadow-nextShadow text-white active:bg-primaryDark ${rounded} ${custom}`}>
			{children}
		</button>
	);
}

export default ButtonColorMain;
