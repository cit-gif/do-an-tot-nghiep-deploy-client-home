import { useState } from "react";
function InputOutLineNone(props) {
	const { name, value, type, label, onChange, icon } = props;
	const [focus, setFocus] = useState(false);
	const styleFocused = {
		div: "before:w-1/2 after:w-1/2",
		icon: "text-primary",
		label: "-top-3 text-xl md:text-lg",
	};

	return (
		<div className={`w-full relative py-1 flex flex-nowrap h-full min-h-full border-b-2 border-solid border-gray-300 containerInputOutlineNone before:bg-primary before:absolute before:h-0.5 before:-bottom-0.5 before:right-1/2 before:transition-all before:duration-400 before:overflow-hidden after:bg-primary after:absolute after:h-0.5 after:-bottom-0.5 after:left-1/2 after:transition-all after:duration-400 after:overflow-hidden ${focus ? styleFocused.div : "before:w-0 after:w-0"}`}>
			{icon && <span className={`flex mx-2 items-center justify-center h-full text-2xl transition-all ease-out duration-300 ${focus ? styleFocused.icon : ""}`}>{icon}</span>}
			<div className='relative h-full w-full'>
				<h5 className={`absolute left-5 -translate-y-1/2 text-gray-500 font-semibold transition-all ease-out duration-300 ${value != "" || focus ? styleFocused.label : "text-lg md:text-base top-1/2"}`}>{label}</h5>
				<input
					onFocus={() => {
						setFocus(true);
					}}
					onBlur={() => {
						setFocus(false);
					}}
					className='absolute inset-0 w-full h-full py-2 px-3 bg-transparent outline-none'
					type={type}
					value={value && value}
					onChange={(e) => {
						onChange(e);
					}}
					name={name && name}
				/>
			</div>
		</div>
	);
}

export default InputOutLineNone;
