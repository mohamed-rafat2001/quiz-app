import { useForm } from "react-hook-form";
import { useUpdatePassword } from "../../auth/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePasswordSchema } from "../../../shared/validation/schemas";

export default function UpdatePass() {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: zodResolver(updatePasswordSchema),
		mode: "onChange",
	});

	const { mutate, isPending } = useUpdatePassword();

	function onSubmit(data) {
		mutate(data, {
			onSuccess: () => {
				reset();
			},
		});
	}

	return (
		<div className="bg-white dark:bg-white/[0.03] p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-white/5 transition-colors duration-300">
			<h3 className="text-xl font-black text-gray-900 dark:text-white mb-8">
				Change Password
			</h3>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				<div className="space-y-2">
					<label
						htmlFor="update-pass-current"
						className="text-sm font-black text-gray-900 dark:text-white/70 ml-1"
					>
						Current Password
					</label>
					<input
						id="update-pass-current"
						className={`w-full px-5 py-3.5 rounded-2xl border transition-all duration-300 outline-none bg-gray-50/50 dark:bg-white/[0.03] focus:bg-white dark:focus:bg-white/[0.05] text-gray-900 dark:text-white font-bold placeholder:text-gray-400 dark:placeholder:text-white/30 ${
							errors.password
								? "border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-500/20"
								: "border-gray-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-sm"
						}`}
						type="password"
						placeholder="••••••••"
						{...register("password")}
					/>
					{errors.password && (
						<p className="text-xs text-red-600 dark:text-red-500 ml-1 font-black animate-shake">
							{errors.password.message}
						</p>
					)}
				</div>

				<div className="space-y-2">
					<label
						htmlFor="update-pass-new"
						className="text-sm font-black text-gray-900 dark:text-white/70 ml-1"
					>
						New Password
					</label>
					<input
						id="update-pass-new"
						className={`w-full px-5 py-3.5 rounded-2xl border transition-all duration-300 outline-none bg-gray-50/50 dark:bg-white/[0.03] focus:bg-white dark:focus:bg-white/[0.05] text-gray-900 dark:text-white font-bold placeholder:text-gray-400 dark:placeholder:text-white/30 ${
							errors.newPassword
								? "border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-500/20"
								: "border-gray-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-sm"
						}`}
						type="password"
						placeholder="••••••••"
						{...register("newPassword")}
					/>
					{errors.newPassword && (
						<p className="text-xs text-red-600 dark:text-red-500 ml-1 font-black animate-shake">
							{errors.newPassword.message}
						</p>
					)}
				</div>

				<div className="space-y-2">
					<label
						htmlFor="update-pass-confirm"
						className="text-sm font-black text-gray-900 dark:text-white/70 ml-1"
					>
						Confirm New Password
					</label>
					<input
						id="update-pass-confirm"
						className={`w-full px-5 py-3.5 rounded-2xl border transition-all duration-300 outline-none bg-gray-50/50 dark:bg-white/[0.03] focus:bg-white dark:focus:bg-white/[0.05] text-gray-900 dark:text-white font-bold placeholder:text-gray-400 dark:placeholder:text-white/30 ${
							errors.confirmPass
								? "border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-500/20"
								: "border-gray-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-sm"
						}`}
						type="password"
						placeholder="••••••••"
						{...register("confirmPass")}
					/>
					{errors.confirmPass && (
						<p className="text-xs text-red-600 dark:text-red-500 ml-1 font-black animate-shake">
							{errors.confirmPass.message}
						</p>
					)}
				</div>

				<div className="pt-4">
					<button
						className="w-full sm:w-auto bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
						disabled={isPending}
					>
						{isPending ? "Saving..." : "Update Password"}
					</button>
				</div>
			</form>
		</div>
	);
}
