import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./Login.module.css";
import { useAuth } from "../../services/JWTTokenService/AuthContext";

// const Login = () => {
// 	const [loginObj, setLoginObj] = useState({ email: "", password: "" });
// 	const navigate = useNavigate();

// 	const handleInputChange = (e) => {
// 		const { name, value } = e.target;
// 		setLoginObj({ ...loginObj, [name]: value });
// 	};

// 	const onLogin = async () => {
// 		try {
// 			const response = await fetch("http://localhost:8000/api/login", {
// 				method: "POST",
// 				headers: { "Content-Type": "application/json" },
// 				body: JSON.stringify(loginObj),
// 			});

// 			if (!response.ok) {
// 				if (response.status === 403) {
// 					alert(
// 						"Please verify your account by clicking the confirmation link in your email."
// 					);
// 				} else if (response.status === 404) {
// 					alert("User does not exist");
// 				} else {
// 					alert("Incorrect User Credentials");
// 				}
// 				return;
// 			}

// 			const res = await response.json();
// 			console.log("Response from API:", res);

// 			if (res.token) {
// 				JWTTokenService.setToken(res.token);
// 				JWTTokenService.decodeToken();

// 				const roles = JWTTokenService.extractRoles();
// 				console.log("Extracted roles:", roles);

// 				if (roles.includes("ROLE_ADMIN")) {
// 					navigate("/admin");
// 					//  window.location.reload();
// 					alert("Admin login success");
// 					return;
// 				}

// 				if (roles.includes("ROLE_USER")) {
// 					navigate("/recipes");
// 					//  window.location.reload();
// 					alert("User login success");
// 					return;
// 				}

// 				alert("No valid role found");
// 				navigate("/login");
// 			} else {
// 				alert("Login failed - no token provided");
// 			}
// 		} catch (error) {
// 			console.error("Error during login:", error);
// 			alert("An error occurred. Please try again.");
// 		}
// 	};

// 	return (
// 		<div className={styles.loginContainer}>
// 			<form
// 				onSubmit={(e) => {
// 					e.preventDefault();
// 					onLogin();
// 				}}>
// 				<h1>Login</h1>
// 				<input
// 					type="email"
// 					name="email"
// 					value={loginObj.email}
// 					onChange={handleInputChange}
// 					required
// 					placeholder="Email"
// 				/>

// 				<input
// 					type="password"
// 					name="password"
// 					value={loginObj.password}
// 					onChange={handleInputChange}
// 					required
// 					placeholder="Password"
// 				/>

// 				<button type="submit" className={styles.btn}>
// 					Login
// 				</button>
// 			</form>
// 		</div>
// 	);
// };

// export default Login;

// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import JWTTokenService from "../../services/JWTTokenService/JWTTokenService";
// import styles from "./Login.module.css";
// import { useAuth } from "../../services/JWTTokenService/AuthContext";

// const Login = () => {
// 	const [loginObj, setLoginObj] = useState({ email: "", password: "" });
// 	const [isLoading, setIsLoading] = useState(false); // Track loading state
// 	const navigate = useNavigate();
// 	const { login } = useAuth();

// 	const handleInputChange = (e) => {
// 		const { name, value } = e.target;
// 		setLoginObj({ ...loginObj, [name]: value });
// 	};

// 	const onLogin = async () => {
// 		setIsLoading(true); // Set loading to true while making the API request
// 		try {
// 			const response = await fetch("http://localhost:8000/api/login", {
// 				method: "POST",
// 				headers: { "Content-Type": "application/json" },
// 				body: JSON.stringify(loginObj),
// 			});

// 			if (!response.ok) {
// 				if (response.status === 403) {
// 					alert(
// 						"Please verify your account by clicking the confirmation link in your email."
// 					);
// 				} else if (response.status === 404) {
// 					alert("User does not exist");
// 				} else {
// 					alert("Incorrect User Credentials");
// 				}
// 				return;
// 			}

// 			const res = await response.json();
// 			console.log("Response from API:", res);

// 			if (res.token) {
// 				login(res.token); // Update the auth context

// 				const roles = JWTTokenService.extractRoles(res.token);
// 				console.log("Extracted roles:", roles);

// 				// Navigate based on the roles
// 				if (roles.includes("ROLE_ADMIN")) {
// 					navigate("/admin");
// 					alert("Admin login success");
// 				} else if (roles.includes("ROLE_USER")) {
// 					navigate("/recipes");
// 					alert("User login success");
// 				} else {
// 					alert("No valid role found");
// 					navigate("/login");
// 				}
// 			} else {
// 				alert("Login failed - no token provided");
// 			}
// 		} catch (error) {
// 			console.error("Error during login:", error);
// 			alert("An error occurred. Please try again.");
// 		} finally {
// 			setIsLoading(false); // Reset loading state after the API call
// 		}
// 	};

// 	return (
// 		<div className={styles.loginContainer}>
// 			<form
// 				onSubmit={(e) => {
// 					e.preventDefault();
// 					onLogin();
// 				}}>
// 				<h1>Login</h1>
// 				<input
// 					type="email"
// 					name="email"
// 					value={loginObj.email}
// 					onChange={handleInputChange}
// 					required
// 					placeholder="Email"
// 				/>
// 				<input
// 					type="password"
// 					name="password"
// 					value={loginObj.password}
// 					onChange={handleInputChange}
// 					required
// 					placeholder="Password"
// 				/>
// 				<button type="submit" className={styles.btn} disabled={isLoading}>
// 					{isLoading ? "Logging in..." : "Login"}
// 				</button>
// 			</form>
// 		</div>
// 	);
// };

// export default Login;


const Login = () => {
	const [loginObj, setLoginObj] = useState({ email: "", password: "" });
	const [isLoading, setIsLoading] = useState(false);
	const { login } = useAuth(); // Use AuthContext's login method
	const navigate = useNavigate();

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setLoginObj({ ...loginObj, [name]: value });
	};

	const onLogin = async () => {
		setIsLoading(true); // Set loading state
		try {
			const response = await fetch("http://localhost:8000/api/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(loginObj),
			});

			const res = await response.json();
			console.log("Response from API:", res);

			if (res.token) {
				login(res.token); // Update AuthContext with the new token
				if (res.roles.includes("ROLE_ADMIN")) {
					navigate("/admin"); // Redirect to admin dashboard
				} else if (res.roles.includes("ROLE_USER")) {
					navigate("/recipes"); // Redirect to user recipe page
				}
			} else {
				alert("Login failed - Please verify your account!");
			}
		} catch (error) {
			console.error("Error during login:", error);
			alert("An error occurred. Please try again.");
		} finally {
			setIsLoading(false); // Reset loading state
		}
	};

	return (
		<div className={styles.loginContainer}>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					onLogin();
				}}>
				<h1>Login</h1>
				<input
					type="email"
					name="email"
					value={loginObj.email}
					onChange={handleInputChange}
					required
					placeholder="Email"
				/>
				<input
					type="password"
					name="password"
					value={loginObj.password}
					onChange={handleInputChange}
					required
					placeholder="Password"
				/>
				<button type="submit" className={styles.btn} disabled={isLoading}>
					{isLoading ? "Logging in..." : "Login"}
				</button>
			</form>
		</div>
	);
};export default Login;

