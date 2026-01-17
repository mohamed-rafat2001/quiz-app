import { motion } from "framer-motion";
import { HiExclamationCircle } from "react-icons/hi2";

export default function Error({ error }) {
	if (!error) return null;

	return (
		<motion.div
			initial={{ opacity: 0, y: -5 }}
			animate={{ opacity: 1, y: 0 }}
			className="text-red-600 dark:text-red-500 text-xs font-black mt-1 ml-1 flex items-center gap-1"
		>
			<HiExclamationCircle className="shrink-0" />
			<span>{error}</span>
		</motion.div>
	);
}
