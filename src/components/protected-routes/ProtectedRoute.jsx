// src/components/ProtectedRoute.js

import { Navigate } from "react-router-dom";
import JWTTokenService from "../../services/JWTTokenService/JWTTokenService";


const ProtectedRoute = ({ children, requiredRole }) => {
	const token = JWTTokenService.getToken();
	const isTokenExpired = JWTTokenService.isTokenExpired();

	if (!token || isTokenExpired) {
		JWTTokenService.clearToken();
		return <Navigate to="/login" replace />;
	}

	const decodedToken = JWTTokenService.getDecodedToken();
	const userRoles = JWTTokenService.extractRoles();

	// Allow access if user is an admin or has the required role
	if (
		userRoles.includes("ROLE_ADMIN") ||
		(requiredRole && userRoles.includes(requiredRole))
	) {
		return children;
	} else {
		return <Navigate to="/forbidden" replace />;
	}
};

export default ProtectedRoute;
