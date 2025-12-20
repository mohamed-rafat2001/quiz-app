import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { signUp } from "../../services/userApi";
import Error from "../../ui/Error";

function SignUp() {
	const { register, handleSubmit, getValues, formState } = useForm();
	const { errors } = formState;
	const [apiError, setApiError] = useState("");
	const navigate = useNavigate();

	const { mutate, isLoading } = useMutation({
		mutationFn: signUp,
		onSuccess: () => {
			navigate("/home");
		},
		onError: (err) => {
			setApiError(err.message);
		},
	});
	function onSubmit(data) {
		mutate(data);
	}
	function OnError(e) {}
	return (
		<form onSubmit={handleSubmit(onSubmit, OnError)} className="w-100">
			{apiError && <Error error={apiError} />}
			<div className="mb-3">
				<input
					className="w-100 p-3 rounded-pill  border border-secondary-subtle shadow-none focus-ring"
					type="text"
					placeholder="name"
					name="name"
					{...register("name", { required: "name is required" })}
				/>
				{errors?.name && <Error error={errors.name.message} />}
			</div>
			<div className="mb-3">
				<input
					className="w-100 rounded-pill p-3 border border-secondary-subtle shadow-none focus-ring"
					type="email"
					placeholder="Email"
					name="email"
					{...register("email", { required: "email is required" })}
				/>
				{errors?.email && <Error error={errors.email.message} />}
			</div>
			<div className="mb-3">
				<input
					className="w-100 rounded-pill p-3 border border-secondary-subtle shadow-none focus-ring"
					type="password"
					placeholder="Password"
					name="password"
					{...register("password", { required: "password is required" })}
				/>
				{errors?.password && <Error error={errors.password.message} />}
			</div>
			<div className="mb-3">
				<input
					className="w-100 rounded-pill p-3 border border-secondary-subtle shadow-none focus-ring"
					type="password"
					placeholder="confirm Password"
					name="confirmPass"
					{...register("confirmPass", {
						required: "confirm Password is required",
					})}
				/>
				{errors?.confirmPass && <Error error={errors.confirmPass.message} />}
			</div>
			<div className="mb-2">
				<input
					className="form-check-input me-3"
					type="radio"
					value="student"
					id="student"
					name="role"
				/>
				<label htmlFor="student" className="me-3">
					student
				</label>
				<input
					className="form-check-input me-3"
					type="radio"
					value="teacher"
					id="teacher"
					name="role"
				/>
				<label htmlFor="teacher">teacher</label>
			</div>
			<button
				className="btn  w-100 rounded-pill py-2 fw-bold"
				style={{ backgroundColor: "#5046e5", color: "white" }}
			>
				Submit
			</button>
		</form>
	);
}
export default SignUp;
