import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useAuth } from "../../services/JWTTokenService/AuthContext"; // Ensure correct import

function Navbar() {
	const navigate = useNavigate();
	const auth = useAuth(); // Access authentication context

	// Ensure auth is properly defined
	const isAuthenticated = auth?.isAuthenticated ?? false;
	const logout = auth?.logout ?? (() => {}); // Fallback to a no-op function if undefined

	// Handle logout functionality
	const handleLogout = () => {
		logout(); // Logout via context
		navigate("/login"); // Redirect to login page
	};

	return (
		<nav className={styles.navbar}>
			<div className={styles.logo}>
				<NavLink to="/" end>
					MyApp
				</NavLink>
			</div>
			<div className={styles.menu}>
				<ul>
					<li>
						<NavLink
							to="/"
							end
							className={({ isActive }) => (isActive ? styles.active : "")}>
							Home
						</NavLink>
					</li>
					{/* Show Login/Register links if user is not authenticated */}
					{!isAuthenticated ? (
						<>
							<li>
								<NavLink
									to="/login"
									className={({ isActive }) => (isActive ? styles.active : "")}>
									Login
								</NavLink>
							</li>
							<li>
								<NavLink
									to="/register"
									className={({ isActive }) => (isActive ? styles.active : "")}>
									Register
								</NavLink>
							</li>
						</>
					) : (
						// Show Logout if user is authenticated
						<li>
							<span onClick={handleLogout} className={styles.logoutButton}>
								Logout
							</span>
						</li>
					)}
				</ul>
			</div>
		</nav>
	);
}

export default Navbar;
