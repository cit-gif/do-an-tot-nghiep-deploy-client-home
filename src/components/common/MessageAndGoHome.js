import GoToBackHome from "./GoToBackHome";
function MessageAndGoHome(props) {
	return (
		<div className=' flex items-center justify-center flex-col text-2xl font-medium py-28 my-40'>
			<h2>{props.message}</h2>
			<GoToBackHome />
		</div>
	);
}

export default MessageAndGoHome;
