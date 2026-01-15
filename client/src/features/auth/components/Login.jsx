import { useForm } from "react-hook-form";
import { useLogin } from "../hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../../shared/validation/schemas";
import { HiEnvelope, HiLockClosed } from "react-icons/hi2";

function Login() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(loginSchema),
	});

	const { mutate, isPending } = useLogin();

	function onSubmit(data) {
		mutate(data);
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
			<div className="space-y-2">
				<label className="text-sm font-semibold text-gray-700 ml-1">
					Email Address
				</label>
				<div className="relative group">
					<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
						<HiEnvelope className="h-5 w-5" />
					</div>
					<input
						className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border transition-all duration-300 outline-none bg-gray-50/50 focus:bg-white ${
							errors.email
								? "border-red-500 focus:ring-4 focus:ring-red-100"
								: "border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 shadow-sm"
						}`}
						type="email"
						placeholder="name@example.com"
						{...register("email")}
					/>
				</div>
				{errors.email && (
					<p className="text-xs text-red-500 ml-1 font-medium animate-shake">
						{errors.email.message}
					</p>
				)}
			</div>

			<div className="space-y-2">
				<div className="flex justify-between items-center ml-1">
					<label className="text-sm font-semibold text-gray-700">
						Password
					</label>
					<button
						type="button"
						className="text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer transition-colors"
					>
						Forgot?
					</button>
				</div>
				<div className="relative group">
					<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
						<HiLockClosed className="h-5 w-5" />
					</div>
					<input
						className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border transition-all duration-300 outline-none bg-gray-50/50 focus:bg-white ${
							errors.password
								? "border-red-500 focus:ring-4 focus:ring-red-100"
								: "border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 shadow-sm"
						}`}
						type="password"
						placeholder="••••••••"
						{...register("password")}
					/>
				</div>
				{errors.password && (
					<p className="text-xs text-red-500 ml-1 font-medium animate-shake">
						{errors.password.message}
					</p>
				)}
			</div>

			<button
				className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-4 flex items-center justify-center space-x-3 cursor-pointer group"
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
