// src/services/CategoryService.js
import apiClient from "../../interceptor/Interceptor";


class CategoryService {
	// Fetch all categories
	getCategories() {
		return apiClient.get("/categories");
	}
	// Get details for a specific category by ID
	getCategory(id) {
		return apiClient.get(`/category/${id}`);
	}

	// Create a new category
	createCategory(category) {
		return apiClient.post("/category/create", category);
	}

	// Update an existing category by ID
	updateCategory(id, category) {
		return apiClient.put(`/category/edit/${id}`, category);
	}

	// Delete a category by ID
	deleteCategory(id) {
		return apiClient.delete(`/category/delete/${id}`);
	}
}

// Export an instance of CategoryService
export default new CategoryService();
