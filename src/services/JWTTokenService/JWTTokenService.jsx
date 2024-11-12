import { jwtDecode } from "jwt-decode";

class JWTTokenService {
	constructor() {
		this.jwtToken = null;
		this.decodedToken = null;
	}

	// Set the JWT token and save it to localStorage
	setToken(token) {
		if (token) {
			this.jwtToken = token;
			localStorage.setItem("sym-api", token); // Save the token in localStorage
		}
	}

	// Load token from localStorage
	getToken() {
		if (!this.jwtToken) {
			this.jwtToken = localStorage.getItem("sym-api"); // Load from localStorage if not set
		}
		return this.jwtToken;
	}

	// Decode the token if available
	decodeToken() {
		const token = this.getToken(); // Ensure we load the token
		if (token) {
			this.decodedToken = jwtDecode(token);
		}
	}

	// Get the decoded token
	getDecodedToken() {
		// If no decoded token, decode it
		if (!this.decodedToken) {
			this.decodeToken();
		}
		return this.decodedToken;
	}

	// Get specific information from the token (e.g., username)
	getUser() {
		const decoded = this.getDecodedToken();
		return decoded ? decoded["username"] : null;
	}

	// Get the expiry time of the token
	getExpiryTime() {
		const decoded = this.getDecodedToken();
		return decoded ? parseInt(decoded["exp"], 10) : null;
	}

	// Check if the token is expired
	isTokenExpired() {
		const expiryTime = this.getExpiryTime();
		if (expiryTime) {
			return new Date().getTime() > expiryTime * 1000;
		}
		return false;
	}

	// Utility to extract roles from the token
	extractRoles() {
		const decodedToken = this.getDecodedToken();
		const roles = decodedToken?.["roles"];
		if (typeof roles === "string") {
			return [roles];
		} else if (Array.isArray(roles)) {
			return roles;
		}
		return [];
	}

	// Clear the token on logout
	clearToken() {
		localStorage.removeItem("sym-api");
		this.jwtToken = null;
		this.decodedToken = null;
	}
}

export default new JWTTokenService();
