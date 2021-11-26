import Link from "next/link";
function ButtonWhite(props) {
	const { title, iconStart, type = "button", iconEnd, onClick, rounded = "rounded-full", color, padding = "px-4 py-2", hover_bg = "hover:bg-primary", size = "w-full h-12", fontWeight = "font-semibold" } = props;
	const { tag = "button", href = "/" } = props;
	return tag == "button" ? (
		<button type={type} onClick={onClick} className={`${size} flex flex-nowrap outline-none ${padding} text-black border-gray-400 border-2 items-center justify-center transition-all ease-out duration-300 shadow-sm hover:shadow-nextShadow hover:border-primary bg-white ${hover_bg} hover:!text-white active:bg-primaryDark  ${rounded}`}>
			{iconStart && <span className='flex mr-2 items-center justify-between text-2xl md:text-xl'>{iconStart}</span>}
			{title}
			{iconEnd && <span className='flex ml-2 items-center justify-between text-2xl md:text-xl'>{iconEnd}</span>}
		</button>
	) : tag == "a" ? (
		<Link href={href}>
			<a className={`${size} flex flex-nowrap outline-none ${padding} text-black border-gray-400 border-2 ${fontWeight}  items-center justify-center transition-all ease-out duration-300 shadow-sm hover:shadow-nextShadow hover:border-primary bg-white hover:bg-primary hover:text-white active:bg-primaryDark  ${rounded}`}>
				{iconStart && <span className='flex mr-2 items-center justify-between text-2xl md:text-xl'>{iconStart}</span>}
				{title}
				{iconEnd && <span className='flex ml-2 items-center justify-between text-2xl md:text-xl'>{iconEnd}</span>}
			</a>
		</Link>
	) : (
		""
	);
}

export default ButtonWhite;
