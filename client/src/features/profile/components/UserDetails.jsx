import { useForm } from "react-hook-form";
import { useUpdateUser } from "../../auth/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateMeSchema } from "../../../shared/validation/schemas";

export default function UserDetails({ user }) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(updateMeSchema),
		mode: "onChange",
		defaultValues: {
			name: user?.name,
			email: user?.email,
		},
	});

	const { mutate, isPending } = useUpdateUser();

	function onSubmit(data) {
		mutate(data);
	}

	return (
		<div className="bg-white dark:bg-white/[0.03] p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-white/5 transition-colors duration-300">
			<h3 className="text-xl font-black text-gray-900 dark:text-white mb-8">
				Profile Information
			</h3>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				<div className="space-y-2">
					<label className="text-sm font-black text-gray-900 dark:text-gray-200 ml-1">
						Full Name
					</label>
					<input
						className={`w-full px-5 py-3.5 rounded-2xl border transition-all duration-300 outline-none bg-gray-50/50 dark:bg-white/[0.03] focus:bg-white dark:focus:bg-white/[0.05] text-gray-900 dark:text-white font-bold placeholder:text-gray-400 dark:placeholder:text-gray-600 ${
							errors.name
								? "border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-500/20"
								: "border-gray-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-sm"
						}`}
						type="text"
						placeholder="Your Name"
						{...register("name")}
					/>
					{errors.name && (
						<p className="text-xs text-red-600 dark:text-red-500 ml-1 font-black animate-shake">
							{errors.name.message}
						</p>
					)}
				</div>

				<div className="space-y-2">
					<label className="text-sm font-black text-gray-900 dark:text-gray-200 ml-1">
						Email Address
					</label>
					<input
						className={`w-full px-5 py-3.5 rounded-2xl border transition-all duration-300 outline-none bg-gray-50/50 dark:bg-white/[0.03] focus:bg-white dark:focus:bg-white/[0.05] text-gray-900 dark:text-white font-bold placeholder:text-gray-400 dark:placeholder:text-gray-600 ${
							errors.email
								? "border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-500/20"
								: "border-gray-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-sm"
						}`}
						type="email"
						placeholder="name@example.com"
						{...register("email")}
					/>
					{errors.email && (
						<p className="text-xs text-red-600 dark:text-red-500 ml-1 font-black animate-shake">
							{errors.email.message}
						</p>
					)}
				</div>

				<div className="pt-4">
					<button
						className="w-full sm:w-auto bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
						disabled={isPending}
					>
						{isPending ? "Saving..." : "Update Profile"}
					</button>
				</div>
			</form>
		</div>
	);
}
