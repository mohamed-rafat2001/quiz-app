
const WelcomeHeader = ({ user, role }) => {
	const greeting = () => {
		const hour = new Date().getHours();
		if (hour < 12) return "Good morning";
		if (hour < 18) return "Good afternoon";
		return "Good evening";
	};

	const roleLabels = {
		admin: "Administrator",
		teacher: "Teacher",
		student: "Student",
	};

	return (
		<div
			className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg"
		>
			<div className="relative z-10">
				<p className="text-indigo-100 font-medium mb-1">{greeting()},</p>
				<h1 className="text-3xl font-black mb-2 leading-tight">
					{user?.name || "User"}
				</h1>
				<div className="text-indigo-100 flex items-center gap-2">
					<span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-bold border border-white/10">
						{roleLabels[role] || "User"}
					</span>
					<span className="font-medium">Welcome to QUIZMASTER Dashboard</span>
				</div>
			</div>
			<div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
			<div className="absolute bottom-0 left-1/2 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl translate-y-1/2" />
		</div>
	);
};

export default WelcomeHeader;
