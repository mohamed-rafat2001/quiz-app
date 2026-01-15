import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./App.css";

console.log("main.jsx: entry point");

const root = document.getElementById("root");
if (!root) {
	console.error("main.jsx: Root element not found");
} else {
	console.log("main.jsx: Rendering App");
	ReactDOM.createRoot(root).render(
		<React.StrictMode>
			<App />
		</React.StrictMode>
	);
}
