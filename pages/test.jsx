import React, { useEffect } from "react";

export default function Test() {
	useEffect(() => {
		console.log(document.cookie);
	}, []);
	return <div>test</div>;
}
