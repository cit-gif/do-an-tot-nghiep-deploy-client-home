import React from "react";
import HeaderApp from "@src/components/HeaderApp";
import FooterApp from "@src/components/FooterApp";

interface Props {
	children?: React.ReactNode;
}
export default function DefaultLayout(props: Props) {
	return (
		<div className="h-screen max-h-full min-w-[300px] absolute inset-0 overflow-y-auto overflow-x-hidden">
			<HeaderApp />
			{props.children}

			<FooterApp />
		</div>
	);
}
