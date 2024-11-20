import { useState, useEffect } from "react";
import DepartmentService from "../../../services/department-service/DepartmentService";
import styles from "./DepartmentComponent.module.css";

const DepartmentComponent = () => {
	const [departments, setDepartments] = useState([]);
	const [newDepartment, setNewDepartment] = useState({ name: "" });
	const [editMode, setEditMode] = useState(false);
	const [currentDepartmentId, setCurrentDepartmentId] = useState(null);

	useEffect(() => {
		fetchDepartments();
	}, []);

	// Fetch all departments
	const fetchDepartments = async () => {
		try {
			const data = await DepartmentService.getDepartments();
			setDepartments(data);
		} catch (error) {
			console.error("Error fetching departments:", error);
		}
	};

	// Add a new department
	const addDepartment = async () => {
		if (newDepartment.name) {
			try {
				await DepartmentService.createDepartment(newDepartment);
				alert("Department added successfully!");
				setNewDepartment({ name: "" });
				fetchDepartments();
			} catch (error) {
				console.error("Error adding department:", error);
			}
		}
	};

	// Edit an existing department
	const editDepartment = (department) => {
		setEditMode(true);
		setCurrentDepartmentId(department.id);
		setNewDepartment({ name: department.name });
	};

	// Update the department
	const updateDepartment = async () => {
		if (currentDepartmentId && newDepartment.name) {
			try {
				await DepartmentService.updateDepartment(
					currentDepartmentId,
					newDepartment
				);
				alert("Department updated successfully!");
				setEditMode(false);
				setNewDepartment({ name: "" });
				setCurrentDepartmentId(null);
				fetchDepartments();
			} catch (error) {
				console.error("Error updating department:", error);
			}
		}
	};

	// Delete a department
	const deleteDepartment = async (id) => {
		if (window.confirm("Are you sure you want to delete this department?")) {
			try {
				await DepartmentService.deleteDepartment(id);
				alert("Department deleted successfully!");
				fetchDepartments();
			} catch (error) {
				console.error("Error deleting department:", error);
			}
		}
	};

	return (
		<div className={styles.departmentContainer}>
			<h2>Department Management</h2>
			{/* Add/Edit Department Form */}
			<div className={styles.departmentForm}>
				<input
					type="text"
					value={newDepartment.name}
					placeholder="Department Name"
					onChange={(e) => setNewDepartment({ name: e.target.value })}
				/>
				<button onClick={editMode ? updateDepartment : addDepartment}>
					{editMode ? "Update Department" : "Add Department"}
				</button>
			</div>

			{/* Department List */}
			<ul className={styles.departmentList}>
				{departments.map((department) => (
					<li key={department.id} className={styles.departmentListItem}>
						<span className={styles.departmentInfo}>{department.name}</span>
						<div className={styles.actions}>
							<button
								className={`${styles.button} ${styles.editButton}`}
								onClick={() => editDepartment(department)}>
								Edit
							</button>
							<button
								className={`${styles.button} ${styles.deleteButton}`}
								onClick={() => deleteDepartment(department.id)}>
								Delete
							</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default DepartmentComponent;
