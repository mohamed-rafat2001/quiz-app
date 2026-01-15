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
				<h1 className="text-3xl font-bold text-gray-900">User Management</h1>
				<p className="text-gray-500 mt-2">Manage platform users and roles.</p>
			</div>

			<div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="bg-gray-50 border-b border-gray-100">
								<th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">
									User
								</th>
								<th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">
									Role
								</th>
								<th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">
									Status
								</th>
								<th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider text-right">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-50">
							{users?.map((user) => (
								<motion.tr
									key={user._id}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="hover:bg-gray-50 transition-colors"
								>
									<td className="px-6 py-4">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold">
												{user.name.charAt(0).toUpperCase()}
											</div>
											<div>
												<p className="font-bold text-gray-900">{user.name}</p>
												<p className="text-sm text-gray-500">{user.email}</p>
											</div>
										</div>
									</td>
									<td className="px-6 py-4">
										<button
											onClick={() => handleRoleChange(user._id, user.role)}
											className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
												user.role === "teacher"
													? "bg-purple-100 text-purple-600"
													: "bg-blue-100 text-blue-600"
											}`}
										>
											{user.role}
										</button>
									</td>
									<td className="px-6 py-4">
										<span
											className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
												user.active
													? "bg-green-100 text-green-600"
													: "bg-red-100 text-red-600"
											}`}
										>
											{user.active ? "Active" : "Blocked"}
										</span>
									</td>
									<td className="px-6 py-4 text-right">
										<div className="flex items-center justify-end gap-2">
											<button
												onClick={() => handleToggleBlock(user._id, user.active)}
												className={`p-2 rounded-xl transition-colors ${
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
