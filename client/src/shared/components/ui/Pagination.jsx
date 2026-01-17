import React from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

const Pagination = ({ page, limit, total, onPageChange, className = "" }) => {
	const totalPages = Math.ceil(total / limit);

	if (totalPages <= 1) return null;

	const handlePrev = () => {
		if (page > 1) onPageChange(page - 1);
	};

	const handleNext = () => {
		if (page < totalPages) onPageChange(page + 1);
	};

	return (
		<div
			className={`flex items-center justify-between gap-4 mt-6 ${className}`}
		>
			<button
				onClick={handlePrev}
				disabled={page === 1}
				className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
			>
				<HiChevronLeft className="text-lg" />
				Previous
			</button>

			<div className="flex items-center gap-2">
				<span className="text-sm font-medium text-gray-500 dark:text-gray-400">
					Page
				</span>
				<span className="text-sm font-black text-gray-900 dark:text-white">
					{page}
				</span>
				<span className="text-sm font-medium text-gray-500 dark:text-gray-400">
					of
				</span>
				<span className="text-sm font-black text-gray-900 dark:text-white">
					{totalPages}
				</span>
			</div>

			<button
				onClick={handleNext}
				disabled={page === totalPages}
				className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
			>
				Next
				<HiChevronRight className="text-lg" />
			</button>
		</div>
	);
};

export default Pagination;
