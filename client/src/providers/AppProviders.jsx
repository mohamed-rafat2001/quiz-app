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
					},
					error: {
						duration: 5000,
					},
					style: {
						fontSize: "16px",
						maxWidth: "500px",
						padding: "16px 24px",
						backgroundColor: "#fff",
						color: "#374151",
					},
				}}
			/>
			{/* <ReactQueryDevtools initialIsOpen={false} /> */}
		</QueryClientProvider>
	);
};

export default AppProviders;
