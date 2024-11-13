import { createContext, useState, useContext, useEffect } from "react";
import JWTTokenService from "../../services/JWTTokenService/JWTTokenService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [userRoles, setUserRoles] = useState([]);

	useEffect(() => {
		// Check if there's a token in localStorage on mount
		const token = JWTTokenService.getToken();
		const isTokenExpired = JWTTokenService.isTokenExpired();

		if (token && !isTokenExpired) {
			// If token exists and is valid, set authentication state
			setIsAuthenticated(true);
			const decodedToken = JWTTokenService.getDecodedToken();
			const roles = JWTTokenService.extractRoles(decodedToken);
			setUserRoles(roles);
		} else {
			// If token is expired or invalid, clear the token and reset state
			JWTTokenService.clearToken();
			setIsAuthenticated(false);
			setUserRoles([]);
		}
	}, []); // Empty dependency array ensures this runs once when the component mounts

	const login = () => {
		setIsAuthenticated(true);
		const roles = JWTTokenService.extractRoles(); // Extract roles during login
		setUserRoles(roles);
	};

	const logout = () => {
		JWTTokenService.clearToken(); // Clear token on logout
		setIsAuthenticated(false);
		setUserRoles([]); // Clear roles on logout
	};

	return (
		<AuthContext.Provider value={{ isAuthenticated, userRoles, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

// Custom hook to access authentication context
export const useAuth = () => useContext(AuthContext);
