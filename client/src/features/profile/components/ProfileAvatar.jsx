import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiCamera, HiTrash, HiChevronDown, HiPhoto } from "react-icons/hi2";
import { useUpdateUser, useDeleteUserImage } from "../../auth/hooks/useAuth";

const ImageUploadModal = ({ isOpen, onClose }) => {
	const [file, setFile] = useState(null);
	const [preview, setPreview] = useState(null);
	const [progress, setProgress] = useState(0);
	const fileInputRef = useRef(null);
	const { mutate: updateProfile, isPending } = useUpdateUser();

	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];
		if (selectedFile) {
			setFile(selectedFile);
			const reader = new FileReader();
			reader.onloadend = () => setPreview(reader.result);
			reader.readAsDataURL(selectedFile);
		}
	};

	const handleUpload = () => {
		if (!file) return;
		const formData = new FormData();
		formData.append("image", file);

		updateProfile(
			{
				data: formData,
				onUploadProgress: (p) => setProgress(p),
			},
			{
				onSuccess: () => {
					setTimeout(() => {
						onClose();
						setFile(null);
						setPreview(null);
						setProgress(0);
					}, 500);
				},
			}
		);
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
					/>
					<motion.div
						initial={{ scale: 0.9, opacity: 0, y: 20 }}
						animate={{ scale: 1, opacity: 1, y: 0 }}
						exit={{ scale: 0.9, opacity: 0, y: 20 }}
						className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 dark:border-white/5"
					>
						<h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
							Update Profile Picture
						</h3>

						<div
							onClick={() => fileInputRef.current?.click()}
							className="relative aspect-square w-48 mx-auto mb-8 rounded-3xl border-4 border-dashed border-gray-100 dark:border-white/10 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors cursor-pointer group overflow-hidden"
						>
							{preview ? (
								<img
									src={preview}
									alt="Preview"
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
									<HiPhoto className="w-12 h-12 mb-2 group-hover:scale-110 transition-transform" />
									<span className="text-xs font-black uppercase tracking-wider">
										Choose Photo
									</span>
								</div>
							)}
							<div className="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
								<HiCamera className="w-8 h-8 text-white" />
							</div>
						</div>

						<input
							type="file"
							ref={fileInputRef}
							onChange={handleFileChange}
							accept="image/*"
							className="hidden"
						/>

						{progress > 0 && (
							<div className="mb-6 space-y-2">
								<div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
									<span>Uploading...</span>
									<span>{progress}%</span>
								</div>
								<div className="h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
									<motion.div
										initial={{ width: 0 }}
										animate={{ width: `${progress}%` }}
										className="h-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]"
									/>
								</div>
							</div>
						)}

						<div className="flex gap-4">
							<button
								onClick={onClose}
								className="flex-1 py-4 px-6 rounded-2xl bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 font-black hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
							>
								Cancel
							</button>
							<button
								disabled={!file || isPending}
								onClick={handleUpload}
								className="flex-[2] py-4 px-6 rounded-2xl bg-indigo-600 text-white font-black shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-95"
							>
								{isPending ? "Uploading..." : "Save Picture"}
							</button>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
};

export default function ProfileAvatar({ user }) {
	const [isOpen, setIsOpen] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const dropdownRef = useRef(null);
	const { mutate: deleteImage, isPending: isDeleting } = useDeleteUserImage();

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="relative group cursor-pointer"
			>
				<div className="w-20 h-20 sm:w-24 sm:h-24 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-1 border border-gray-100 dark:border-white/5 transition-transform duration-500 group-hover:scale-105">
					<div className="w-full h-full bg-indigo-100 dark:bg-indigo-500/20 rounded-xl flex items-center justify-center overflow-hidden">
						{user?.profileImg?.secure_url ? (
							<img
								src={user.profileImg.secure_url}
								alt={user.name}
								className="w-full h-full object-cover"
							/>
						) : (
							<span className="text-indigo-600 dark:text-indigo-400 text-2xl sm:text-3xl font-black">
								{user?.name?.charAt(0).toUpperCase()}
							</span>
						)}
					</div>
				</div>
				<div className="absolute -bottom-1 -right-1 w-8 h-8 bg-indigo-600 rounded-xl border-4 border-white dark:border-gray-900 flex items-center justify-center text-white shadow-lg transition-transform group-hover:rotate-12">
					<HiChevronDown
						className={`w-4 h-4 transition-transform duration-500 ${
							isOpen ? "rotate-180" : ""
						}`}
					/>
				</div>
			</button>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: 10, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 10, scale: 0.95 }}
						className="absolute top-full left-0 mt-4 w-56 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-white/5 p-2 z-[60] overflow-hidden"
					>
						<button
							onClick={() => {
								setIsModalOpen(true);
								setIsOpen(false);
							}}
							className="w-full flex items-center gap-3 p-4 rounded-2xl text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all font-bold text-sm"
						>
							<HiCamera className="w-5 h-5" />
							Update Image
						</button>
						<button
							disabled={!user?.profileImg?.secure_url || isDeleting}
							onClick={() => {
								deleteImage();
								setIsOpen(false);
							}}
							className="w-full flex items-center gap-3 p-4 rounded-2xl text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed"
						>
							<HiTrash className="w-5 h-5" />
							Delete Image
						</button>
					</motion.div>
				)}
			</AnimatePresence>

			<ImageUploadModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</div>
	);
}
