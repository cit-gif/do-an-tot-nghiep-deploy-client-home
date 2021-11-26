import { useEffect, useState } from "react";

export default function useScrollTrigger(query) {
	const [trigger, setTrigger] = useState("default");
	useEffect(() => {
		const parentElement = document.querySelector("#__next > div");
		let prevScrollpos = parentElement.scrollTop;
		const scroll = () => {
			let currentScrollPos = parentElement.scrollTop;
			if (currentScrollPos <= query) {
				return setTrigger("default");
			}
			if (currentScrollPos < query + 7) {
				return setTrigger("hidden");
			}
			if (prevScrollpos > currentScrollPos) {
				setTrigger("show");
			} else {
				setTrigger("hidden");
			}
			prevScrollpos = currentScrollPos;
		};
		parentElement.addEventListener("scroll", scroll);
		return () => {
			parentElement.removeEventListener("scroll", scroll);
		};
	}, [trigger, query]);
	return trigger;
}
