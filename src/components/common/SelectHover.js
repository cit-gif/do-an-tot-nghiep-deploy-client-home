import { useState } from "react";

function SelectHover(props) {
	const { items = [], active = 0, changeSelection, direction = "up" } = props;
	const getStylesFromDirection = (() => {
		if (direction === "right-down") {
			return "top-full";
		}
		if (direction === "left-down") {
			return "top-full right-0";
		}
		if (direction === "center-down") {
			return "left-1/2 -translate-x-1/2";
		}
		if (direction === "right-up") {
			return "bottom-full";
		}
		if (direction === "center-up") {
			return "bottom-full left-1/2 -translate-x-1/2";
		}
		if (direction === "left-up") {
			return "bottom-full right-0";
		}
	})();
	const [show, setShow] = useState(false);
	return (
		<div className='w-full'>
			<div
				className='relative'
				onMouseOver={(e) => {
					setShow(true);
				}}
				onMouseLeave={() => {
					setShow(false);
				}}
			>
				<button type='button' className={`w-full overflow-hidden bg-white pl-1 pr-10 py-1 text-left sm:text-sm cursor-pointer  rounded shadow-dropdownRelative hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150`}>
					<span className='flex items-center'>
						<span className='ml-3 block truncate'>{items[active].title}</span>
					</span>
					<span className='ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
						<svg className='h-5 w-5 text-gray-400' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' aria-hidden='true'>
							<path fillRule='evenodd' d='M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z' clipRule='evenodd'></path>
						</svg>
					</span>
				</button>
				<div className={`absolute ${direction.includes("-up") ? "pb-2" : "pt-2"} bg-transparent min-w-max w-full  ${getStylesFromDirection} ${show ? "" : "hidden"}`}>
					<div className='w-full rounded-md bg-white shadow-dropdownAbsolute overflow-hidden'>
						<ul tabIndex='-1' role='listbox' aria-labelledby='listbox-label' className='max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm'>
							{items.map((item, key) => {
								return (
									<li
										key={key}
										onClick={() => {
											changeSelection(key);
											setShow(false);
										}}
										role='option'
										className='cursor-pointer text-gray-900  select-none hover:bg-primary hover:text-white relative py-1 pl-1 pr-9 '
									>
										<div className='flex items-center mr-2'>
											<span className='ml-3 block font-normal truncate'>{item.title}</span>
										</div>
										{active == key ? (
											<span className='absolute inset-y-0 right-0 flex items-center pr-4'>
												<svg className='h-5 w-5' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' aria-hidden='true'>
													<path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd'></path>
												</svg>
											</span>
										) : (
											""
										)}
									</li>
								);
							})}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}

export default SelectHover;
