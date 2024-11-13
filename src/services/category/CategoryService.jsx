// src/services/CategoryService.js
import apiClient from "../../interceptor/Interceptor";


class CategoryService {
   
  

	// Fetch all categories
	getCategories() {
		return apiClient.get("/categories");
	}

	// Create a new category
	createCategory(category) {
		return apiClient.post("/categories/create", category);
	}

	// Update an existing category by ID
	updateCategory(id, category) {
		return apiClient.put(`/categories/edit/${id}`, category);
	}

	// Delete a category by ID
	deleteCategory(id) {
		return apiClient.delete(`/categories/delete/${id}`);
	}

	// Get details for a specific category by ID
	getCategory(id) {
		return apiClient.get(`/categories/${id}`);
	}
}

// Export an instance of CategoryService
export default new CategoryService();
