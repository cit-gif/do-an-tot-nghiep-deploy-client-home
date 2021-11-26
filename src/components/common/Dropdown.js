import Button from "./Button";
import { useEffect, useState, createRef } from "react";
import { makeid } from "@src/helper/randomId";
const Dropdown = props => {
	const { direction, relative, onMouseEnter = e => {}, absolute, shadow = "shadow-upShadow", background = "bg-white before:bg-white" } = props;
	const containerRef = createRef(null);
	const absoluteRef = createRef(null);
	const getStylesFromDirection = (() => {
		if (direction === "right-down") {
			return "top-full left-0";
		}
		if (direction === "left-down") {
			return "top-full right-0";
		}
		if (direction === "center-down") {
			return "top-full left-1/2 -translate-x-1/2";
		}
		if (direction === "right-up") {
			return "bottom-full left-0";
		}
		if (direction === "center-up") {
			return "bottom-full left-1/2 -translate-x-1/2";
		}
		if (direction === "left-up") {
			return "bottom-full right-0";
		}
	})();
	const [classPosition, setClassPosition] = useState({
		upOrDown: "",
		newClass: "",
	});
	useEffect(() => {
		const newClassPosition = makeid(10);
		// can giua mui ten div
		let containerRefWidth;
		let positionBefore;
		let innerStyle = "";
		containerRefWidth = containerRef.current.offsetWidth;
		positionBefore = (Math.round(containerRefWidth / 2) - 7).toString() + "px";
		if (direction === "right-down") {
			setClassPosition({
				upOrDown: "before:-top-1.5",
				newClass: newClassPosition,
			});
			innerStyle += `.${newClassPosition}:before{left: ${positionBefore}}`;
		}
		if (direction === "left-down") {
			setClassPosition({
				upOrDown: "before:-top-1.5",
				newClass: newClassPosition,
			});
			innerStyle += `.${newClassPosition}:before{right: ${positionBefore}}`;
		}

		if (direction === "right-up") {
			setClassPosition({
				upOrDown: "before:-bottom-1.5",
				newClass: newClassPosition,
			});
			innerStyle += `.${newClassPosition}:before{left: ${positionBefore}}`;
		}

		if (direction === "left-up") {
			setClassPosition({
				upOrDown: "before:-bottom-1.5",
				newClass: newClassPosition,
			});
			innerStyle += `.${newClassPosition}:before{right: ${positionBefore}}`;
		}
		const style = document.createElement("style");
		style.innerHTML = innerStyle; //Add style content can also use the above mentioned `insertRule`, the hard coding in the relative example will be more elegant.
		document.head.appendChild(style);

		if (direction === "center-down") {
			setClassPosition({
				upOrDown: "before:-top-1.5",
				newClass: "before:left-1/2 before:-translate-x-1/2",
			});
		}
		if (direction === "center-up") {
			setClassPosition({
				upOrDown: "before:-bottom-1.5",
				newClass: "before:left-1/2 before:-translate-x-1/2",
			});
		}

		return () => {
			if (style) {
				document.head.removeChild(style);
			}
		};
	}, []);
	const [show, setShow] = useState(false);
	return (
		<div
			ref={containerRef}
			onMouseEnter={e => {
				onMouseEnter(e);
				setShow(true);
			}}
			onMouseLeave={() => {
				setShow(false);
			}}
			className={`relative inline-flex items-center justify-center m-0 p-0`}>
			{relative}
			<div className={`absolute transition-all z-20 ease-in duration-200 ${show ? "" : "hiden invisible"}  bg-transparent m-0 ${direction.includes("-up") ? "pb-3" : "pt-3"} ${getStylesFromDirection}`}>
				<div ref={absoluteRef} className={`${background} ${shadow} relative rounded-lg py-4 before:absolute  before:h-3 before:w-3 before:rotate-45 ${classPosition.upOrDown} ${classPosition.newClass}`}>
					{absolute}
				</div>
			</div>
		</div>
	);
};

// function DropdowArrow() {
// 	return (
// 		<DropdownArrowContainer
// 			direction='right-down'
// 			direction='right-up'
// 			// direction='left-down'
// 			// direction='left-up'
// 			direction='center-up'
// 			// direction='center-down'
// 			relative={
// 				<div className='w-60'>
// 					<Button title='button' />
// 				</div>
// 			}
// 			absolute={
// 				<ul>
// 					<li>ádsaddasssssssssssssssssssfdssssssssssssssssssssss</li>
// 					<li>ádsad</li>
// 					<li>ádsad</li>
// 					<li>ádsad</li>
// 					<li>ádsad</li>
// 				</ul>
// 			}
// 		/>
// 	);
// }

export default Dropdown;
