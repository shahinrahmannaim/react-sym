import { Navigate,  } from "react-router-dom";
import JWTTokenService from "../../services/JWTTokenService/JWTTokenService";


const ProtectedRoute = ({ children, requiredRole }) => {
	const token = JWTTokenService.getToken();
	const isTokenExpired = JWTTokenService.isTokenExpired();

	// Redirect to login if the token is missing or expired
	if (!token || isTokenExpired) {
		JWTTokenService.clearToken();
		return <Navigate to="/login" replace />;
	}

	const decodedToken = JWTTokenService.getDecodedToken();
	const userRoles = decodedToken
		? JWTTokenService.extractRoles(decodedToken)
		: [];

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


// import { Navigate, Outlet } from "react-router-dom";
// import JWTTokenService from "../../services/JWTTokenService/JWTTokenService";

// const ProtectedRoute = ({ requiredRole }) => {
// 	const token = JWTTokenService.getToken();
// 	const isTokenExpired = JWTTokenService.isTokenExpired();

// 	// Redirect to login if the token is missing or expired
// 	if (!token || isTokenExpired) {
// 		JWTTokenService.clearToken();
// 		return <Navigate to="/login" replace />;
// 	}

// 	const decodedToken = JWTTokenService.getDecodedToken();
// 	const userRoles = decodedToken
// 		? JWTTokenService.extractRoles(decodedToken)
// 		: [];

// 	// Allow access if user is an admin or has the required role
// 	if (
// 		userRoles.includes("ROLE_ADMIN") ||
// 		(requiredRole && userRoles.includes(requiredRole))
// 	) {
// 		// Render nested routes using <Outlet />
// 		return <Outlet />;
// 	} else {
// 		// Redirect to forbidden page if role is insufficient
// 		return <Navigate to="/forbidden" replace />;
// 	}
// };

// export default ProtectedRoute;



// const ProtectedRoute = ({ requiredRole }) => {
// 	const { isAuthenticated, userRoles } = useAuth(); // Use AuthContext to access roles

// 	// If not authenticated or token expired, redirect to login
// 	if (!isAuthenticated) {
// 		return <Navigate to="/login" replace />;
// 	}

// 	// If the role matches, allow access
// 	if (
// 		userRoles.includes("ROLE_ADMIN") ||
// 		(requiredRole && userRoles.includes(requiredRole))
// 	) {
// 		return <Outlet />;
// 	} else {
// 		// Otherwise, redirect to a forbidden page
// 		return <Navigate to="/forbidden" replace />;
// 	}
// };
// export default ProtectedRoute;
// ProtectedRoute.js

// import { Navigate } from "react-router-dom";
// import { useAuth } from "../../services/JWTTokenService/AuthContext"; // Assuming you're using a custom hook

// function ProtectedRoute({ children, requiredRole }) {
// 	const { isAuthenticated, userRoles } = useAuth();
	
// 	// Check if user is authenticated and has the required role
// 	if (!isAuthenticated || !userRoles.includes(requiredRole)) {
// 		return <Navigate to="/login" replace />;
// 	}

// 	return children;
// }

// export default ProtectedRoute;

