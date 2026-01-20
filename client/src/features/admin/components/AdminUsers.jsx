import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useAdminUsers, useDeleteUser, useUpdateUser, useCreateUserByAdmin } from "../hooks/useAdmin";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "../../../shared/validation/schemas";
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
	HiPlus,
	HiXMark,
	HiChevronDown,
	HiChevronLeft,
	HiChevronRight,
} from "react-icons/hi2";
import ConfirmModal from "../../../shared/components/ui/ConfirmModal";

const StatCard = ({ title, value, icon: Icon, color }) => (
	<div className={`p-5 rounded-2xl bg-gradient-to-br ${color} text-white`}>
		<Icon className="text-3xl mb-2 opacity-80" />
		<p className="text-3xl font-black">{value}</p>
		<p className="text-sm opacity-80">{title}</p>
	</div>
);

const UserAvatar = ({ user }) => {
	const [error, setError] = useState(false);

	if (user.profileImg?.secure_url && !error) {
		return (
			<img
				src={user.profileImg.secure_url}
				alt={user.name}
				className="w-full h-full object-cover"
				referrerPolicy="no-referrer"
				loading="lazy"
				onError={() => setError(true)}
			/>
		);
	}

	return (
		<span className="text-indigo-600 dark:text-indigo-400 font-black text-sm">
			{user.name.charAt(0).toUpperCase()}
		</span>
	);
};

export default function AdminUsers() {
	const [searchTerm, setSearchTerm] = useState("");
	const [roleFilter, setRoleFilter] = useState("all");
	const [page, setPage] = useState(1);
	const limit = 10;
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [deleteModal, setDeleteModal] = useState({ isOpen: false, userId: null });

	const { data, isLoading, refetch } = useAdminUsers({
		page,
		limit,
		role: roleFilter !== "all" ? roleFilter : undefined,
		name: searchTerm ? { $regex: searchTerm, $options: "i" } : undefined,
	});

	const users = data?.docs || [];
	const total = data?.total || 0;
	const totalPages = Math.ceil(total / limit);

	const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
	const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
	const { mutate: createUser, isPending: isCreating } = useCreateUserByAdmin();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(signUpSchema),
	});

	useEffect(() => {
		setPage(1);
	}, [searchTerm, roleFilter]);

	const onCreateSubmit = (data) => {
		createUser(data, {
			onSuccess: () => {
				setIsCreateModalOpen(false);
				reset();
			},
		});
	};

	const handleRoleChange = (id, currentRole) => {
		const newRole = currentRole === "student" ? "teacher" : "student";
		updateUser({ id, data: { role: newRole } });
	};

	const handleToggleBlock = (id, isActive) => {
		updateUser({ id, data: { active: !isActive } });
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
			</div>
		);
	}

	// Stats from backend
	const {
		totalStudents = 0,
		totalTeachers = 0,
		activeUsers = 0,
		blockedUsers = 0,
	} = data?.stats || {};

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
				<div className="flex items-center gap-3">
					<button
						onClick={() => setIsCreateModalOpen(true)}
						className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
					>
						<HiPlus className="text-lg" />
						Create User
					</button>
					<button
						onClick={() => refetch()}
						className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
					>
						<HiArrowPath className={isLoading ? "animate-spin" : ""} />
						Refresh
					</button>
				</div>
			</motion.div>

			{/* Stats */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="grid grid-cols-2 lg:grid-cols-4 gap-4"
			>
				<StatCard
					title="Total Users"
					value={total}
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
					<label htmlFor="admin-search-users" className="sr-only">
						Search users by name or email
					</label>
					<HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
					<input
						id="admin-search-users"
						name="admin-search-users"
						autoComplete="off"
						type="text"
						placeholder="Search users by name or email..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 dark:text-white"
					/>
				</div>
				<div className="flex items-center gap-2 relative">
					<label htmlFor="admin-filter-role" className="sr-only">
						Filter by role
					</label>
					<HiFunnel className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
					<select
						id="admin-filter-role"
						name="admin-filter-role"
						autoComplete="off"
						value={roleFilter}
						onChange={(e) => setRoleFilter(e.target.value)}
						className="appearance-none pl-11 pr-10 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 dark:text-white font-black cursor-pointer transition-all hover:border-gray-300 dark:hover:border-gray-600"
					>
						<option value="all">All Roles</option>
						<option value="student">Students</option>
						<option value="teacher">Teachers</option>
					</select>
					<HiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
				</div>
			</motion.div>

			{/* Users Table */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden relative"
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
							<AnimatePresence mode="popLayout">
								{users.map((user, index) => (
									<motion.tr
										key={user._id}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: 20 }}
										transition={{ delay: index * 0.05 }}
										className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
									>
										<td className="px-6 py-4">
											<Link
												to={`/app/users/${user._id}`}
												className="flex items-center gap-3 group"
											>
												<div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center overflow-hidden border border-indigo-50 dark:border-indigo-500/10 group-hover:ring-2 group-hover:ring-indigo-500/20 transition-all">
													<UserAvatar user={user} />
												</div>
												<div className="flex flex-col">
													<p className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
														{user.name}
													</p>
													<p className="text-xs text-gray-500 dark:text-gray-400">
														{user.email}
													</p>
												</div>
											</Link>
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
													onClick={() => setDeleteModal({ isOpen: true, userId: user._id })}
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

				{users.length === 0 && (
					<div className="py-12 text-center text-gray-500 dark:text-gray-400">
						No users found matching your criteria.
					</div>
				)}

				{/* Pagination UI */}
				{totalPages > 1 && (
					<div className="px-6 py-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/30 dark:bg-white/[0.01]">
						<p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
							Showing <span className="font-bold text-gray-900 dark:text-white">{(page - 1) * limit + 1}</span> to <span className="font-bold text-gray-900 dark:text-white">{Math.min(page * limit, total)}</span> of <span className="font-bold text-gray-900 dark:text-white">{total}</span> users
						</p>
						<div className="flex items-center gap-2">
							<button
								onClick={() => setPage(p => Math.max(1, p - 1))}
								disabled={page === 1}
								className="p-2 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
							>
								<HiChevronLeft className="text-xl" />
							</button>
							
							<div className="flex items-center gap-1">
								{[...Array(totalPages)].map((_, i) => (
									<button
										key={i + 1}
										onClick={() => setPage(i + 1)}
										className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
											page === i + 1
												? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none"
												: "text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-white/10"
										}`}
									>
										{i + 1}
									</button>
								))}
							</div>

							<button
								onClick={() => setPage(p => Math.min(totalPages, p + 1))}
								disabled={page === totalPages}
								className="p-2 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
							>
								<HiChevronRight className="text-xl" />
							</button>
						</div>
					</div>
				)}
			</motion.div>

			{/* Create User Modal */}
			<AnimatePresence>
				{isCreateModalOpen && (
					<div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setIsCreateModalOpen(false)}
							className="absolute inset-0 bg-gray-900/60 dark:bg-black/80 backdrop-blur-sm"
						/>
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 20 }}
							className="relative w-full max-w-2xl bg-white dark:bg-[#111111] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-white/10 overflow-hidden"
						>
							<div className="px-8 py-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
								<div>
									<h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3">
										<div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
											<HiPlus className="text-xl" />
										</div>
										Create New User
									</h2>
								</div>
								<button
									onClick={() => setIsCreateModalOpen(false)}
									className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-all active:scale-90"
								>
									<HiXMark className="text-2xl" />
								</button>
							</div>

							<form onSubmit={handleSubmit(onCreateSubmit)} className="p-8">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
									{/* Name */}
									<div className="space-y-2">
										<label htmlFor="admin-create-name" className="text-xs font-black text-gray-400 dark:text-white/40 uppercase tracking-widest ml-1">
											Full Name
										</label>
										<input
											id="admin-create-name"
											{...register("name")}
											name="name"
											autoComplete="name"
											className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all dark:text-white placeholder:text-gray-400"
											placeholder="John Doe"
										/>
										{errors.name && (
											<p className="text-xs text-red-500 font-bold ml-1">
												{errors.name.message}
											</p>
										)}
									</div>

									{/* Email */}
									<div className="space-y-2">
										<label htmlFor="admin-create-email" className="text-xs font-black text-gray-400 dark:text-white/40 uppercase tracking-widest ml-1">
											Email Address
										</label>
										<input
											id="admin-create-email"
											{...register("email")}
											name="email"
											autoComplete="email"
											className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all dark:text-white placeholder:text-gray-400"
											placeholder="john@example.com"
										/>
										{errors.email && (
											<p className="text-xs text-red-500 font-bold ml-1">
												{errors.email.message}
											</p>
										)}
									</div>

									{/* Password */}
									<div className="space-y-2">
										<label htmlFor="admin-create-password" className="text-xs font-black text-gray-400 dark:text-white/40 uppercase tracking-widest ml-1">
											Password
										</label>
										<input
											id="admin-create-password"
											type="password"
											{...register("password")}
											name="password"
											autoComplete="new-password"
											className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all dark:text-white placeholder:text-gray-400"
											placeholder="••••••••"
										/>
										{errors.password && (
											<p className="text-xs text-red-500 font-bold ml-1">
												{errors.password.message}
											</p>
										)}
									</div>

									{/* Confirm Password */}
									<div className="space-y-2">
										<label htmlFor="admin-create-confirmPass" className="text-xs font-black text-gray-400 dark:text-white/40 uppercase tracking-widest ml-1">
											Confirm Password
										</label>
										<input
											id="admin-create-confirmPass"
											type="password"
											{...register("confirmPass")}
											name="confirmPass"
											autoComplete="new-password"
											className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all dark:text-white placeholder:text-gray-400"
											placeholder="••••••••"
										/>
										{errors.confirmPass && (
											<p className="text-xs text-red-500 font-bold ml-1">
												{errors.confirmPass.message}
											</p>
										)}
									</div>

									{/* Role */}
									<div className="space-y-2">
										<label htmlFor="admin-create-role" className="text-xs font-black text-gray-400 dark:text-white/40 uppercase tracking-widest ml-1">
											Role
										</label>
										<select
											id="admin-create-role"
											{...register("role")}
											name="role"
											autoComplete="off"
											className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all dark:text-white appearance-none cursor-pointer"
										>
											<option value="student" className="dark:bg-gray-900">Student</option>
											<option value="teacher" className="dark:bg-gray-900">Teacher</option>
										</select>
									</div>

									{/* Gender */}
									<div className="space-y-2">
										<label htmlFor="admin-create-gender" className="text-xs font-black text-gray-400 dark:text-white/40 uppercase tracking-widest ml-1">
											Gender
										</label>
										<select
											id="admin-create-gender"
											{...register("gender")}
											name="gender"
											autoComplete="off"
											className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all dark:text-white appearance-none cursor-pointer"
										>
											<option value="male" className="dark:bg-gray-900">Male</option>
											<option value="female" className="dark:bg-gray-900">Female</option>
										</select>
									</div>

									{/* City */}
									<div className="space-y-2">
										<label htmlFor="admin-create-city" className="text-xs font-black text-gray-400 dark:text-white/40 uppercase tracking-widest ml-1">
											City
										</label>
										<input
											id="admin-create-city"
											{...register("city")}
											name="city"
											autoComplete="address-level2"
											className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all dark:text-white placeholder:text-gray-400"
											placeholder="New York"
										/>
									</div>

									{/* Country */}
									<div className="space-y-2">
										<label htmlFor="admin-create-country" className="text-xs font-black text-gray-400 dark:text-white/40 uppercase tracking-widest ml-1">
											Country
										</label>
										<input
											id="admin-create-country"
											{...register("country")}
											name="country"
											autoComplete="country-name"
											className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all dark:text-white placeholder:text-gray-400"
											placeholder="USA"
										/>
									</div>

									{/* Phone */}
									<div className="col-span-full space-y-2">
										<label htmlFor="admin-create-phone" className="text-xs font-black text-gray-400 dark:text-white/40 uppercase tracking-widest ml-1">
											Phone Number
										</label>
										<input
											id="admin-create-phone"
											{...register("phoneNumber")}
											name="phoneNumber"
											autoComplete="tel"
											className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all dark:text-white placeholder:text-gray-400"
											placeholder="+1 234 567 890"
										/>
									</div>
								</div>

								<div className="mt-10 flex gap-4">
									<button
										type="button"
										onClick={() => setIsCreateModalOpen(false)}
										className="flex-1 px-6 py-4 rounded-2xl border border-gray-200 dark:border-white/10 font-black text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-all active:scale-95"
									>
										Cancel
									</button>
									<button
										type="submit"
										disabled={isCreating}
										className="flex-1 px-6 py-4 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-2"
									>
										{isCreating ? (
											<>
												<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
												Creating...
											</>
										) : (
											"Create User"
										)}
									</button>
								</div>
							</form>
						</motion.div>
					</div>
				)}
			</AnimatePresence>

			{/* Confirm Delete Modal */}
			<ConfirmModal
				isOpen={deleteModal.isOpen}
				onClose={() => setDeleteModal({ isOpen: false, userId: null })}
				onConfirm={() => deleteUser(deleteModal.userId)}
				isPending={isDeleting}
				title="Delete User"
				message="Are you sure you want to delete this user? This action cannot be undone and all user data will be permanently removed."
				confirmText="Delete User"
			/>
		</div>
	);
}
