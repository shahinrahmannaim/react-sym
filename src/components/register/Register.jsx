import  { useState, useEffect } from "react";
import DepartmentService from "../../services/department-service/DepartmentService"; // Adjust the path accordingly
import styles from "./Register.module.css"; // Importing the CSS module

const Register = () => {
	const [signupData, setSignupData] = useState({
		username: "",
		email: "",
		password: "",
		departmentId: "",
	});

	const [departments, setDepartments] = useState([]);
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		// Fetch departments when the component is mounted
		DepartmentService.getDepartments()
			.then((data) => {
				setDepartments(data);
			})
			.catch((error) => {
				console.error("Error fetching departments:", error);
			});
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setSignupData({ ...signupData, [name]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const payload = {
			username: signupData.username,
			email: signupData.email,
			password: signupData.password,
			department_id: signupData.departmentId,
		};

		// Call API for signup
		fetch("http://localhost:8000/api/register/test", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		})
			.then((response) => response.json())
			.then((res) => {
				alert("Signup successful! You can now log in.");
				window.location.href = "/login"; // Redirect to login
			})
			.catch((error) => {
				setErrorMessage(
					"Signup failed. Please try again. Error: " + error.message
				);
				console.error("Error during signup:", error);
			});
	};

	return (
		<div className={styles.signupContainer}>
			<form onSubmit={handleSubmit} className={styles.signupForm}>
				<div className={styles.formGroup}>
					<h2>Signup</h2>
					<label htmlFor="username">Username</label>
					<input
						type="text"
						id="username"
						name="username"
						value={signupData.username}
						onChange={handleChange}
						required
					/>
				</div>
				<div className={styles.formGroup}>
					<label htmlFor="email">Email</label>
					<input
						type="email"
						id="email"
						name="email"
						value={signupData.email}
						onChange={handleChange}
						required
					/>
				</div>
				<div className={styles.formGroup}>
					<label htmlFor="password">Password</label>
					<input
						type="password"
						id="password"
						name="password"
						value={signupData.password}
						onChange={handleChange}
						required
					/>
				</div>
				<div className={styles.formGroup}>
					<label htmlFor="departmentId">Department</label>
					<select
						id="departmentId"
						name="departmentId"
						value={signupData.departmentId}
						onChange={handleChange}
						required>
						<option value="">Select Department</option>
						{departments.map((department) => (
							<option key={department.id} value={department.id}>
								{department.name}
							</option>
						))}
					</select>
				</div>
				{errorMessage && (
					<div className={styles.errorMessage}>{errorMessage}</div>
				)}
				<button type="submit" className={styles.submitButton}>
					Signup
				</button>
			</form>
		</div>
	);
};

export default Register;
