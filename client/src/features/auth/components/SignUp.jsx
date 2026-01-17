import { useForm } from "react-hook-form";
import { useSignUp } from "../hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "../../../shared/validation/schemas";
import { HiUser, HiEnvelope, HiLockClosed } from "react-icons/hi2";

const FormField = ({ label, icon: Icon, error, children }) => (
	<div className="space-y-1.5">
		<label className="text-sm font-black text-gray-900 dark:text-gray-200 ml-1">
			{label}
		</label>
		<div className="relative group">
			<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
				<Icon className="h-5 w-5" />
			</div>
			{children}
		</div>
		{error && (
			<p className="text-xs text-red-600 dark:text-red-500 ml-1 font-black animate-shake">
				{error.message}
			</p>
		)}
	</div>
);

const RoleSelector = ({ register, error }) => (
	<div className="space-y-2">
		<label className="text-sm font-black text-gray-900 dark:text-gray-200 ml-1 block">
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
				<div className="w-full text-center py-2.5 px-4 rounded-xl border-2 border-gray-100 dark:border-white/5 text-gray-500 dark:text-gray-400 font-black transition-all peer-checked:border-indigo-600 dark:peer-checked:border-indigo-500 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-500/10 peer-checked:text-indigo-600 dark:peer-checked:text-indigo-400 hover:bg-gray-50 dark:hover:bg-white/[0.03]">
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
				<div className="w-full text-center py-2.5 px-4 rounded-xl border-2 border-gray-100 dark:border-white/5 text-gray-500 dark:text-gray-400 font-black transition-all peer-checked:border-indigo-600 dark:peer-checked:border-indigo-500 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-500/10 peer-checked:text-indigo-600 dark:peer-checked:text-indigo-400 hover:bg-gray-50 dark:hover:bg-white/[0.03]">
					Teacher
				</div>
			</label>
		</div>
		{error && (
			<p className="text-xs text-red-600 dark:text-red-500 ml-1 font-black">
				{error.message}
			</p>
		)}
	</div>
);

function SignUp() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(signUpSchema),
		mode: "onChange",
	});

	const { mutate, isPending } = useSignUp();

	function onSubmit(data) {
		mutate(data);
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
			<FormField label="Full Name" icon={HiUser} error={errors.name}>
				<input
					className={`w-full pl-11 pr-4 py-3 rounded-2xl border transition-all duration-300 outline-none bg-gray-50/50 dark:bg-white/[0.03] focus:bg-white dark:focus:bg-white/[0.05] text-gray-900 dark:text-white font-black placeholder:text-gray-400 dark:placeholder:text-gray-600 ${
						errors.name
							? "border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-500/20"
							: "border-gray-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-sm"
					}`}
					type="text"
					placeholder="John Doe"
					{...register("name")}
				/>
			</FormField>

			<FormField label="Email Address" icon={HiEnvelope} error={errors.email}>
				<input
					className={`w-full pl-11 pr-4 py-3 rounded-2xl border transition-all duration-300 outline-none bg-gray-50/50 dark:bg-white/[0.03] focus:bg-white dark:focus:bg-white/[0.05] text-gray-900 dark:text-white font-black placeholder:text-gray-400 dark:placeholder:text-gray-600 ${
						errors.email
							? "border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-500/20"
							: "border-gray-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-sm"
					}`}
					type="email"
					placeholder="name@example.com"
					{...register("email")}
				/>
			</FormField>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<FormField label="Password" icon={HiLockClosed} error={errors.password}>
					<input
						className={`w-full pl-11 pr-4 py-3 rounded-2xl border transition-all duration-300 outline-none bg-gray-50/50 dark:bg-white/[0.03] focus:bg-white dark:focus:bg-white/[0.05] text-gray-900 dark:text-white font-black placeholder:text-gray-400 dark:placeholder:text-gray-600 ${
							errors.password
								? "border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-500/20"
								: "border-gray-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-sm"
						}`}
						type="password"
						placeholder="••••••••"
						{...register("password")}
					/>
				</FormField>

				<FormField
					label="Confirm Password"
					icon={HiLockClosed}
					error={errors.confirmPass}
				>
					<input
						className={`w-full pl-11 pr-4 py-3 rounded-2xl border transition-all duration-300 outline-none bg-gray-50/50 dark:bg-white/[0.03] focus:bg-white dark:focus:bg-[#151b2b] text-gray-900 dark:text-white font-bold placeholder:text-gray-400 dark:placeholder:text-gray-600 ${
							errors.confirmPass
								? "border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-500/20"
								: "border-gray-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-sm"
						}`}
						type="password"
						placeholder="••••••••"
						{...register("confirmPass")}
					/>
				</FormField>
			</div>

			<RoleSelector register={register} error={errors.role} />

			<button
				className="w-full bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 active:bg-indigo-800 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-4 flex items-center justify-center space-x-3 cursor-pointer group"
				disabled={isPending}
			>
				{isPending ? (
					<>
						<div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
						<span>Creating Account...</span>
					</>
				) : (
					<>
						<span>Sign Up</span>
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
export default SignUp;
