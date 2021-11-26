import ButtonIcon from "@src/components/common/ButtonIcon";
import { useState, createRef, useEffect } from "react";
import { Search, XLg } from "react-bootstrap-icons";
import { useRouter } from "next/router";
import { useContext } from "react";
import { AppContext } from "@src/context";
function SearchMoblie(props) {
	const { show, setShow } = props;
	const [focused, setFocused] = useState(false);
	const router = useRouter();
	const { searchInput, setSearchInput } = useContext(AppContext);
	const handleSubmit = e => {
		e.preventDefault();

		router.push(`/tim-kiem?search=${searchInput}`);
	};
	const handleChange = e => {
		setSearchInput(e.target.value);
	};
	useEffect(() => {
		inputRef.current.focus();
	}, [show]);
	const inputRef = createRef(null);
	return (
		<div className={`flex flex-nowrap justify-between py-2 px-8 max-w-full items-center ${show ? "animate-fade" : "invisible hidden"}`}>
			<div
				className="flex items-center justify-center"
				onClick={() => {
					setShow(false);
				}}>
				<ButtonIcon>
					<XLg />
				</ButtonIcon>
			</div>
			<form onSubmit={handleSubmit} className={`flex flex-row flex-nowrap w-10/12 border-2 rounded-full overflow-hidden pl-4 pr-1 py-1 hover:border-primary  ease-linear transition-all duration-200 ${focused ? "border-primary" : ""}`}>
				<input
					ref={inputRef}
					type="text"
					className="outline-none text-base bg-transparent w-full"
					onBlur={() => {
						setFocused(false);
					}}
					onFocus={() => {
						setFocused(true);
					}}
					onChange={handleChange}
					value={searchInput}
					placeholder="Nhập từ khóa"
				/>
				<ButtonIcon type="submit" height="h-8" width="w-8" fontSize="text-xl">
					<Search />
				</ButtonIcon>
			</form>
		</div>
	);
}

export default SearchMoblie;
