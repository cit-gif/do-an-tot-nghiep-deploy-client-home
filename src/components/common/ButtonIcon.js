const ButtonIcon = (props) => {
	const { background_color = "", hover = "hover:bg-gray-100 hover:text-primary", children, height = "h-12", width = "w-12", fontSize = "text-xl", custom = "", text_color = "text-black", type = "button" } = props;
	return (
		<button type={type} className={`${height} ${width} ${fontSize} ${text_color} ${background_color} outline-none flex font-bold items-center justify-center ${hover} active:outline-none active:bg-gray-200 focus:outline-none rounded-full cursor-pointer ease-linear transition-all duration-150 ${custom}`} {...props}>
			{children}
		</button>
	);
};
export default ButtonIcon;
