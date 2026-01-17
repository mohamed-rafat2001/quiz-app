import { motion } from "framer-motion";
import { useAdminUsers, useDeleteUser, useUpdateUser } from "../hooks/useAdmin";
import { HiTrash, HiShieldCheck, HiUserMinus } from "react-icons/hi2";

export default function AdminUsers() {
	const { data: users, isLoading } = useAdminUsers();
	const { mutate: deleteUser } = useDeleteUser();
	const { mutate: updateUser } = useUpdateUser();

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
			</div>
		);
	}

	const handleRoleChange = (id, currentRole) => {
		const newRole = currentRole === "student" ? "teacher" : "student";
		updateUser({ id, data: { role: newRole } });
	};

	const handleToggleBlock = (id, isActive) => {
		updateUser({ id, data: { active: !isActive } });
	};

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-black text-gray-900 dark:text-white">
					User Management
				</h1>
				<p className="text-gray-500 dark:text-gray-400 mt-2 font-bold">
					Manage platform users and roles.
				</p>
			</div>

			<div className="bg-white dark:bg-white/[0.03] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden transition-colors duration-300">
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5">
								<th className="px-8 py-5 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
									User
								</th>
								<th className="px-8 py-5 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
									Role
								</th>
								<th className="px-8 py-5 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
									Status
								</th>
								<th className="px-8 py-5 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest text-right">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 dark:divide-white/5">
							{users?.map((user) => (
								<motion.tr
									key={user._id}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors"
								>
									<td className="px-8 py-5">
										<div className="flex items-center gap-4">
											<div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black shadow-sm">
												{user.name.charAt(0).toUpperCase()}
											</div>
											<div>
												<p className="font-black text-gray-900 dark:text-white text-base">
													{user.name}
												</p>
												<p className="text-sm text-gray-500 dark:text-gray-400 font-bold">
													{user.email}
												</p>
											</div>
										</div>
									</td>
									<td className="px-8 py-5">
										<button
											onClick={() => handleRoleChange(user._id, user.role)}
											className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all hover:scale-105 active:scale-95 ${
												user.role === "teacher"
													? "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-500/20"
													: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20"
											}`}
										>
											{user.role}
										</button>
									</td>
									<td className="px-8 py-5">
										<span
											className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
												user.active
													? "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-500/20"
													: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20"
											}`}
										>
											{user.active ? "Active" : "Blocked"}
										</span>
									</td>
									<td className="px-8 py-5 text-right">
										<div className="flex items-center justify-end gap-3">
											<button
												onClick={() => handleToggleBlock(user._id, user.active)}
												className={`p-3 rounded-xl transition-all shadow-sm active:scale-90 ${
													user.active
														? "bg-orange-50 text-orange-600 hover:bg-orange-100"
														: "bg-green-50 text-green-600 hover:bg-green-100"
												}`}
												title={user.active ? "Block User" : "Unblock User"}
											>
												{user.active ? <HiUserMinus /> : <HiShieldCheck />}
											</button>
											<button
												onClick={() => {
													if (
														window.confirm(
															"Are you sure you want to delete this user?"
														)
													) {
														deleteUser(user._id);
													}
												}}
												className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
												title="Delete User"
											>
												<HiTrash />
											</button>
										</div>
									</td>
								</motion.tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
