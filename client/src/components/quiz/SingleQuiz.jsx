import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { getQuiz } from "../../services/quizApi";
import Error from "../../ui/Error";
import Loader from "../../ui/Loader";
import { addAnswer } from "../../services/quizAnswerApi";

export default function SingleQuiz() {
	const { id } = useParams();
	const { register, handleSubmit, formState } = useForm();

	const { errors } = formState;
	const { mutate } = useMutation({
		mutationFn: addAnswer,
		onSuccess: (data) => {
			console.log(data);
		},
		onError: () => {},
	});

	const {
		data: quiz,
		error,
		isLoading,
	} = useQuery({
		queryKey: ["quiz"],
		queryFn: () => getQuiz(id),
	});

	function Submit(data) {
		const questions = data.answer.map((q) => JSON.parse(q));
		mutate({ questions, id });
		console.log(data);
	}

	return (
		<div className="single-quiz container">
			{isLoading && <Loader />}
			<h1>hello {quiz?.quizName}</h1>
			<form onSubmit={handleSubmit(Submit)}>
				{quiz?.questions.map((el, index) => (
					<div className="mb-4  row " key={el._id}>
						<label className="col-12 col-form-label fw-bold">
							{index + 1}) {el.ques}
						</label>
						<div className="col-12 ">
							{el.answers.map((answer, i) => (
								<div className="mb-2" key={i}>
									<input
										type="radio"
										id={answer + index}
										className="form-check-input me-3"
										{...register(`answer[${index}]`)}
										value={JSON.stringify({
											answer: answer,
											_id: el._id,
											ques: el.ques,
										})}
									/>
									<label htmlFor={answer + index}>{answer}</label>
								</div>
							))}
							{errors?.quizId && <Error error={errors.quizId.message} />}
						</div>
					</div>
				))}
				<div className="col-12 text-center">
					<button
						className="btn fw-bold rounded-pill py-2"
						style={{
							backgroundColor: "#5046e5",
							color: "white",
							width: "30%",
						}}
					>
						Send
					</button>
				</div>
			</form>
		</div>
	);
}
