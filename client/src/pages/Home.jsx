import StartQuiz from "../features/home/components/StartQuiz";
import { motion } from "framer-motion";

export default function Home() {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="py-6 sm:py-12 px-4"
		>
			<div className="max-w-4xl mx-auto text-center mb-10 sm:mb-16">
				<motion.h1
					initial={{ y: -20 }}
					animate={{ y: 0 }}
					className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-6 tracking-tight"
				>
					Ready to test your <span className="text-indigo-600">skills?</span>
				</motion.h1>
				<p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
					Enter your quiz credentials below to begin. Make sure you have your
					Quiz ID and Password ready.
				</p>
			</div>

			<StartQuiz />
		</motion.div>
	);
}
