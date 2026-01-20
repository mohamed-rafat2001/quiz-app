import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSignUp } from "../hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "../../../shared/validation/schemas";
import {
	HiUser,
	HiEnvelope,
	HiLockClosed,
	HiMapPin,
	HiGlobeAlt,
	HiPhone,
	HiArrowLeft,
	HiArrowRight,
} from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";

const FormField = ({ label, id, icon: Icon, error, children }) => (
	<div className="space-y-1.5">
		<label htmlFor={id} className="text-sm font-black text-gray-900 dark:text-white/60 ml-1">
			{label}
		</label>
		<div className="relative group">
			<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-white/40 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
				<Icon className="h-5 w-5" aria-hidden="true" />
			</div>
			{children}
		</div>
		{error && (
			<p id={`${id}-error`} className="text-xs text-red-600 dark:text-red-400 ml-1 font-black animate-shake" role="alert">
				{error.message}
			</p>
		)}
	</div>
);

const RoleSelector = ({ register, error }) => (
	<fieldset className="space-y-2 border-none p-0 m-0">
		<legend className="text-sm font-black text-gray-900 dark:text-white/60 ml-1 block mb-2">
			I am a:
		</legend>
		<div className="flex gap-4">
			<label htmlFor="role-student" className="flex-1 cursor-pointer">
				<input
					type="radio"
					value="student"
					id="role-student"
					className="sr-only peer"
					{...register("role")}
					name="role"
					autoComplete="off"
				/>
				<div className="w-full text-center py-2.5 px-4 rounded-xl border-2 border-gray-100 dark:border-white/10 text-gray-500 dark:text-white/60 font-black transition-all peer-checked:border-indigo-600 dark:peer-checked:border-indigo-500 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-500/10 peer-checked:text-indigo-600 dark:peer-checked:text-indigo-400 hover:bg-gray-50 dark:hover:bg-white/[0.03] peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-2">
					Student
				</div>
			</label>
			<label htmlFor="role-teacher" className="flex-1 cursor-pointer">
				<input
					type="radio"
					value="teacher"
					id="role-teacher"
					className="sr-only peer"
					{...register("role")}
					name="role"
					autoComplete="off"
				/>
				<div className="w-full text-center py-2.5 px-4 rounded-xl border-2 border-gray-100 dark:border-white/10 text-gray-500 dark:text-white/60 font-black transition-all peer-checked:border-indigo-600 dark:peer-checked:border-indigo-500 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-500/10 peer-checked:text-indigo-600 dark:peer-checked:text-indigo-400 hover:bg-gray-50 dark:hover:bg-white/[0.03] peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-2">
					Teacher
				</div>
			</label>
		</div>
		{error && (
			<p className="text-xs text-red-600 dark:text-red-400 ml-1 font-black" role="alert">
				{error.message}
			</p>
		)}
	</fieldset>
);

const GenderSelector = ({ register, error }) => (
	<fieldset className="space-y-2 border-none p-0 m-0">
		<legend className="text-sm font-black text-gray-900 dark:text-white/60 ml-1 block mb-2">
			Gender:
		</legend>
		<div className="flex gap-4">
			<label htmlFor="gender-male" className="flex-1 cursor-pointer">
				<input
					type="radio"
					value="male"
					id="gender-male"
					className="sr-only peer"
					{...register("gender")}
					name="gender"
					autoComplete="off"
				/>
				<div className="w-full text-center py-2.5 px-4 rounded-xl border-2 border-gray-100 dark:border-white/10 text-gray-500 dark:text-white/60 font-black transition-all peer-checked:border-indigo-600 dark:peer-checked:border-indigo-500 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-500/10 peer-checked:text-indigo-600 dark:peer-checked:text-indigo-400 hover:bg-gray-50 dark:hover:bg-white/[0.03] peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-2">
					Male
				</div>
			</label>
			<label htmlFor="gender-female" className="flex-1 cursor-pointer">
				<input
					type="radio"
					value="female"
					id="gender-female"
					className="sr-only peer"
					{...register("gender")}
					name="gender"
					autoComplete="off"
				/>
				<div className="w-full text-center py-2.5 px-4 rounded-xl border-2 border-gray-100 dark:border-white/10 text-gray-500 dark:text-white/60 font-black transition-all peer-checked:border-indigo-600 dark:peer-checked:border-indigo-500 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-500/10 peer-checked:text-indigo-600 dark:peer-checked:text-indigo-400 hover:bg-gray-50 dark:hover:bg-white/[0.03] peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-2">
					Female
				</div>
			</label>
		</div>
		{error && (
			<p className="text-xs text-red-600 dark:text-red-400 ml-1 font-black" role="alert">
				{error.message}
			</p>
		)}
	</fieldset>
);

function SignUp() {
	const [step, setStep] = useState(1);
	const {
		register,
		handleSubmit,
		trigger,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(signUpSchema),
		mode: "onChange",
	});

	const { mutate, isPending } = useSignUp();

	const nextStep = async () => {
		const result = await trigger([
			"name",
			"email",
			"password",
			"confirmPass",
			"role",
		]);
		if (result) setStep(2);
	};

	const prevStep = () => setStep(1);

	function onSubmit(data) {
		mutate(data);
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
			{/* Progress Bar */}
			<div className="flex items-center gap-2 mb-8 px-1">
				<div
					className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
						step >= 1 ? "bg-indigo-600" : "bg-gray-200 dark:bg-white/10"
					}`}
				/>
				<div
					className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
						step >= 2 ? "bg-indigo-600" : "bg-gray-200 dark:bg-white/10"
					}`}
				/>
			</div>

			<AnimatePresence mode="wait">
				{step === 1 ? (
					<motion.div
						key="step1"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 20 }}
						transition={{ duration: 0.3 }}
						className="space-y-4"
					>
						<FormField label="Full Name" id="signup-name" icon={HiUser} error={errors.name}>
							<input
								id="signup-name"
								className={`w-full pl-11 pr-4 py-3 rounded-2xl border transition-all duration-300 outline-none bg-gray-50/50 dark:bg-white/[0.05] focus:bg-white dark:focus:bg-white/[0.08] text-gray-900 dark:text-white font-bold placeholder:text-gray-400 dark:placeholder:text-white/30 ${
									errors.name
										? "border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-500/20"
										: "border-gray-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-sm"
								}`}
								type="text"
								placeholder="John Doe"
								aria-invalid={errors.name ? "true" : "false"}
								aria-describedby={errors.name ? "signup-name-error" : undefined}
								{...register("name")}
								name="name"
								autoComplete="name"
							/>
						</FormField>

						<FormField
							label="Email Address"
							id="signup-email"
							icon={HiEnvelope}
							error={errors.email}
						>
							<input
								id="signup-email"
								className={`w-full pl-11 pr-4 py-3 rounded-2xl border transition-all duration-300 outline-none bg-gray-50/50 dark:bg-white/[0.05] focus:bg-white dark:focus:bg-white/[0.08] text-gray-900 dark:text-white font-bold placeholder:text-gray-400 dark:placeholder:text-white/30 ${
									errors.email
										? "border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-500/20"
										: "border-gray-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-sm"
								}`}
								type="email"
								placeholder="name@example.com"
								aria-invalid={errors.email ? "true" : "false"}
								aria-describedby={errors.email ? "signup-email-error" : undefined}
								{...register("email")}
								name="email"
								autoComplete="email"
							/>
						</FormField>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								label="Password"
								id="signup-password"
								icon={HiLockClosed}
								error={errors.password}
							>
								<input
									id="signup-password"
									className={`w-full pl-11 pr-4 py-3 rounded-2xl border transition-all duration-300 outline-none bg-gray-50/50 dark:bg-white/[0.05] focus:bg-white dark:focus:bg-white/[0.08] text-gray-900 dark:text-white font-bold placeholder:text-gray-400 dark:placeholder:text-white/30 ${
										errors.password
											? "border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-500/20"
											: "border-gray-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-sm"
									}`}
									type="password"
									placeholder="••••••••"
									aria-invalid={errors.password ? "true" : "false"}
									aria-describedby={errors.password ? "signup-password-error" : undefined}
									{...register("password")}
									name="password"
									autoComplete="new-password"
								/>
							</FormField>

							<FormField
								label="Confirm Password"
								id="signup-confirmPass"
								icon={HiLockClosed}
								error={errors.confirmPass}
							>
								<input
									id="signup-confirmPass"
									className={`w-full pl-11 pr-4 py-3 rounded-2xl border transition-all duration-300 outline-none bg-gray-50/50 dark:bg-white/[0.05] focus:bg-white dark:focus:bg-white/[0.08] text-gray-900 dark:text-white font-bold placeholder:text-gray-400 dark:placeholder:text-white/30 ${
										errors.confirmPass
											? "border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-500/20"
											: "border-gray-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-sm"
									}`}
									type="password"
									placeholder="••••••••"
									aria-invalid={errors.confirmPass ? "true" : "false"}
									aria-describedby={errors.confirmPass ? "signup-confirmPass-error" : undefined}
									{...register("confirmPass")}
									name="confirmPass"
									autoComplete="new-password"
								/>
							</FormField>
						</div>

						<RoleSelector register={register} error={errors.role} />

						<button
							type="button"
							onClick={nextStep}
							className="w-full bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 active:bg-indigo-800 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 mt-4 flex items-center justify-center space-x-3 cursor-pointer group"
						>
							<span>Continue</span>
							<HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
						</button>
					</motion.div>
				) : (
					<motion.div
						key="step2"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						transition={{ duration: 0.3 }}
						className="space-y-4"
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField label="City" id="signup-city" icon={HiMapPin} error={errors.city}>
								<input
									id="signup-city"
									className={`w-full pl-11 pr-4 py-3 rounded-2xl border transition-all duration-300 outline-none bg-gray-50/50 dark:bg-white/[0.05] focus:bg-white dark:focus:bg-white/[0.08] text-gray-900 dark:text-white font-bold placeholder:text-gray-400 dark:placeholder:text-white/30 ${
										errors.city
											? "border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-500/20"
											: "border-gray-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-sm"
									}`}
									type="text"
									placeholder="New York"
									aria-invalid={errors.city ? "true" : "false"}
									aria-describedby={errors.city ? "signup-city-error" : undefined}
									{...register("city")}
									name="city"
									autoComplete="address-level2"
								/>
							</FormField>

							<FormField
								label="Country"
								id="signup-country"
								icon={HiGlobeAlt}
								error={errors.country}
							>
								<input
									id="signup-country"
									className={`w-full pl-11 pr-4 py-3 rounded-2xl border transition-all duration-300 outline-none bg-gray-50/50 dark:bg-white/[0.05] focus:bg-white dark:focus:bg-white/[0.08] text-gray-900 dark:text-white font-bold placeholder:text-gray-400 dark:placeholder:text-white/30 ${
										errors.country
											? "border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-500/20"
											: "border-gray-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-sm"
									}`}
									type="text"
									placeholder="United States"
									aria-invalid={errors.country ? "true" : "false"}
									aria-describedby={errors.country ? "signup-country-error" : undefined}
									{...register("country")}
									name="country"
									autoComplete="country-name"
								/>
							</FormField>
						</div>

						<FormField
							label="Phone Number"
							id="signup-phoneNumber"
							icon={HiPhone}
							error={errors.phoneNumber}
						>
							<input
								id="signup-phoneNumber"
								className={`w-full pl-11 pr-4 py-3 rounded-2xl border transition-all duration-300 outline-none bg-gray-50/50 dark:bg-white/[0.05] focus:bg-white dark:focus:bg-white/[0.08] text-gray-900 dark:text-white font-bold placeholder:text-gray-400 dark:placeholder:text-white/30 ${
									errors.phoneNumber
										? "border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-500/20"
										: "border-gray-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-sm"
								}`}
								type="tel"
								placeholder="+1 (555) 000-0000"
								aria-invalid={errors.phoneNumber ? "true" : "false"}
								aria-describedby={errors.phoneNumber ? "signup-phoneNumber-error" : undefined}
								{...register("phoneNumber")}
								name="phoneNumber"
								autoComplete="tel"
							/>
						</FormField>

						<GenderSelector register={register} error={errors.gender} />

						<div className="flex gap-4 mt-8">
							<button
								type="button"
								onClick={prevStep}
								className="flex-1 bg-gray-100 dark:bg-white/[0.05] hover:bg-gray-200 dark:hover:bg-white/[0.1] text-gray-900 dark:text-white font-black py-4 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 cursor-pointer"
							>
								<HiArrowLeft className="w-5 h-5" />
								<span>Back</span>
							</button>
							<button
								type="submit"
								disabled={isPending}
								className="flex-[2] bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 active:bg-indigo-800 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-3 cursor-pointer group"
							>
								{isPending ? (
									<>
										<div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
										<span>Creating Account...</span>
									</>
								) : (
									<>
										<span>Complete Sign Up</span>
										<HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
									</>
								)}
							</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</form>
	);
}
export default SignUp;
