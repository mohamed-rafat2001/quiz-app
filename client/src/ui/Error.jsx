/* eslint-disable react/prop-types */
export default function Error({ error }) {
	return (
		<div className="text-center text-danger mb-0 pb-0  ">
			<small>{error}</small>
		</div>
	);
}
