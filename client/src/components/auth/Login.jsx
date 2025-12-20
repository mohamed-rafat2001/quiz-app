import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { login } from "../../services/userApi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Error from "../../ui/Error";
function Login() {
	const { register, handleSubmit, getValues, formState } = useForm();
	const navigate = useNavigate();
	const { errors } = formState;
	const [apiError, setApiError] = useState("");
	const queryClient = useQueryClient();
	const { mutate } = useMutation({
		mutationFn: login,
		onSuccess: (data) => {
			queryClient.setQueryData(["userData"], data);
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
			<div className="mb-5">
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
			{apiError && <Error error={apiError} />}
			<button
				className="btn fw-bold rounded-pill mt-1 w-100 py-2"
				style={{ backgroundColor: "#5046e5", color: "white" }}
			>
				Submit
			</button>
		</form>
	);
}
export default Login;
