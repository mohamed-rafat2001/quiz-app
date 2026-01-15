import { useForm } from "react-hook-form";
import { useSignUp } from "../hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "../../../shared/validation/schemas";
import { motion } from "framer-motion";

function SignUp() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(signUpSchema),
	});

	const { mutate, isPending } = useSignUp();

	function onSubmit(data) {
		mutate(data);
	}

	return (
		<motion.form
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			onSubmit={handleSubmit(onSubmit)}
			className="w-full space-y-4"
		>
			<div className="space-y-1">
				<label className="text-sm font-medium text-gray-700 ml-1">
					Full Name
				</label>
				<input
					className={`w-full px-4 py-2.5 rounded-xl border transition-all duration-200 outline-none ${
						errors.name
							? "border-red-500 focus:ring-2 focus:ring-red-200"
							: "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
					}`}
					type="text"
					placeholder="John Doe"
					{...register("name")}
				/>
				{errors.name && (
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-xs text-red-500 ml-1 font-medium"
					>
						{errors.name.message}
					</motion.p>
				)}
			</div>

			<div className="space-y-1">
				<label className="text-sm font-medium text-gray-700 ml-1">
					Email Address
				</label>
				<input
					className={`w-full px-4 py-2.5 rounded-xl border transition-all duration-200 outline-none ${
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
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-xs text-red-500 ml-1 font-medium"
					>
						{errors.email.message}
					</motion.p>
				)}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-1">
					<label className="text-sm font-medium text-gray-700 ml-1">
						Password
					</label>
					<input
						className={`w-full px-4 py-2.5 rounded-xl border transition-all duration-200 outline-none ${
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
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="text-xs text-red-500 ml-1 font-medium"
						>
							{errors.password.message}
						</motion.p>
					)}
				</div>

				<div className="space-y-1">
					<label className="text-sm font-medium text-gray-700 ml-1">
						Confirm Password
					</label>
					<input
						className={`w-full px-4 py-2.5 rounded-xl border transition-all duration-200 outline-none ${
							errors.confirmPass
								? "border-red-500 focus:ring-2 focus:ring-red-200"
								: "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
						}`}
						type="password"
						placeholder="••••••••"
						{...register("confirmPass")}
					/>
					{errors.confirmPass && (
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="text-xs text-red-500 ml-1 font-medium"
						>
							{errors.confirmPass.message}
						</motion.p>
					)}
				</div>
			</div>

			<div className="space-y-2">
				<label className="text-sm font-medium text-gray-700 ml-1 block">
					I am a:
				</label>
				<div className="flex gap-4">
					<label className="flex-1 cursor-pointer">
						<input
							type="radio"
							value="student"
							className="peer hidden"
							{...register("role")}
						/>
						<div className="w-full text-center py-2 px-4 rounded-xl border-2 border-gray-100 text-gray-500 transition-all peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:text-indigo-600 hover:bg-gray-50">
							Student
						</div>
					</label>
					<label className="flex-1 cursor-pointer">
						<input
							type="radio"
							value="teacher"
							className="peer hidden"
							{...register("role")}
						/>
						<div className="w-full text-center py-2 px-4 rounded-xl border-2 border-gray-100 text-gray-500 transition-all peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:text-indigo-600 hover:bg-gray-50">
							Teacher
						</div>
					</label>
				</div>
				{errors.role && (
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-xs text-red-500 ml-1 font-medium"
					>
						{errors.role.message}
					</motion.p>
				)}
			</div>

			<motion.button
				whileHover={{ scale: 1.01 }}
				whileTap={{ scale: 0.98 }}
				className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
				disabled={isPending}
			>
				{isPending ? (
					<div className="flex items-center justify-center space-x-2">
						<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
						<span>Creating account...</span>
					</div>
				) : (
					"Create Account"
				)}
			</motion.button>
		</motion.form>
	);
}
export default SignUp;
