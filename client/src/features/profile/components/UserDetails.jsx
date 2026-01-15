import { useForm } from "react-hook-form";
import { useUpdateUser } from "../../auth/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateMeSchema } from "../../../shared/validation/schemas";

export default function UserDetails({ user }) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(updateMeSchema),
		defaultValues: {
			name: user?.name,
			email: user?.email,
		},
	});

	const { mutate, isPending } = useUpdateUser();

	function onSubmit(data) {
		mutate(data);
	}

	return (
		<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
			<h3 className="text-xl font-bold text-gray-800 mb-6">
				Profile Information
			</h3>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
				<div className="space-y-2">
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
						{...register("name")}
					/>
					{errors.name && (
						<p className="text-xs text-red-500 ml-1 font-medium">
							{errors.name.message}
						</p>
					)}
				</div>

				<div className="space-y-2">
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
						{...register("email")}
					/>
					{errors.email && (
						<p className="text-xs text-red-500 ml-1 font-medium">
							{errors.email.message}
						</p>
					)}
				</div>

				<div className="pt-2">
					<button
						className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-70"
						disabled={isPending}
					>
						{isPending ? "Saving..." : "Update Profile"}
					</button>
				</div>
			</form>
		</div>
	);
}
