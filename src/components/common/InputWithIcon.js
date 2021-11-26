import { createRef } from "react";
function InputWithIcon(props) {
	const { name = "", placeholder = "", value = "", onChange, type = "text" } = props;
	const inputEl = createRef();
	return (
		<div className='flex relative'>
			<span
				onClick={() => {
					inputEl.current.focus();
				}}
				className='rounded-l-md inline-flex text-xl  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm'
			>
				{props.icon}
			</span>

			<input
				type={type}
				ref={inputEl}
				className='rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
				name={name}
				placeholder={placeholder}
				value={value}
				onChange={(e) => {
					onChange(e.target.value);
				}}
			/>
		</div>
	);
}

export default InputWithIcon;
