import Link from "next/link";
function Logo() {
	return (
		<>
			<Link href='/'>
				<a className='text-4xl xs:text-4xl mx-2'>
					Phone <span className='text-main'>X</span>
				</a>
			</Link>
		</>
	);
}

export default Logo;
