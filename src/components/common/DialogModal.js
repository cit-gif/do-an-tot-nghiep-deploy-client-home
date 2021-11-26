import AppenBody from "./AppenBody";
export default function DialogModal(props) {
	const show = props.show;
	const onClick = props.onClick;
	return show ? (
		<AppenBody>
			<div onClick={onClick} className={`fixed inset-0 bg-black bg-opacity-70 ${props.zIndex ? props.zIndex : "z-10"} animate-modalDialog`}></div>
		</AppenBody>
	) : (
		""
	);
}
