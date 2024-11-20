import { useEffect, useState } from "react";
import axios from "../../../../interceptor/Interceptor"; // Custom Axios instance
import DepartmentService from "../../../../services/department-service/DepartmentService"; // DepartmentService
import styles from "./AllUser.module.css"; // CSS Module

const UserManagement = () => {
	const [users, setUsers] = useState([]);
	const [departments, setDepartments] = useState([]);
	const [roles] = useState(["ROLE_USER", "ROLE_ADMIN"]); // Roles
	const [user, setUser] = useState({
		id: null,
		username: "",
		email: "",
		departmentId: "", // Initial value for departmentId
		role: "", // Single role at a time
		password: "",
	});
	const [isEditMode, setIsEditMode] = useState(false);

	useEffect(() => {
		fetchUsers();
		fetchDepartments();
	}, []);

	const fetchUsers = async () => {
		try {
			const response = await axios.get("/admin/users");
			const data = response.data || []; // Ensure data is an array
			const formattedData = data.map((user) => ({
				...user,
				roles: Array.isArray(user.roles) ? user.roles.join(", ") : "",
			}));
			setUsers(formattedData);
		} catch (error) {
			console.error("Error fetching users", error);
		}
	};

	const fetchDepartments = async () => {
		try {
			const data = await DepartmentService.getDepartments();
			setDepartments(data);
		} catch (error) {
			console.error("Error fetching departments", error);
		}
	};

	const fetchUserById = async (id) => {
		try {
			const response = await axios.get(`/admin/user/${id}`);
			const userData = response.data;
			setUser({
				id: userData.id,
				username: userData.username,
				email: userData.email,
				departmentId: userData.department ? userData.department.id : "",
				role:
					userData.roles && userData.roles.length > 0 ? userData.roles[0] : "", // Assuming only one role per user
				password: "", // Keep password empty for security
			});
		} catch (error) {
			console.error("Error fetching user by ID:", error);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setUser({
			...user,
			[name]: value,
		});
	};

	const addUser = async () => {
		try {
			const payload = {
				username: user.username,
				email: user.email,
				password: user.password,
				department_id: user.departmentId, // Ensure departmentId is sent
				role: user.role,
			};
			await axios.post("/admin/user/create", payload);
			fetchUsers();
			clearForm();
			alert("User added successfully!");
		} catch (error) {
			console.error("Error adding user:", error);
			alert("Error adding user. Please try again.");
		}
	};

	const updateUser = async () => {
		try {
			const payload = {
				username: user.username,
				email: user.email,
				department_id: user.departmentId, // Ensure departmentId is sent
				roles: [user.role], // Roles as array
				password: user.password || undefined, // Only send password if provided
			};
			await axios.put(`/admin/user/edit/${user.id}`, payload);
			fetchUsers();
			clearForm();
			setIsEditMode(false);
			alert("User updated successfully!");
		} catch (error) {
			console.error("Error updating user:", error);
		}
	};

	const editUser = (userToEdit) => {
		setIsEditMode(true);
		fetchUserById(userToEdit.id); // Fetch user data by ID for roles
	};

	const deleteUser = async (id) => {
		if (window.confirm("Are you sure you want to delete this user?")) {
			try {
				await axios.delete(`/admin/user/delete/${id}`);
				fetchUsers();
				alert("User deleted successfully!");
			} catch (error) {
				console.error("Error deleting user:", error);
			}
		}
	};

	const clearForm = () => {
		setUser({
			id: null,
			username: "",
			email: "",
			departmentId: "", // Reset departmentId
			role: "", // Reset role
			password: "",
		});
		setIsEditMode(false);
	};

	return (
		<div className={styles.container}>
			<h2 className={styles.heading}>User Management</h2>
			<form className={styles.form} onSubmit={(e) => e.preventDefault()}>
				<label htmlFor="username" className={styles.label}>
					Username:
				</label>
				<input
					type="text"
					id="username"
					name="username"
					value={user.username}
					onChange={handleInputChange}
					required
					className={styles.input}
				/>

				<label htmlFor="email" className={styles.label}>
					Email:
				</label>
				<input
					type="email"
					id="email"
					name="email"
					value={user.email}
					onChange={handleInputChange}
					required
					className={styles.input}
				/>

				<label htmlFor="department" className={styles.label}>
					Department:
				</label>
				<select
					id="department"
					name="departmentId"
					value={user.departmentId || ""}
					onChange={handleInputChange}
					required
					className={styles.input}>
					<option value="">Select Department</option>
					{departments.map((department) => (
						<option key={department.id} value={department.id}>
							{department.name}
						</option>
					))}
				</select>

				<label htmlFor="role" className={styles.label}>
					Role:
				</label>
				<select
					id="role"
					name="role"
					value={user.role || ""}
					onChange={handleInputChange}
					required
					className={styles.input}>
					<option value="">Select Role</option>
					{roles.map((role) => (
						<option key={role} value={role}>
							{role}
						</option>
					))}
				</select>

				<label htmlFor="password" className={styles.label}>
					Password:
				</label>
				<input
					type="password"
					id="password"
					name="password"
					value={user.password}
					onChange={handleInputChange}
					required={!isEditMode} // Password required only in Add mode
					className={styles.input}
				/>

				<button
					type="submit"
					className={styles.submitButton}
					onClick={isEditMode ? updateUser : addUser}>
					{isEditMode ? "Update" : "Add"} User
				</button>
				<button
					type="button"
					onClick={clearForm}
					className={styles.cancelButton}>
					Cancel
				</button>
			</form>

			<table className={styles.usersTable}>
				<thead>
					<tr>
						<th>ID</th>
						<th>Username</th>
						<th>Email</th>
						<th>Department</th>
						<th>Role</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user) => (
						<tr key={user.id}>
							<td>{user.id}</td>
							<td>{user.username}</td>
							<td>{user.email}</td>
							<td>{user.department?.name || "No Department"}</td>
							<td>{user.roles}</td>
							<td>
								<button
									onClick={() => editUser(user)}
									className={styles.editButton}>
									Edit
								</button>
								<button
									onClick={() => deleteUser(user.id)}
									className={styles.deleteButton}>
									Delete
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default UserManagement;
