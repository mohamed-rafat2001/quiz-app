import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 60 * 1000, // 1 minute
		},
	},
});

const AppProviders = ({ children }) => {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<Toaster
				position="top-center"
				gutter={12}
				containerStyle={{ margin: "8px" }}
				toastOptions={{
					success: {
						duration: 3000,
						iconTheme: {
							primary: "#10b981",
							secondary: "white",
						},
						style: {
							border: "1px solid #d1fae5",
							background: "#f0fdf4",
							color: "#065f46",
						},
					},
					error: {
						duration: 5000,
						iconTheme: {
							primary: "#ef4444",
							secondary: "white",
						},
						style: {
							border: "1px solid #fee2e2",
							background: "#fef2f2",
							color: "#991b1b",
						},
					},
					style: {
						fontSize: "14px",
						fontWeight: "600",
						maxWidth: "500px",
						padding: "16px 24px",
						borderRadius: "20px",
						boxShadow:
							"0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
					},
				}}
			/>
			{/* <ReactQueryDevtools initialIsOpen={false} /> */}
		</QueryClientProvider>
	);
};

export default AppProviders;
