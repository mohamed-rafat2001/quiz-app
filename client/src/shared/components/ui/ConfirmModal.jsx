import { motion, AnimatePresence } from "framer-motion";
import { HiExclamationTriangle, HiXMark } from "react-icons/hi2";

const ConfirmModal = ({
	isOpen,
	onClose,
	onConfirm,
	title = "Are you sure?",
	message = "This action cannot be undone.",
	confirmText = "Delete",
	cancelText = "Cancel",
	isPending = false,
	variant = "danger", // 'danger' or 'info'
}) => {
	const variantClasses = {
		danger: {
			iconBg: "bg-red-50 dark:bg-red-500/10",
			iconColor: "text-red-600 dark:text-red-400",
			confirmBtn: "bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600 shadow-red-100 dark:shadow-red-500/10",
		},
		info: {
			iconBg: "bg-indigo-50 dark:bg-indigo-500/10",
			iconColor: "text-indigo-600 dark:text-indigo-400",
			confirmBtn: "bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-indigo-100 dark:shadow-indigo-500/10",
		},
	};

	const currentVariant = variantClasses[variant] || variantClasses.danger;

	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="absolute inset-0 bg-gray-900/60 dark:bg-black/80 backdrop-blur-sm"
					/>
					<motion.div
						initial={{ scale: 0.9, opacity: 0, y: 20 }}
						animate={{ scale: 1, opacity: 1, y: 0 }}
						exit={{ scale: 0.9, opacity: 0, y: 20 }}
						className="relative bg-white dark:bg-gray-800 rounded-[2rem] p-8 max-w-md w-full shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden"
					>
						{/* Close Button */}
						<button
							onClick={onClose}
							className="absolute top-6 right-6 p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
						>
							<HiXMark className="text-xl" />
						</button>

						<div className="text-center">
							<div className={`w-20 h-20 ${currentVariant.iconBg} rounded-3xl flex items-center justify-center ${currentVariant.iconColor} mx-auto mb-6 shadow-sm`}>
								<HiExclamationTriangle className="text-4xl" />
							</div>
							
							<h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
								{title}
							</h3>
							
							<p className="text-gray-500 dark:text-gray-400 mb-8 font-medium leading-relaxed">
								{message}
							</p>

							<div className="flex flex-col sm:flex-row gap-3">
								<button
									onClick={onClose}
									className="flex-1 px-6 py-3.5 rounded-2xl border border-gray-200 dark:border-white/10 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all active:scale-95"
								>
									{cancelText}
								</button>
								<button
									onClick={() => {
										onConfirm();
										onClose();
									}}
									disabled={isPending}
									className={`flex-1 px-6 py-3.5 rounded-2xl ${currentVariant.confirmBtn} text-white font-bold shadow-lg transition-all disabled:opacity-70 active:scale-95`}
								>
									{isPending ? "Processing..." : confirmText}
								</button>
							</div>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
};

export default ConfirmModal;
