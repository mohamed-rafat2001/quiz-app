import React from "react";
import { RouterProvider } from "react-router-dom";
import AppProviders from "./providers/AppProviders";
import { router } from "./routes";

function App() {
	console.log("App component rendering");
	return (
		<AppProviders>
			<RouterProvider router={router} />
		</AppProviders>
	);
}

export default App;
