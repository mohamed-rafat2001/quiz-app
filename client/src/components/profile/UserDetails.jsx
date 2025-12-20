import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { updateMe } from "../../services/userApi";

export default function UserDetails() {
	const queryClient = useQueryClient();

	const { mutate, isLoading, data } = useMutation({
		mutationFn: updateMe,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
		onError: (e) => {
			console.log(e);
		},
	});
	const { register, handleSubmit } = useForm();
	function onSubmit(data) {
		mutate(data);
	}
	function OnError(e) {}
	return (
		<div className="UserDetails">
			<form onSubmit={handleSubmit(onSubmit, OnError)} className="w-100">
				<div className="row d-flex  border-bottom py-4">
					<label htmlFor="name" className="col-sm-3 col-form-label fw-bold">
						Name
					</label>
					<div className=" col-12 col-sm-7 col-md-5">
						<input
							className="w-100 rounded-5 p-2 border border-secondary-subtle shadow-none focus-ring"
							type="text"
							name="name"
							id="name"
							{...register("name")}
						/>
					</div>
				</div>
				<div className=" row d-flex  py-4">
					<label htmlFor="email" className="col-sm-3 col-form-label fw-bold">
						Email
					</label>
					<div className="col-12 col-sm-7 col-md-5 ">
						<input
							className="w-100 rounded-5 p-2 border border-secondary-subtle shadow-none focus-ring"
							id="email"
							type="email"
							name="email"
							{...register("email")}
						/>
					</div>
				</div>

				<div className="row d-flex justify-content-end">
					<button
						className="col-12 col-sm-2  btn fw-bold rounded-pill py-1"
						style={{
							backgroundColor: "#5046e5",
							color: "white",
						}}
					>
						Update
					</button>
				</div>
			</form>
		</div>
	);
}
