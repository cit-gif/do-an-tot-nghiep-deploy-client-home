function InputMain(props) {
	const { disabled = false, type = "text", value = "", placeholder = "", onChange = () => {}, name = "", customCss = "text-[#0e0e0e]" } = props;
	return (
		<div className='w-full'>
			<input disabled={disabled} type={type} placeholder={placeholder} value={value} onChange={onChange} name={name} className={`bg-gray-100 h-12 w-full py-2 px-4 rounded-md outline-none border focus:border-primary transition-all duration-300 ease-out ${customCss}`} />
		</div>
	);
}

export default InputMain;
