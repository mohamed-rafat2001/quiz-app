export default function Loader() {
	return (
		<div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
			<div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin flex items-center justify-center" />
			<h2 className="mt-6 text-indigo-600 font-bold text-lg tracking-widest uppercase animate-pulse">
				Loading
			</h2>
		</div>
	);
}
