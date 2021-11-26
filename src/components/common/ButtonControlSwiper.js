function ButtonControlSwiper(props) {
	const { onClick, icon } = props;
	return (
		<button onClick={onClick} className="w-12 h-12 xs:w-10 xs:h-10 flex items-center justify-center text-2xl rounded-full bg-gray-400 bg-opacity-30 transition-all duration-250 ease-linear hover:bg-primary hover:text-white hover:shadow-nextShadow">
			<span>{icon}</span>
		</button>
	);
}

export default ButtonControlSwiper;
