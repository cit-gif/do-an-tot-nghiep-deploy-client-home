import { StarFill } from "react-bootstrap-icons";
import { useState } from "react";
function Rated(props) {
	const { size = "text-lg", star = 0, click, width = "w-full", changeClick } = props;

	return (
		<div className={`flex space-x-1 flex-nowrap items-center justify-between ${width}`}>
			{!click
				? Array.from(new Array(5)).map((item, key) => {
						return (
							<span className={`inline-block ${size} ${key + 1 <= Math.ceil(star) ? "text-yellow-500" : "text-gray-400"}`} key={key}>
								<StarFill />
							</span>
						);
				  })
				: Array.from(new Array(5)).map((item, key) => {
						// click
						return (
							<span
								onClick={() => {
									changeClick(key + 1);
								}}
								className={`inline-block cursor-pointer ${size} ${key + 1 <= Math.ceil(star) ? "text-yellow-500" : "text-gray-400"}`}
								key={key}
							>
								<StarFill />
							</span>
						);
				  })}
		</div>
	);
}

export default Rated;
