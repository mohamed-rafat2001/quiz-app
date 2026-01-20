import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../../../features/auth/hooks/useAuth";
import Loader from "./Loader";

const ProtectedRoute = ({ children, allowedRoles }) => {
	const { data: user, isLoading } = useUser();
	const location = useLocation();

	if (isLoading) return <Loader />;

	if (!user) {
		return <Navigate to="/welcome" state={{ from: location }} replace />;
	}

	if (allowedRoles && !allowedRoles.includes(user.role)) {
		// If user is not authorized, redirect to dashboard or home
		return <Navigate to="/app/dashboard" replace />;
	}

	return children;
};

export default ProtectedRoute;
