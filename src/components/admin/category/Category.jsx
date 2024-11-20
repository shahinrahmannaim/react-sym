import { useState, useEffect } from "react";
import CategoryService from "../../../services/category/CategoryService";
import styles from "./Category.module.css";

const CategoryComponent = () => {
	const [categories, setCategories] = useState([]); // Initialize as empty array
	const [newCategory, setNewCategory] = useState({ name: "" });
	const [editMode, setEditMode] = useState(false);
	const [currentCategoryId, setCurrentCategoryId] = useState(null);

	// Fetch categories on component mount
	useEffect(() => {
		fetchCategories();
	}, []);

	// Fetch all categories
	// Fetch all categories
	const fetchCategories = async () => {
		try {
			const response = await CategoryService.getCategories();
			if (Array.isArray(response.data)) {
				setCategories(response.data); // Extract data from response
			} else {
				console.error("Unexpected data format:", response);
			}
		} catch (error) {
			console.error("Error fetching categories:", error);
		}
	};

	// Add a new category
	const handleAddCategory = async () => {
		if (newCategory.name.trim()) {
			try {
				await CategoryService.createCategory(newCategory);
				alert("Category added successfully!");
				setNewCategory({ name: "" });
				fetchCategories(); // Refresh list
			} catch (error) {
				console.error("Error adding category:", error);
			}
		} else {
			alert("Category name cannot be empty.");
		}
	};

	// Edit an existing category
	const handleEditCategory = (category) => {
		setEditMode(true);
		setCurrentCategoryId(category.id);
		setNewCategory({ name: category.name });
	};

	// Update the category
	const handleUpdateCategory = async () => {
		if (currentCategoryId && newCategory.name.trim()) {
			try {
				await CategoryService.updateCategory(currentCategoryId, newCategory);
				alert("Category updated successfully!");
				setEditMode(false);
				setNewCategory({ name: "" });
				setCurrentCategoryId(null);
				fetchCategories(); // Refresh list
			} catch (error) {
				console.error("Error updating category:", error);
			}
		} else {
			alert("Category name cannot be empty.");
		}
	};

	// Delete a category
const handleDeleteCategory = async (id) => {
	if (window.confirm("Are you sure you want to delete this category?")) {
		try {
			await CategoryService.deleteCategory(id);
			alert("Category deleted successfully!");
			fetchCategories(); // Refresh the list of categories
		} catch (error) {
			console.error("Error deleting category:", error);
			alert("Failed to delete category. Please try again.");
		}
	}
};


	return (
		<div className={styles.categoryContainer}>
			<h2>Category Management</h2>

			{/* Add/Edit Category Form */}
			<div className={styles.categoryForm}>
				<input
					type="text"
					value={newCategory.name}
					onChange={(e) =>
						setNewCategory({ ...newCategory, name: e.target.value })
					}
					placeholder="Enter category name"
				/>
				<button onClick={editMode ? handleUpdateCategory : handleAddCategory}>
					{editMode ? "Update Category" : "Add Category"}
				</button>
			</div>

			{/* Category List */}
			{categories.length > 0 ? (
				<ul className={styles.categoryList}>
					{categories.map((category) => (
						<li key={category.id}>
							<span className={styles.categoryInfo}>{category.name}</span>
							<div className={styles.actions}>
								<button
									className={styles.editButton}
									onClick={() => handleEditCategory(category)}>
									Edit
								</button>
								<button
									className={styles.deleteButton}
									onClick={() => handleDeleteCategory(category.id)}>
									Delete
								</button>
							</div>
						</li>
					))}
				</ul>
			) : (
				<p>No categories available. Please add a category.</p>
			)}
		</div>
	);
};

export default CategoryComponent;
