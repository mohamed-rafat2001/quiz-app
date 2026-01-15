import React from "react";
import { RouterProvider } from "react-router-dom";
import { AppProviders } from "./providers/AppProviders";
import { router } from "./routes";
import "./App.css";

function App() {
	return (
		<AppProviders>
			<RouterProvider router={router} />
		</AppProviders>
	);
}

export default App;
