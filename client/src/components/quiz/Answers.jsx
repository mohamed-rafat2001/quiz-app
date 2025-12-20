import { Link } from "react-router-dom";

export default function Answers() {
	return (
		<div className="Answers container  table-responsive">
			<table className="table  text-center caption-top ">
				<caption className="fw-bold">List Of Quizs Asnwers.</caption>
				<thead>
					<tr className="table-light ">
						<th scope="col">#</th>
						<th scope="col">Quiz Name</th>
						<th scope="col">Answers</th>
						<th scope="col">Score</th>
						<th scope="col">Status</th>
						<th scope="col">Date</th>
						<th scope="col">Quiz</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">1</th>
						<td>math</td>
						<td>
							<Link to="555">
								<i className="bi bi-eye-fill fs-4"></i>
							</Link>
						</td>
						<td>50</td>
						<td className="fw-bold text-danger ">Failed</td>
						<td>22-8-2001</td>
						<td>
							<Link to={`/singleQuiz/${555}`}>
								<i className="bi bi-eye-fill fs-4"></i>
							</Link>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}
