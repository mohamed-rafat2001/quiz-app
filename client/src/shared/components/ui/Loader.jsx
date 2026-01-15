import { motion } from "framer-motion";

export default function Loader() {
	return (
		<div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
			<motion.div
				animate={{
					rotate: 360,
					borderRadius: ["25%", "25%", "50%", "50%", "25%"],
				}}
				transition={{
					duration: 2,
					ease: "linear",
					repeat: Infinity,
				}}
				className="w-16 h-16 border-4 border-indigo-600 border-t-transparent flex items-center justify-center"
			/>
			<motion.h2
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
				className="mt-6 text-indigo-600 font-bold text-lg tracking-widest uppercase"
			>
				Loading
			</motion.h2>
		</div>
	);
}
