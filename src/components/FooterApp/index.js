import ButtonScrollTop from "./ButtonScrollTop";
import FormLoinOrRegister from "./FormLoinOrRegister";
import { useContext } from "react";
import { AppContext } from "src/context";
import Messenger from "./Messenger";
import MessButton from "./MessButton";
import Footer from "./Footer";
function index() {
	const { choiceFormLoginOrRegister, showFormLoginOrRegister, setMessShow, messShow, user } = useContext(AppContext);

	return (
		<div className='bg-three dark:bg-gray-800 pt-4 pb-8 xl:pt-8'>
			<div>
				{<FormLoinOrRegister choiceForm={choiceFormLoginOrRegister} show={showFormLoginOrRegister} />}

				{user && <Messenger show={messShow} />}
				{/* { 
					socket chỉ exmit event load mess chỉ  sau khi mở mess
					những lần sau khi mở mess sẽ ko enmit nữa
					khi  user đăng xuất thì load lại sẽ emit
				} */}
				{!messShow && user && <MessButton />}

				<ButtonScrollTop />
			</div>
			<div className='w-full'>
				<Footer />
			</div>
		</div>
	);
}

export default index;
