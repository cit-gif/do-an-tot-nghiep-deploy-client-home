function TitleCate(props) {
	return (
		<h2 className="mb-10 text-3xl font-bold block">
			{props.title ? props.title : ""} {props.children}
		</h2>
	);
}

export default TitleCate;
