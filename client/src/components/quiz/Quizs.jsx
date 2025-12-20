import { useState } from "react";
import { Link } from "react-router-dom";
export default function Quizs() {
	const [inputs, setInputs] = useState(0);
	return (
		<div className="Answers container  table-responsive">
			<table className="table  text-center caption-top ">
				<caption className="fw-bold">List Of Quizs.</caption>
				<thead>
					<tr className="table-light ">
						<th scope="col">#</th>
						<th scope="col">Quiz Name</th>
						<th scope="col">Students Number</th>
						<th scope="col">Score</th>
						<th scope="col">Pass</th>
						<th scope="col" colSpan={2}>
							Firsts
						</th>

						<th scope="col">Id</th>
						<th scope="col">Password</th>
						<th scope="col">Status</th>
						<th scope="col">Expire Date</th>
						<th scope="col">created At</th>
						<th scope="col">Answers</th>
						<th scope="col">Quiz</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">1</th>
						<td>math</td>
						<td>50</td>
						<td>20</td>
						<td>100</td>
						<td colSpan={2} className="p-0">
							<table className="table table-borderless">
								<thead>
									<tr>
										<th>Name</th>
										<th>Score</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>Mohamed rafat</td>
										<td>50</td>
									</tr>
									<tr>
										<td>Mohamed rafat</td>
										<td>50</td>
									</tr>
								</tbody>
							</table>
						</td>

						<td>55555555555555</td>
						<td>mohamed5555555</td>
						<td className="fw-bold text-danger ">closed</td>
						<td>22-8-2001</td>
						<td>22-8-2001</td>
						<td>
							<Link to="Answers">
								<i className="bi bi-eye-fill fs-4"></i>
							</Link>
						</td>
						<td>
							<Link to={`/singleQuiz/${555}`}>
								<i className="bi bi-eye-fill fs-4"></i>
							</Link>
						</td>
					</tr>
					<tr>
						<th scope="row">1</th>
						<td>math</td>
						<td>50</td>
						<td>20</td>
						<td>100</td>
						<td colSpan={2} className="p-0">
							<table className="table table-borderless">
								<thead>
									<tr>
										<th>Name</th>
										<th>Score</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>Mohamed rafat</td>
										<td>50</td>
									</tr>
									<tr>
										<td>Mohamed rafat</td>
										<td>50</td>
									</tr>
								</tbody>
							</table>
						</td>

						<td>55555555555555</td>
						<td>mohamed5555555</td>
						<td className="fw-bold text-danger ">closed</td>
						<td>22-8-2001</td>
						<td>22-8-2001</td>
						<td>
							<Link to="Answers">
								<i className="bi bi-eye-fill fs-4"></i>
							</Link>
						</td>
						<td>
							<Link to={`/singleQuiz/${555}`}>
								<i className="bi bi-eye-fill fs-4"></i>
							</Link>
						</td>
					</tr>
				</tbody>
			</table>
			{/* <input
				placeholder="enter number of questions"
				onChange={(e) => {
					setInputs(e.target.value);
				}}
			/> */}
			{/* <button
				onClick={() => {
					setInputs((prev) => +prev + 1);
				}}
			>
				add new question
			</button>
			{[...Array(inputs)].map((e, i) => (
				<input key={i} />
			))} */}
		</div>
	);
}
