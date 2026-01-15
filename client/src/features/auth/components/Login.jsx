import { useForm } from "react-hook-form";
import { useLogin } from "../hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../../shared/validation/schemas";
import { motion } from "framer-motion";

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
		<motion.form
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			onSubmit={handleSubmit(onSubmit)}
			className="w-full space-y-6"
		>
			<div className="space-y-2">
				<label className="text-sm font-medium text-gray-700 ml-1">
					Email Address
				</label>
				<input
					className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 outline-none ${
						errors.email
							? "border-red-500 focus:ring-2 focus:ring-red-200"
							: "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
					}`}
					type="email"
					placeholder="name@example.com"
					{...register("email")}
				/>
				{errors.email && (
					<motion.p
						initial={{ opacity: 0, x: -10 }}
						animate={{ opacity: 1, x: 0 }}
						className="text-xs text-red-500 ml-1 font-medium"
					>
						{errors.email.message}
					</motion.p>
				)}
			</div>

			<div className="space-y-2">
				<label className="text-sm font-medium text-gray-700 ml-1">
					Password
				</label>
				<input
					className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 outline-none ${
						errors.password
							? "border-red-500 focus:ring-2 focus:ring-red-200"
							: "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
					}`}
					type="password"
					placeholder="••••••••"
					{...register("password")}
				/>
				{errors.password && (
					<motion.p
						initial={{ opacity: 0, x: -10 }}
						animate={{ opacity: 1, x: 0 }}
						className="text-xs text-red-500 ml-1 font-medium"
					>
						{errors.password.message}
					</motion.p>
				)}
			</div>

			<motion.button
				whileHover={{ scale: 1.01 }}
				whileTap={{ scale: 0.98 }}
				className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
				disabled={isPending}
			>
				{isPending ? (
					<div className="flex items-center justify-center space-x-2">
						<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
						<span>Logging in...</span>
					</div>
				) : (
					"Sign In"
				)}
			</motion.button>
		</motion.form>
	);
}
export default Login;
