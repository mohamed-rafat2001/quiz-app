import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { updatePassword } from "../../services/userApi";
import Error from "../../ui/Error";
export default function UpdatePass() {
	const queryClient = useQueryClient();
	const { register, handleSubmit, formState } = useForm();
	const { errors } = formState;
	const { mutate, isLoading } = useMutation({
		mutationFn: updatePassword,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
	});
	function onSubmit(data) {
		mutate(data);
	}
	function OnError(e) {}
	return (
		<div className="UpdatePass">
			<form onSubmit={handleSubmit(onSubmit, OnError)} className="w-100">
				<div className="row d-flex  border-bottom py-3">
					<label
						htmlFor="current-password"
						className="col-sm-3 col-form-label fw-bold"
					>
						current password
					</label>
					<div className=" col-12 col-sm-7 col-md-5">
						<input
							className="w-100 rounded-5 p-2 border border-secondary-subtle shadow-none focus-ring"
							type="password"
							name="password"
							id="current-password"
							{...register("password", {
								required: "Password is required",
							})}
						/>
						{errors?.password && <Error error={errors.password.message} />}
					</div>
				</div>
				<div className=" row d-flex  border-bottom py-3">
					<label
						htmlFor="NewPassword"
						className="col-sm-3 col-form-label fw-bold"
					>
						New Password
					</label>
					<div className="col-12 col-sm-7 col-md-5">
						<input
							className="w-100 rounded-5 p-2 border border-secondary-subtle shadow-none focus-ring"
							id="NewPassword"
							type="password"
							name="newPassword"
							{...register("newPassword", {
								required: "new Password is required",
							})}
						/>
						{errors?.newPassword && (
							<Error error={errors.newPassword.message} />
						)}
					</div>
				</div>
				<div className=" row d-flex  py-3">
					<label
						htmlFor="confirm-Password"
						className="col-sm-3 col-form-label fw-bold"
					>
						confirm Password
					</label>
					<div className="col-12 col-sm-7 col-md-5 ">
						<input
							className="w-100 rounded-5 p-2 border border-secondary-subtle shadow-none focus-ring"
							id="confirm-Password"
							type="password"
							name="confirmPass"
							{...register("confirmPass", {
								required: "confirm Password is required",
							})}
						/>
						{errors?.confirmPass && (
							<Error error={errors.confirmPass.message} />
						)}
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
