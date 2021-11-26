import Link from "next/link";
import { ArrowLeft } from "react-bootstrap-icons";
function GoToBackHome() {
	return (
		<>
			<Link href='/'>
				<a className='flex items-center space-x-3 mt-7 bg-primary text-white px-8 py-4 rounded-full'>
					<ArrowLeft />
					<span>Quay lại trang chủ</span>
				</a>
			</Link>
		</>
	);
}

export default GoToBackHome;
