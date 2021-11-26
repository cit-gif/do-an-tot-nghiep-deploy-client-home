import NoSSR from "./NoSSR";
import React from "react";
import ReactDOM from "react-dom";

class Element extends React.Component {
	constructor(props) {
		super(props);
		this.el = document.createElement("div");
		this.el.setAttribute("data-show", "true");
	}

	componentDidMount() {
		document.querySelector("#__next > div").appendChild(this.el);
	}

	componentWillUnmount() {
		document.querySelector("#__next > div").removeChild(this.el);
	}

	render() {
		return ReactDOM.createPortal(this.props.children, this.el);
	}
}
const AppenBody = (props) => {
	return (
		<NoSSR>
			<Element>{props.children}</Element>
		</NoSSR>
	);
};
export default AppenBody;
