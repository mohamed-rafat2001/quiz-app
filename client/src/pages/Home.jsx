import StartQuiz from "../features/home/components/StartQuiz";

export default function Home() {
	return (
		<div className="py-6 sm:py-12 px-4">
			<div className="max-w-4xl mx-auto text-center mb-10 sm:mb-16">
				<h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-6 tracking-tight">
					Ready to test your <span className="text-indigo-600">skills?</span>
				</h1>
				<p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
					Enter your quiz credentials below to begin. Make sure you have your
					Quiz ID and Password ready.
				</p>
			</div>

			<StartQuiz />
		</div>
	);
}
