import { Link, Outlet } from "react-router-dom";
import styles from "./AdminDashboard.module.css"; // Importing as a CSS module

function AdminDashboard() {
	return (
		<div className={styles.dashboardContainer}>
			{/* Sidebar Navigation */}
			<aside className={styles.sidebar}>
				<div className={styles.sidebarHeader}>Admin Dashboard</div>
				<ul className={styles.navList}>
					<li className={styles.navItem}>
						<Link to="/admin/users" className={styles.navLink}>
							Users
						</Link>
					</li>
					<li className={styles.navItem}>
						<Link to="/admin/recipes" className={styles.navLink}>
							Recipes
						</Link>
					</li>
					<li className={styles.navItem}>
						<Link to="/admin/categories" className={styles.navLink}>
							Categories
						</Link>
					</li>
					<li className={styles.navItem}>
						<Link to="/admin/department" className={styles.navLink}>
							Departments
						</Link>
					</li>
				</ul>
			</aside>

			{/* Main Content Area */}
			<div className={styles.mainContent}>
				<Outlet /> {/* Nested routes will render here */}
			</div>
		</div>
	);
}

export default AdminDashboard;
