
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar() {
	const navigate = useNavigate();
	const isAuthenticated = !!localStorage.getItem("token"); // Check if user is logged in

	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/login");
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
						<li>
							<button onClick={handleLogout} className={styles.logoutButton}>
								Logout
							</button>
						</li>
					)}
				</ul>
			</div>
		</nav>
	);
}

export default Navbar;
