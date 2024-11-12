import {axios} from "axios";

class DepartmentService {
	// Set the base API URL
	constructor() {
		this.apiUrl = "http://localhost:8000/departments"; // Adjust the base URL accordingly
	}

	// Get all departments
	getDepartments() {
		return axios
			.get(this.apiUrl)
			.then((response) => response.data)
			.catch((error) => {
				console.error("Error fetching departments:", error);
				throw error;
			});
	}

	// Create a new department
	createDepartment(department) {
		return axios
			.post(`${this.apiUrl}/create`, department)
			.then((response) => response.data)
			.catch((error) => {
				console.error("Error creating department:", error);
				throw error;
			});
	}

	// Update a department by ID
	updateDepartment(id, department) {
		return axios
			.put(`${this.apiUrl}/edit/${id}`, department)
			.then((response) => response.data)
			.catch((error) => {
				console.error("Error updating department:", error);
				throw error;
			});
	}

	// Delete a department by ID
	deleteDepartment(id) {
		return axios
			.delete(`${this.apiUrl}/delete/${id}`)
			.then((response) => response.data)
			.catch((error) => {
				console.error("Error deleting department:", error);
				throw error;
			});
	}

	// Get a specific department by ID
	getDepartment(id) {
		return axios
			.get(`${this.apiUrl}/${id}`)
			.then((response) => response.data)
			.catch((error) => {
				console.error("Error fetching department:", error);
				throw error;
			});
	}
}

export default new DepartmentService();
