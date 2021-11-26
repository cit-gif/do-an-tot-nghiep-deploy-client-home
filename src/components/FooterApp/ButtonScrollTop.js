import ButtonIcon from "@src/components/common/ButtonIcon";
import { ArrowUp } from "react-bootstrap-icons";
import AppenBody from "@src/components/common/AppenBody";
import smoothScrollBackToTop from "@src/helper/smoothScrollBackToTop";
import useScrollTrigger from "@src/customhook/useScrollTrigger";

const Btn = () => {
	const handleClick = e => {
		e.preventDefault();
		smoothScrollBackToTop({ targe: document.querySelector("#__next > div") });
	};
	const toggleShow = (e => {
		const trigger = useScrollTrigger(40);
		if (trigger == "default") {
			return false;
		}
		return true;
	})();
	return (
		<ButtonIcon onClick={handleClick} data-scroll-top width="w-7" height="h-7" fontSize="text-lg" custom={`z-30 border border-solid border-gray-500 fixed inline-block shadow-xl bottom-[40%] transition-all ease-out duration-300 ${toggleShow ? "right-[10%]" : "-right-full"}`}>
			<ArrowUp />
		</ButtonIcon>
	);
};
function ButtonScrollTop() {
	return (
		<AppenBody>
			<Btn />
		</AppenBody>
	);
}

export default ButtonScrollTop;
