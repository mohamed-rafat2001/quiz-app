import { useState } from "react";
import UserDetails from "./UserDetails";
import UpdatePass from "./UpdatePass";
import ProfileAvatar from "./ProfileAvatar";
import { useUser } from "../../auth/hooks/useAuth";
import Loader from "../../../shared/components/ui/Loader";
import { HiEnvelope } from "react-icons/hi2";

function Profile() {
	const [activeTab, setActiveTab] = useState("details");
	const { data: user, isLoading } = useUser();

	if (isLoading) return <Loader />;

	return (
		<div className="max-w-4xl mx-auto">
			{/* Profile Header Card */}
			<div className="bg-white dark:bg-white/[0.03] rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden mb-8 transition-colors duration-300">
				<div className="h-24 sm:h-32 bg-linear-to-r from-indigo-500 to-purple-600" />
				<div className="px-6 sm:px-8 pb-6 sm:pb-8 flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 -mt-10 sm:-mt-12">
					<ProfileAvatar user={user} />
					<div className="flex-1 text-center sm:text-left mb-2">
						<h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
							{user?.name}
						</h1>
						<div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-gray-600 dark:text-gray-400 mt-1">
							<span className="flex items-center gap-1 text-xs sm:text-sm font-bold">
								<HiEnvelope className="text-indigo-500 dark:text-indigo-400" />
								{user?.email}
							</span>
							<span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider">
								{user?.role}
							</span>
						</div>
					</div>
				</div>

				{/* Tab Navigation */}
				<div className="px-6 sm:px-8 border-t border-gray-50 dark:border-white/5 flex justify-center sm:justify-start gap-6 sm:gap-8">
					{["details", "password"].map((tab) => (
						<button
							key={tab}
							onClick={() => setActiveTab(tab)}
							className={`py-4 text-sm font-black transition-all relative ${
								activeTab === tab
									? "text-indigo-600 dark:text-indigo-400"
									: "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
							}`}
						>
							{tab.charAt(0).toUpperCase() + tab.slice(1)}
							{activeTab === tab && (
								<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400" />
							)}
						</button>
					))}
				</div>
			</div>

			{/* Tab Content */}
			<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
				{activeTab === "details" ? <UserDetails user={user} /> : <UpdatePass />}
			</div>
		</div>
	);
}

export default Profile;
