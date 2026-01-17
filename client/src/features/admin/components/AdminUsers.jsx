import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminUsers, useDeleteUser, useUpdateUser } from "../hooks/useAdmin";
import {
	HiTrash,
	HiShieldCheck,
	HiUserMinus,
	HiMagnifyingGlass,
	HiUsers,
	HiAcademicCap,
	HiUserCircle,
	HiFunnel,
	HiArrowPath,
} from "react-icons/hi2";

const fadeInUp = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0 },
};

const StatCard = ({ title, value, icon: Icon, color }) => (
	<div className={`p-5 rounded-2xl bg-gradient-to-br ${color} text-white`}>
		<Icon className="text-3xl mb-2 opacity-80" />
		<p className="text-3xl font-black">{value}</p>
		<p className="text-sm opacity-80">{title}</p>
	</div>
);

export default function AdminUsers() {
	const { data: users, isLoading, refetch } = useAdminUsers();
	const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
	const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
	const [searchTerm, setSearchTerm] = useState("");
	const [roleFilter, setRoleFilter] = useState("all");

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

	// Filter users
	const filteredUsers =
		users?.filter((user) => {
			const matchesSearch =
				user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.email.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesRole = roleFilter === "all" || user.role === roleFilter;
			return matchesSearch && matchesRole;
		}) || [];

	// Stats
	const totalStudents = users?.filter((u) => u.role === "student").length || 0;
	const totalTeachers = users?.filter((u) => u.role === "teacher").length || 0;
	const activeUsers = users?.filter((u) => u.active).length || 0;
	const blockedUsers = users?.filter((u) => !u.active).length || 0;

	return (
		<div className="space-y-6">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
			>
				<div>
					<h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
						User Management
					</h1>
					<p className="text-gray-500 dark:text-gray-400 mt-1">
						Manage all users on the platform
					</p>
				</div>
				<button
					onClick={() => refetch()}
					className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all"
				>
					<HiArrowPath className={isLoading ? "animate-spin" : ""} />
					Refresh
				</button>
			</motion.div>

			{/* Stats */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="grid grid-cols-2 lg:grid-cols-4 gap-4"
			>
				<StatCard
					title="Total Users"
					value={users?.length || 0}
					icon={HiUsers}
					color="from-indigo-500 to-purple-500"
				/>
				<StatCard
					title="Students"
					value={totalStudents}
					icon={HiUserCircle}
					color="from-blue-500 to-cyan-500"
				/>
				<StatCard
					title="Teachers"
					value={totalTeachers}
					icon={HiAcademicCap}
					color="from-purple-500 to-pink-500"
				/>
				<StatCard
					title="Active / Blocked"
					value={`${activeUsers} / ${blockedUsers}`}
					icon={HiShieldCheck}
					color="from-green-500 to-emerald-500"
				/>
			</motion.div>

			{/* Filters */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="flex flex-col sm:flex-row gap-4"
			>
				<div className="relative flex-1">
					<HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						placeholder="Search users by name or email..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 dark:text-white"
					/>
				</div>
				<div className="flex items-center gap-2">
					<HiFunnel className="text-gray-400" />
					<select
						value={roleFilter}
						onChange={(e) => setRoleFilter(e.target.value)}
						className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 dark:text-white font-medium"
					>
						<option value="all">All Roles</option>
						<option value="student">Students</option>
						<option value="teacher">Teachers</option>
					</select>
				</div>
			</motion.div>

			{/* Users Table */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
			>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50 dark:bg-gray-700/30">
							<tr>
								<th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
									User
								</th>
								<th className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
									Role
								</th>
								<th className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
									Status
								</th>
								<th className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
									Joined
								</th>
								<th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 dark:divide-gray-700">
							<AnimatePresence>
								{filteredUsers.map((user, index) => (
									<motion.tr
										key={user._id}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, x: -20 }}
										transition={{ delay: index * 0.03 }}
										className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors"
									>
										<td className="px-6 py-4">
											<div className="flex items-center gap-4">
												<div
													className={`w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold shadow-sm ${
														user.role === "teacher"
															? "bg-gradient-to-br from-purple-500 to-pink-500"
															: "bg-gradient-to-br from-blue-500 to-cyan-500"
													}`}
												>
													{user.name.charAt(0).toUpperCase()}
												</div>
												<div>
													<p className="font-bold text-gray-900 dark:text-white">
														{user.name}
													</p>
													<p className="text-sm text-gray-500 dark:text-gray-400">
														{user.email}
													</p>
												</div>
											</div>
										</td>
										<td className="px-6 py-4 text-center">
											<button
												onClick={() => handleRoleChange(user._id, user.role)}
												disabled={isUpdating}
												className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all hover:scale-105 ${
													user.role === "teacher"
														? "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400"
														: "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
												}`}
											>
												{user.role}
											</button>
										</td>
										<td className="px-6 py-4 text-center">
											<span
												className={`px-4 py-1.5 rounded-lg text-xs font-bold ${
													user.active
														? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
														: "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
												}`}
											>
												{user.active ? "Active" : "Blocked"}
											</span>
										</td>
										<td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
											{user.createdAt
												? new Date(user.createdAt).toLocaleDateString()
												: "N/A"}
										</td>
										<td className="px-6 py-4 text-right">
											<div className="flex items-center justify-end gap-2">
												<button
													onClick={() =>
														handleToggleBlock(user._id, user.active)
													}
													disabled={isUpdating}
													className={`p-2.5 rounded-lg transition-all hover:scale-105 ${
														user.active
															? "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 hover:bg-orange-200"
															: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-200"
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
													disabled={isDeleting}
													className="p-2.5 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-all hover:scale-105"
													title="Delete User"
												>
													<HiTrash />
												</button>
											</div>
										</td>
									</motion.tr>
								))}
							</AnimatePresence>
						</tbody>
					</table>
				</div>

				{filteredUsers.length === 0 && (
					<div className="py-12 text-center text-gray-500 dark:text-gray-400">
						No users found matching your criteria.
					</div>
				)}
			</motion.div>
		</div>
	);
}
