import { useForm } from "react-hook-form";
import { useUpdateUser, useUser } from "../../auth/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateMeSchema } from "../../../shared/validation/schemas";
import { useEffect } from "react";
import {
	HiUser,
	HiEnvelope,
	HiMapPin,
	HiGlobeAlt,
	HiPhone,
	HiUsers,
} from "react-icons/hi2";

const FormField = ({ label, id, icon: Icon, error, children }) => (
	<div className="space-y-1.5">
		<label
			htmlFor={id}
			className="text-sm font-black text-gray-900 dark:text-white/70 ml-1"
		>
			{label}
		</label>
		<div className="relative group">
			<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-white/40 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
				<Icon className="h-5 w-5" />
			</div>
			{children}
		</div>
		{error && (
			<p
				id={`${id}-error`}
				className="text-xs text-red-600 dark:text-red-500 ml-1 font-black animate-shake"
			>
				{error.message}
			</p>
		)}
	</div>
);

const GenderSelector = ({ register, error, disabled }) => (
	<fieldset className="space-y-2">
		<legend className="text-sm font-black text-gray-900 dark:text-white/70 ml-1 block">
			Gender
		</legend>
		<div className={`flex gap-4 ${disabled ? "opacity-70" : ""}`}>
			<label
				htmlFor="gender-male"
				className={`flex-1 ${disabled ? "cursor-default" : "cursor-pointer"}`}
			>
				<input
					type="radio"
					value="male"
					id="gender-male"
					className="peer sr-only"
					disabled={disabled}
					{...register("gender")}
				/>
				<div className="w-full text-center py-2.5 px-4 rounded-xl border-2 border-gray-100 dark:border-white/5 text-gray-500 dark:text-white/50 font-black transition-all peer-checked:border-indigo-600 dark:peer-checked:border-indigo-50 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-500/10 peer-checked:text-indigo-600 dark:peer-checked:text-indigo-400 hover:bg-gray-50 dark:hover:bg-white/[0.03] peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500">
					Male
				</div>
			</label>
			<label
				htmlFor="gender-female"
				className={`flex-1 ${disabled ? "cursor-default" : "cursor-pointer"}`}
			>
				<input
					type="radio"
					value="female"
					id="gender-female"
					className="peer sr-only"
					disabled={disabled}
					{...register("gender")}
				/>
				<div className="w-full text-center py-2.5 px-4 rounded-xl border-2 border-gray-100 dark:border-white/5 text-gray-500 dark:text-white/50 font-black transition-all peer-checked:border-indigo-600 dark:peer-checked:border-indigo-50 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-500/10 peer-checked:text-indigo-600 dark:peer-checked:text-indigo-400 hover:bg-gray-50 dark:hover:bg-white/[0.03] peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500">
					Female
				</div>
			</label>
		</div>
		{error && (
			<p className="text-xs text-red-600 dark:text-red-500 ml-1 font-black">
				{error.message}
			</p>
		)}
	</fieldset>
);

export default function UserDetails({ user }) {
	const { data: currentUser } = useUser();
	const isOwner = currentUser?._id === user?._id;

	const {
		register,
		handleSubmit,
		reset,
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

	// Reset form when user data changes (e.g., after successful update)
	useEffect(() => {
		if (user) {
			reset({
				name: user.name,
				email: user.email,
				city: user.city,
				country: user.country,
				phoneNumber: user.phoneNumber,
				gender: user.gender,
			});
		}
	}, [user, reset]);

	const { mutate, isPending } = useUpdateUser();

	function onSubmit(data) {
		if (!isOwner) return;
		mutate({ data });
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
					<p className="text-sm text-gray-500 dark:text-white/40 font-medium">
						{isOwner
							? "Manage your account settings and profile visibility"
							: "View user profile details"}
					</p>
				</div>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<FormField
						label="Full Name"
						id="profile-name"
						icon={HiUser}
						error={errors.name}
					>
						<input
							id="profile-name"
							disabled={!isOwner}
							className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border transition-all duration-300 outline-none bg-gray-50/50 dark:bg-white/[0.03] focus:bg-white dark:focus:bg-white/[0.05] text-gray-900 dark:text-white font-black placeholder:text-gray-400 dark:placeholder:text-white/30 disabled:opacity-70 disabled:cursor-default ${
								errors.name
									? "border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-500/20"
									: "border-gray-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-sm"
							}`}
							type="text"
							placeholder="Your Name"
							{...register("name")}
							name="name"
							autoComplete="name"
						/>
					</FormField>

					<FormField
						label="Email Address"
						id="profile-email"
						icon={HiEnvelope}
						error={errors.email}
					>
						<input
							id="profile-email"
							disabled={!isOwner}
							className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border transition-all duration-300 outline-none bg-gray-50/50 dark:bg-white/[0.03] focus:bg-white dark:focus:bg-white/[0.05] text-gray-900 dark:text-white font-black placeholder:text-gray-400 dark:placeholder:text-white/30 disabled:opacity-70 disabled:cursor-default ${
								errors.email
									? "border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-500/20"
									: "border-gray-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-sm"
							}`}
							type="email"
							placeholder="name@example.com"
							{...register("email")}
							name="email"
							autoComplete="email"
						/>
					</FormField>

					<FormField label="City" id="profile-city" icon={HiMapPin} error={errors.city}>
						<input
							id="profile-city"
							disabled={!isOwner}
							className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border transition-all duration-300 outline-none bg-gray-50/50 dark:bg-white/[0.03] focus:bg-white dark:focus:bg-white/[0.05] text-gray-900 dark:text-white font-black placeholder:text-gray-400 dark:placeholder:text-white/30 disabled:opacity-70 disabled:cursor-default ${
								errors.city
									? "border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-500/20"
									: "border-gray-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-sm"
							}`}
							type="text"
							placeholder="Your City"
							{...register("city")}
							name="city"
							autoComplete="address-level2"
						/>
					</FormField>

					<FormField
						label="Country"
						id="profile-country"
						icon={HiGlobeAlt}
						error={errors.country}
					>
						<input
							id="profile-country"
							disabled={!isOwner}
							className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border transition-all duration-300 outline-none bg-gray-50/50 dark:bg-white/[0.03] focus:bg-white dark:focus:bg-white/[0.05] text-gray-900 dark:text-white font-black placeholder:text-gray-400 dark:placeholder:text-white/30 disabled:opacity-70 disabled:cursor-default ${
								errors.country
									? "border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-500/20"
									: "border-gray-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-sm"
							}`}
							type="text"
							placeholder="Your Country"
							{...register("country")}
							name="country"
							autoComplete="country-name"
						/>
					</FormField>

					<FormField
						label="Phone Number"
						id="profile-phoneNumber"
						icon={HiPhone}
						error={errors.phoneNumber}
					>
						<input
							id="profile-phoneNumber"
							disabled={!isOwner}
							className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border transition-all duration-300 outline-none bg-gray-50/50 dark:bg-white/[0.03] focus:bg-white dark:focus:bg-white/[0.05] text-gray-900 dark:text-white font-black placeholder:text-gray-400 dark:placeholder:text-white/30 disabled:opacity-70 disabled:cursor-default ${
								errors.phoneNumber
									? "border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-500/20"
									: "border-gray-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-sm"
							}`}
							type="tel"
							placeholder="Your Phone Number"
							{...register("phoneNumber")}
							name="phoneNumber"
							autoComplete="tel"
						/>
					</FormField>

					<GenderSelector
						register={register}
						error={errors.gender}
						disabled={!isOwner}
					/>
				</div>

				{isOwner && (
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
				)}
			</form>
		</div>
	);
}
