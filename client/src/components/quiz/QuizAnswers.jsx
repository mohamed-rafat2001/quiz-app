import { useParams } from "react-router-dom";

export default function QuizAnswers() {
	const { id } = useParams();
	return <h1>{id}</h1>;
}
