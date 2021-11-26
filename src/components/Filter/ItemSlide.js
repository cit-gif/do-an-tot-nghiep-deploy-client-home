import { PlusLg, DashLg } from "react-bootstrap-icons";
import { useState } from "react";
const ItemSile = (props) => {
	const [show, setShow] = useState(false);
	const { title, data } = props.data;
	const { setData } = props;

	return (
		<div className='w-full transition-all py-2 border-b px-2'>
			<div
				onClick={() => {
					setShow(!show);
				}}
				className='w-full flex items-center justify-between cursor-pointer  font-semibold select-none'
			>
				<span className='text-lg'>{title}</span>
				<span>{!show ? <PlusLg /> : <DashLg />}</span>
			</div>
			<div className={`${!show ? "hidden" : "block"} transition-all`}>
				{data.map((item, key) => {
					return (
						<label className='flex items-center py-2 relative' key={key}>
							<input
								onChange={(e) => {
									const newData = data;
									newData[key].checked = !newData[key].checked;
									setData({ title, data: newData });
								}}
								checked={data[key].checked}
								type='checkbox'
								className='absolute  top-1/2 -translate-y-1/2 form-tick appearance-none bg-white bg-origin-border bg-no-repeat bg-center bg-check h-5 w-5 border border-gray-500 rounded-md checked:bg-primary focus:outline-none'
							/>
							<span className='ml-6 text-gray-700 text-[.85rem]'>{item.label}</span>
						</label>
					);
				})}
			</div>
		</div>
	);
};
export default ItemSile;
