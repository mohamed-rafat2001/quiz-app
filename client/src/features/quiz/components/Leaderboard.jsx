import React from "react";
import { HiTrophy } from "react-icons/hi2";
import { Link } from "react-router-dom";

const Leaderboard = ({
	quiz,
	className = "mt-6 pt-6 border-t border-gray-100 dark:border-white/5",
}) => {
	if (
		!quiz.firstInQuiz?.length &&
		!quiz.secondInQuiz?.length &&
		!quiz.thirdInQuiz?.length
	) {
		return null;
	}

	return (
		<div className={className}>
			<div className="flex items-center gap-2 mb-4">
				<HiTrophy className="text-yellow-500 text-lg" />
				<h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">
					Leaderboard
				</h4>
			</div>
			<div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar pr-1 -mr-1">
				{[
					{
						data: quiz.firstInQuiz,
						rank: 1,
						label: "1st Place",
						color: "text-yellow-500",
						bg: "bg-yellow-100 dark:bg-yellow-500/20",
					},
					{
						data: quiz.secondInQuiz,
						rank: 2,
						label: "2nd Place",
						color: "text-gray-400",
						bg: "bg-gray-100 dark:bg-gray-500/20",
					},
					{
						data: quiz.thirdInQuiz,
						rank: 3,
						label: "3rd Place",
						color: "text-amber-600",
						bg: "bg-amber-100 dark:bg-amber-500/20",
					},
				].map(
					(tier) =>
						tier.data?.length > 0 && (
							<div key={tier.rank}>
								<div
									className={`text-[10px] font-black uppercase tracking-widest mb-2 ${tier.color} flex items-center gap-2 opacity-80`}
								>
									<span className="w-1 h-1 rounded-full bg-current" />
									{tier.label}
								</div>
								<div className="space-y-2">
									{tier.data.map((entry, idx) => (
										<Link
											to={`/app/users/${entry.studentId?._id}`}
											key={idx}
											className="flex items-center gap-3 p-2 rounded-xl transition-all hover:bg-gray-50 dark:hover:bg-white/[0.03] border border-transparent hover:border-gray-100 dark:hover:border-white/5"
										>
											<div className="relative">
												<div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-white/10 shrink-0">
													{entry.studentId?.image ? (
														<img
															src={entry.studentId.image}
															alt={entry.studentId.name}
															className="w-full h-full object-cover"
															referrerPolicy="no-referrer"
															loading="lazy"
															onError={(e) => {
																e.target.onerror = null;
																e.target.style.display = 'none';
																e.target.parentElement.innerHTML = `<span class="text-[10px] font-black text-gray-400 dark:text-white/40">${entry.studentId?.name?.charAt(0).toUpperCase()}</span>`;
															}}
														/>
													) : (
														<span className="text-[10px] font-black text-gray-400 dark:text-white/40">
															{entry.studentId?.name?.charAt(0).toUpperCase()}
														</span>
													)}
												</div>
												<div
													className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-black ${tier.bg} ${tier.color} border-2 border-white dark:border-gray-950`}
												>
													#{tier.rank}
												</div>
											</div>
											<div className="flex-1 min-w-0">
												<div className="flex items-center justify-between gap-2">
													<p className="text-xs font-bold text-gray-700 dark:text-white/90 truncate">
														{entry.studentId?.name || "Unknown"}
													</p>
													<p className={`text-[10px] font-black ${tier.color}`}>
														{entry.Score} pts
													</p>
												</div>
											</div>
										</Link>
									))}
								</div>
							</div>
						)
				)}
			</div>
		</div>
	);
};

export default Leaderboard;
