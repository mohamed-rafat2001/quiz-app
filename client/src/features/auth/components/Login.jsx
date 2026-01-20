import { useForm } from "react-hook-form";
import { useLogin } from "../hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../../shared/validation/schemas";
import { HiEnvelope, HiLockClosed } from "react-icons/hi2";

function Login({ onForgotPassword }) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(loginSchema),
		mode: "onChange",
	});

	const { mutate, isPending } = useLogin();

	function onSubmit(data) {
		mutate(data);
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6" aria-busy={isPending}>
			<div className="space-y-2">
				<label htmlFor="login-email" className="text-sm font-black text-gray-900 dark:text-white/60 ml-1">
					Email Address
				</label>
				<div className="relative group">
					<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-white/40 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
						<HiEnvelope className="h-5 w-5" aria-hidden="true" />
					</div>
					<input
						id="login-email"
						className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border transition-all duration-300 outline-none bg-gray-50/50 dark:bg-white/[0.05] focus:bg-white dark:focus:bg-white/[0.08] text-gray-900 dark:text-white font-bold placeholder:text-gray-400 dark:placeholder:text-white/30 ${
							errors.email
								? "border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-500/20"
								: "border-gray-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-sm"
						}`}
						type="email"
						placeholder="name@example.com"
						aria-invalid={errors.email ? "true" : "false"}
						aria-describedby={errors.email ? "login-email-error" : undefined}
						{...register("email")}
						name="email"
						autoComplete="email"
					/>
				</div>
				{errors.email && (
					<p id="login-email-error" className="text-xs text-red-600 dark:text-red-400 ml-1 font-black animate-shake" role="alert">
						{errors.email.message}
					</p>
				)}
			</div>

			<div className="space-y-2">
				<div className="flex justify-between items-center ml-1">
					<label htmlFor="login-password" className="text-sm font-black text-gray-900 dark:text-white/60">
						Password
					</label>
					<button
						type="button"
						onClick={onForgotPassword}
						className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 cursor-pointer transition-colors"
						aria-label="Forgot your password?"
					>
						Forgot?
					</button>
				</div>
				<div className="relative group">
					<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-white/40 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
						<HiLockClosed className="h-5 w-5" aria-hidden="true" />
					</div>
					<input
						id="login-password"
						className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border transition-all duration-300 outline-none bg-gray-50/50 dark:bg-white/[0.05] focus:bg-white dark:focus:bg-white/[0.08] text-gray-900 dark:text-white font-bold placeholder:text-gray-400 dark:placeholder:text-white/30 ${
							errors.password
								? "border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-500/20"
								: "border-gray-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-sm"
						}`}
						type="password"
						placeholder="••••••••"
						aria-invalid={errors.password ? "true" : "false"}
						aria-describedby={errors.password ? "login-password-error" : undefined}
						{...register("password")}
						name="password"
						autoComplete="current-password"
					/>
				</div>
				{errors.password && (
					<p id="login-password-error" className="text-xs text-red-600 dark:text-red-400 ml-1 font-black animate-shake" role="alert">
						{errors.password.message}
					</p>
				)}
			</div>

			<button
				className="w-full bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 active:bg-indigo-800 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-4 flex items-center justify-center space-x-3 cursor-pointer group"
				disabled={isPending}
			>
				{isPending ? (
					<>
						<div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
						<span>Verifying...</span>
					</>
				) : (
					<>
						<span>Sign In</span>
						<svg
							className="w-5 h-5 group-hover:translate-x-1 transition-transform"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M13 7l5 5m0 0l-5 5m5-5H6"
							/>
						</svg>
					</>
				)}
			</button>
		</form>
	);
}
export default Login;
