import { XCircle } from "react-bootstrap-icons";

const Badge = (props) => {
	const { index, setData, data, currentData } = props;
	const { label } = data;

	const handleUncheck = () => {
		const newData = currentData.data;
		newData[index].checked = !newData[index].checked;
		setData({ ...currentData, data: newData });
	};
	return (
		<div className='inline-flex items-center min-w-max text-sm font-medium rounded-full border bg-primary text-white p-1  hover:shadow-nextShadow active:bg-primaryDark select-none'>
			<span className='mr-1'>{label}</span>
			<span onClick={handleUncheck} className='cursor-pointer text-2xl'>
				<XCircle />
			</span>
		</div>
	);
};
export default Badge;
