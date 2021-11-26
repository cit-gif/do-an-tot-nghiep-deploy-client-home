function Textarea(props) {
	const { height = "", value = "", placeholder = "", onChange = () => {}, name = "" } = props;
	return (
		<div className='w-full h-full'>
			<textarea placeholder={placeholder} value={value} onChange={onChange} name={name} className={`bg-gray-100 ${height} w-full py-2 px-4 rounded-md outline-none border focus:border-primary transition-all duration-300 ease-out text-[#0e0e0e] `} />
		</div>
	);
}

export default Textarea;
