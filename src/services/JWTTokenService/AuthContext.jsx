// AuthContext.jsx
import { createContext, useState, useContext, useEffect } from "react";
import JWTTokenService from "./JWTTokenService"; // Adjust the import path as needed

// Create the Auth context
const AuthContext = createContext();

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [userRoles, setUserRoles] = useState([]);

	useEffect(() => {
		const token = JWTTokenService.getToken();
		if (token && !JWTTokenService.isTokenExpired()) {
			setIsAuthenticated(true);
			const decodedToken = JWTTokenService.getDecodedToken();
			const roles = JWTTokenService.extractRoles(decodedToken);
			setUserRoles(roles);
		} else {
			JWTTokenService.clearToken();
			setIsAuthenticated(false);
			setUserRoles([]);
		}
	}, []);

	const login = (token) => {
		JWTTokenService.setToken(token);
		const decodedToken = JWTTokenService.getDecodedToken();
		const roles = JWTTokenService.extractRoles(decodedToken);
		setIsAuthenticated(true);
		setUserRoles(roles); // Explicitly set state here to trigger re-render
	};

	const logout = () => {
		JWTTokenService.clearToken();
		setIsAuthenticated(false);
		setUserRoles([]);
	};

	return (
		<AuthContext.Provider value={{ isAuthenticated, userRoles, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};


// Custom hook to use the Auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
