import { useForm } from "react-hook-form";
import { useUpdateUser } from "../../auth/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateMeSchema } from "../../../shared/validation/schemas";
import {
	HiUser,
	HiEnvelope,
	HiMapPin,
	HiGlobeAlt,
	HiPhone,
	HiUsers,
} from "react-icons/hi2";

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

const GenderSelector = ({ register, error }) => (
	<div className="space-y-2">
		<label className="text-sm font-black text-gray-900 dark:text-gray-200 ml-1 block">
			Gender
		</label>
		<div className="flex gap-4">
			<label className="flex-1 cursor-pointer">
				<input
					type="radio"
					value="male"
					className="peer hidden"
					{...register("gender")}
				/>
				<div className="w-full text-center py-2.5 px-4 rounded-xl border-2 border-gray-100 dark:border-white/5 text-gray-500 dark:text-gray-400 font-black transition-all peer-checked:border-indigo-600 dark:peer-checked:border-indigo-50 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-500/10 peer-checked:text-indigo-600 dark:peer-checked:text-indigo-400 hover:bg-gray-50 dark:hover:bg-white/[0.03]">
					Male
				</div>
			</label>
			<label className="flex-1 cursor-pointer">
				<input
					type="radio"
					value="female"
					className="peer hidden"
					{...register("gender")}
				/>
				<div className="w-full text-center py-2.5 px-4 rounded-xl border-2 border-gray-100 dark:border-white/5 text-gray-500 dark:text-gray-400 font-black transition-all peer-checked:border-indigo-600 dark:peer-checked:border-indigo-50 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-500/10 peer-checked:text-indigo-600 dark:peer-checked:text-indigo-400 hover:bg-gray-50 dark:hover:bg-white/[0.03]">
					Female
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
			city: user?.city,
			country: user?.country,
			phoneNumber: user?.phoneNumber,
			gender: user?.gender,
		},
	});

	const { mutate, isPending } = useUpdateUser();

	function onSubmit(data) {
		mutate(data);
	}

	return (
		<div className="bg-white dark:bg-white/[0.03] p-6 sm:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-white/5 transition-colors duration-300">
			<div className="flex items-center gap-4 mb-10">
				<div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
					<HiUser className="w-6 h-6" />
				</div>
				<div>
					<h3 className="text-xl font-black text-gray-900 dark:text-white">
						Profile Information
					</h3>
					<p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
						Manage your account settings and profile visibility
					</p>
				</div>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<FormField label="Full Name" icon={HiUser} error={errors.name}>
						<input
							className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border transition-all duration-300 outline-none bg-gray-50/50 dark:bg-white/[0.03] focus:bg-white dark:focus:bg-white/[0.05] text-gray-900 dark:text-white font-black placeholder:text-gray-400 dark:placeholder:text-gray-600 ${
								errors.name
									? "border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-500/20"
									: "border-gray-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-sm"
							}`}
							type="text"
							placeholder="Your Name"
							{...register("name")}
						/>
					</FormField>

					<FormField
						label="Email Address"
						icon={HiEnvelope}
						error={errors.email}
					>
						<input
							className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border transition-all duration-300 outline-none bg-gray-50/50 dark:bg-white/[0.03] focus:bg-white dark:focus:bg-white/[0.05] text-gray-900 dark:text-white font-black placeholder:text-gray-400 dark:placeholder:text-gray-600 ${
								errors.email
									? "border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-500/20"
									: "border-gray-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-sm"
							}`}
							type="email"
							placeholder="name@example.com"
							{...register("email")}
						/>
					</FormField>

					<FormField label="City" icon={HiMapPin} error={errors.city}>
						<input
							className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border transition-all duration-300 outline-none bg-gray-50/50 dark:bg-white/[0.03] focus:bg-white dark:focus:bg-white/[0.05] text-gray-900 dark:text-white font-black placeholder:text-gray-400 dark:placeholder:text-gray-600 ${
								errors.city
									? "border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-500/20"
									: "border-gray-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-sm"
							}`}
							type="text"
							placeholder="Your City"
							{...register("city")}
						/>
					</FormField>

					<FormField label="Country" icon={HiGlobeAlt} error={errors.country}>
						<input
							className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border transition-all duration-300 outline-none bg-gray-50/50 dark:bg-white/[0.03] focus:bg-white dark:focus:bg-white/[0.05] text-gray-900 dark:text-white font-black placeholder:text-gray-400 dark:placeholder:text-gray-600 ${
								errors.country
									? "border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-500/20"
									: "border-gray-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-sm"
							}`}
							type="text"
							placeholder="Your Country"
							{...register("country")}
						/>
					</FormField>

					<FormField
						label="Phone Number"
						icon={HiPhone}
						error={errors.phoneNumber}
					>
						<input
							className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border transition-all duration-300 outline-none bg-gray-50/50 dark:bg-white/[0.03] focus:bg-white dark:focus:bg-white/[0.05] text-gray-900 dark:text-white font-black placeholder:text-gray-400 dark:placeholder:text-gray-600 ${
								errors.phoneNumber
									? "border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-500/20"
									: "border-gray-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-sm"
							}`}
							type="tel"
							placeholder="Your Phone Number"
							{...register("phoneNumber")}
						/>
					</FormField>

					<GenderSelector register={register} error={errors.gender} />
				</div>

				<div className="pt-6 border-t border-gray-50 dark:border-white/5">
					<button
						className="w-full sm:w-auto bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 active:bg-indigo-800 text-white font-black px-12 py-4 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer group"
						disabled={isPending}
					>
						{isPending ? (
							<>
								<div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
								<span>Saving Changes...</span>
							</>
						) : (
							<>
								<span>Save Profile</span>
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
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</>
						)}
					</button>
				</div>
			</form>
		</div>
	);
}
