import { createContext, useContext, useEffect, useState } from "react";

const DarkModeContext = createContext();

function DarkModeProvider({ children }) {
	const [isDarkMode, setIsDarkMode] = useState(function () {
		const savedMode = localStorage.getItem("isDarkMode");
		return savedMode
			? JSON.parse(savedMode)
			: window.matchMedia("(prefers-color-scheme: dark)").matches;
	});

	useEffect(() => {
		const html = window.document.documentElement;
		if (isDarkMode) {
			html.classList.add("dark");
		} else {
			html.classList.remove("dark");
		}
		localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
	}, [isDarkMode]);

	function toggleDarkMode() {
		setIsDarkMode((prev) => !prev);
	}

	return (
		<DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
			{children}
		</DarkModeContext.Provider>
	);
}

function useDarkMode() {
	const context = useContext(DarkModeContext);
	if (context === undefined)
		throw new Error("DarkModeContext was used outside of DarkModeProvider");
	return context;
}

export { DarkModeProvider, useDarkMode };
