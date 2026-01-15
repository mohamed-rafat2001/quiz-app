import { useState } from "react";
import UserDetails from "./UserDetails";
import UpdatePass from "./UpdatePass";
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
			<div className="bg-white rounded-3xl sm:rounded-4xl shadow-sm border border-gray-100 overflow-hidden mb-8">
				<div className="h-24 sm:h-32 bg-linear-to-r from-indigo-500 to-purple-600" />
				<div className="px-6 sm:px-8 pb-6 sm:pb-8 flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 -mt-10 sm:-mt-12">
					<div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-2xl shadow-md p-1">
						<div className="w-full h-full bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-2xl sm:text-3xl font-bold">
							{user?.name?.charAt(0).toUpperCase()}
						</div>
					</div>
					<div className="flex-1 text-center sm:text-left mb-2">
						<h1 className="text-xl sm:text-2xl font-bold text-gray-900">
							{user?.name}
						</h1>
						<div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-gray-500 mt-1">
							<span className="flex items-center gap-1 text-xs sm:text-sm">
								<HiEnvelope className="text-indigo-500" />
								{user?.email}
							</span>
							<span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider">
								{user?.role}
							</span>
						</div>
					</div>
				</div>

				{/* Tab Navigation */}
				<div className="px-6 sm:px-8 border-t border-gray-50 flex justify-center sm:justify-start gap-6 sm:gap-8">
					{["details", "password"].map((tab) => (
						<button
							key={tab}
							onClick={() => setActiveTab(tab)}
							className={`py-4 text-sm font-semibold transition-all relative ${
								activeTab === tab
									? "text-indigo-600"
									: "text-gray-400 hover:text-gray-600"
							}`}
						>
							{tab.charAt(0).toUpperCase() + tab.slice(1)}
							{activeTab === tab && (
								<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
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
