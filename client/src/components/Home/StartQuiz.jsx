import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { startQuiz } from "../../services/quizApi";
import Error from "../../ui/Error";
export default function StartQuiz() {
	const { register, handleSubmit, formState } = useForm();
	const navigate = useNavigate();
	const { errors } = formState;
	const [apiError, setApiError] = useState("");
	const queryClient = useQueryClient();
	const { mutate } = useMutation({
		mutationFn: startQuiz,
		onSuccess: (data) => {
			navigate(`/singleQuiz/${data._id}`);
		},
		onError: (err) => {
			console.log(err.message);
			setApiError(err.message);
		},
	});
	function onSubmit(data) {
		mutate(data);
	}
	// function OnError(e) {}
	return (
		<div
			className="Home row d-flex justify-content-center align-items-center"
			style={{ height: "100vh", margin: 0 }}
		>
			<div className="content col-12 col-md-8 col-lg-7 ">
				<h1 className="text-center fw-bold">start Quiz Now.</h1>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="mt-4 border rounded-4 p-5"
				>
					<div className="mb-4  row d-flex justify-content-between">
						<label htmlFor="quizId" className="col-sm-3 col-form-label fw-bold">
							Quiz Id
						</label>
						<div className="col-sm-9">
							<input
								type="text"
								className="form-control border rounded-pill border-secondary-subtle shadow-none focus-ring"
								id="quizId"
								name="quizId"
								{...register("quizId", { required: "ID is required" })}
							/>
							{errors?.quizId && <Error error={errors.quizId.message} />}
						</div>
					</div>
					<div className="mb-4 row d-flex justify-content-between">
						<label
							htmlFor="quizPassword"
							className="col-sm-3 col-form-label fw-bold"
						>
							Password
						</label>
						<div className="col-sm-9">
							<input
								type="password"
								className="form-control border rounded-pill border-secondary-subtle shadow-none focus-ring"
								id="quizPassword"
								name="quizPassword"
								{...register("quizPassword", {
									required: "Password is required",
								})}
							/>
							{errors?.quizPassword && (
								<Error error={errors.quizPassword.message} />
							)}
						</div>
					</div>
					<div className=" row">
						<div className="col-sm-9 ms-auto">
							<button
								className="btn w-100 fw-bold rounded-pill  py-2"
								style={{ backgroundColor: "#5046e5", color: "white" }}
								// style={{ backgroundColor: "black", color: "white" }}
							>
								Start
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
