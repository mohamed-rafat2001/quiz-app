import { useForm } from "react-hook-form";
import { useResetPassword } from "../hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../../../shared/validation/schemas";
import {
	HiLockClosed,
	HiShieldCheck,
	HiArrowRight,
	HiArrowLeft,
} from "react-icons/hi2";

function ResetPassword({ email, onBack }) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(resetPasswordSchema),
		mode: "onChange",
	});

	const { mutate, isPending } = useResetPassword();

	function onSubmit(data) {
		mutate({ ...data, email });
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
			<div className="text-center mb-8">
				<p className="text-gray-600 dark:text-white/60 font-medium text-sm">
					We've sent a 6-digit code to{" "}
					<span className="text-indigo-600 dark:text-indigo-400 font-bold">
						{email}
					</span>
					. Enter the code and your new password below.
				</p>
			</div>

			<div className="space-y-2">
				<label
					htmlFor="reset-code"
					className="text-sm font-black text-gray-900 dark:text-white/70 ml-1"
				>
					Reset Code
				</label>
				<div className="relative group">
					<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-white/40 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
						<HiShieldCheck className="h-5 w-5" />
					</div>
					<input
						id="reset-code"
						className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border transition-all duration-300 outline-none bg-gray-50/50 dark:bg-white/[0.05] focus:bg-white dark:focus:bg-white/[0.08] text-gray-900 dark:text-white font-bold tracking-[0.5em] text-center placeholder:tracking-normal placeholder:text-gray-400 dark:placeholder:text-white/30 ${
							errors.resetPassCode
								? "border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-500/20"
								: "border-gray-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-sm"
						}`}
						type="text"
						maxLength={6}
						placeholder="000000"
						aria-invalid={errors.resetPassCode ? "true" : "false"}
						aria-describedby={
							errors.resetPassCode ? "reset-code-error" : undefined
						}
						{...register("resetPassCode")}
						name="resetPassCode"
						autoComplete="one-time-code"
					/>
				</div>
				{errors.resetPassCode && (
					<p
						id="reset-code-error"
						role="alert"
						className="text-xs text-red-600 dark:text-red-400 ml-1 font-black animate-shake"
					>
						{errors.resetPassCode.message}
					</p>
				)}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-2">
					<label
						htmlFor="reset-new-password"
						className="text-sm font-black text-gray-900 dark:text-white/70 ml-1"
					>
						New Password
					</label>
					<div className="relative group">
						<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-white/40 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
							<HiLockClosed className="h-5 w-5" />
						</div>
						<input
							id="reset-new-password"
							className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border transition-all duration-300 outline-none bg-gray-50/50 dark:bg-white/[0.05] focus:bg-white dark:focus:bg-white/[0.08] text-gray-900 dark:text-white font-bold placeholder:text-gray-400 dark:placeholder:text-white/30 ${
								errors.newPassword
									? "border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-500/20"
									: "border-gray-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-sm"
							}`}
							type="password"
							placeholder="••••••••"
							aria-invalid={errors.newPassword ? "true" : "false"}
							aria-describedby={
								errors.newPassword ? "reset-new-password-error" : undefined
							}
							{...register("newPassword")}
							name="newPassword"
							autoComplete="new-password"
						/>
					</div>
					{errors.newPassword && (
						<p
							id="reset-new-password-error"
						role="alert"
						className="text-xs text-red-600 dark:text-red-400 ml-1 font-black animate-shake"
					>
						{errors.newPassword.message}
					</p>
					)}
				</div>

				<div className="space-y-2">
					<label
						htmlFor="reset-confirm-password"
						className="text-sm font-black text-gray-900 dark:text-white/70 ml-1"
					>
						Confirm Password
					</label>
					<div className="relative group">
						<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-white/40 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
							<HiLockClosed className="h-5 w-5" />
						</div>
						<input
							id="reset-confirm-password"
							className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border transition-all duration-300 outline-none bg-gray-50/50 dark:bg-white/[0.05] focus:bg-white dark:focus:bg-white/[0.08] text-gray-900 dark:text-white font-bold placeholder:text-gray-400 dark:placeholder:text-white/30 ${
								errors.confirmPass
									? "border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-500/20"
									: "border-gray-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-sm"
							}`}
							type="password"
							placeholder="••••••••"
							aria-invalid={errors.confirmPass ? "true" : "false"}
							aria-describedby={
								errors.confirmPass ? "reset-confirm-password-error" : undefined
							}
							{...register("confirmPass")}
							name="confirmPass"
							autoComplete="new-password"
						/>
					</div>
					{errors.confirmPass && (
						<p
							id="reset-confirm-password-error"
						role="alert"
						className="text-xs text-red-600 dark:text-red-400 ml-1 font-black animate-shake"
					>
						{errors.confirmPass.message}
					</p>
					)}
				</div>
			</div>

			<div className="flex flex-col gap-4">
				<button
					type="submit"
					disabled={isPending}
					className="w-full bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 active:bg-indigo-800 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-3 cursor-pointer group"
				>
					{isPending ? (
						<>
							<div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
							<span>Resetting Password...</span>
						</>
					) : (
						<>
							<span>Reset Password</span>
							<HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
						</>
					)}
				</button>

				<button
					type="button"
					onClick={onBack}
					className="w-full py-3 text-sm font-black text-gray-500 dark:text-white/60 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center justify-center gap-2 cursor-pointer"
				>
					<HiArrowLeft className="w-4 h-4" />
					Back to Sign In
				</button>
			</div>
		</form>
	);
}

export default ResetPassword;
