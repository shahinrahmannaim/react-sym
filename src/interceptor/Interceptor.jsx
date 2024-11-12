// src/axiosInterceptor.js
import axios from "axios";
import JWTTokenService from "../services/JWTTokenService/JWTTokenService";


// Create an instance of Axios
const apiClient = axios.create({
	baseURL: "http://localhost:8000/api", // Set your API base URL
});

// Set up the interceptor
apiClient.interceptors.request.use(
	(config) => {
		// Get the token from JWTTokenService
		const token = JWTTokenService.getToken();

		console.log("Interceptor triggered");
		console.log("Token:", token); // Log the token for debugging

		// If the token exists, add it to the headers
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	(error) => {
		// Handle errors here
		return Promise.reject(error);
	}
);

export default apiClient;
