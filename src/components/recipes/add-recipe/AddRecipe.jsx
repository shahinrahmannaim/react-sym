import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../interceptor/Interceptor";
import CategoryService from "../../../services/category/CategoryService"; // Import CategoryService
import styles from "./AddRecipe.module.css";

const AddRecipe = () => {
	const [recipe, setRecipe] = useState({
		title: "",
		content: "",
		duration: "",
		thumbnailFile: null,
		categoryId: "", // Add categoryId for selection
	});
	const [categories, setCategories] = useState([]); // Store categories for dropdown
	const navigate = useNavigate();

	// Fetch categories for selection
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await CategoryService.getCategories(); // Fetch categories using service
				setCategories(response.data);
			} catch (error) {
				console.error("Error fetching categories:", error);
			}
		};
		fetchCategories();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setRecipe((prevRecipe) => ({
			...prevRecipe,
			[name]: value,
		}));
	};

	const handleFileChange = (e) => {
		const { name, files } = e.target;
		if (files && files[0]) {
			setRecipe((prevRecipe) => ({
				...prevRecipe,
				[name]: files[0],
			}));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("title", recipe.title);
		formData.append("content", recipe.content);
		formData.append("duration", recipe.duration);
		formData.append("categoryId", recipe.categoryId); // Correct field name

		if (recipe.thumbnailFile) {
			formData.append("thumbnailFile", recipe.thumbnailFile);
		}

		try {
			await apiClient.post("/recette/create", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			alert("Recipe added successfully");
			navigate("/recipes");
		} catch (error) {
			console.error("Error adding recipe:", error);
			alert("An error occurred while adding the recipe.");
		}
	};

	return (
		<div className={styles.recipeAdd}>
			<h1>Add Recipe</h1>
			<form onSubmit={handleSubmit}>
				<div className={styles.formGroup}>
					<label htmlFor="title">Title</label>
					<input
						type="text"
						id="title"
						name="title"
						value={recipe.title}
						onChange={handleChange}
						required
					/>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor="content">Content</label>
					<textarea
						id="content"
						name="content"
						value={recipe.content}
						onChange={handleChange}
						required></textarea>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor="duration">Duration (in minutes)</label>
					<input
						type="number"
						id="duration"
						name="duration"
						value={recipe.duration}
						onChange={handleChange}
						required
					/>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor="categoryId">Category</label>

					<select
						id="categoryId"
						name="categoryId"
						value={recipe.categoryId}
						onChange={handleChange}
						required>
						<option value="" disabled>
							Select a category
						</option>
						{categories.map((category) => (
							<option key={category.id} value="{category.id}">
								{category.name}
							</option>
						))}
					</select>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor="thumbnailFile">Thumbnail</label>
					<input
						type="file"
						id="thumbnailFile"
						name="thumbnailFile"
						onChange={handleFileChange}
					/>
					{recipe.thumbnailFile && typeof recipe.thumbnailFile === "string" ? (
						<img
							src={`http://localhost:8000/${recipe.thumbnailFile}`}
							alt="Preview"
							className={styles.thumbnailPreview}
						/>
					) : recipe.thumbnailFile && recipe.thumbnailFile instanceof File ? (
						<img
							src={URL.createObjectURL(recipe.thumbnailFile)}
							alt="Preview"
							className={styles.thumbnailPreview}
						/>
					) : null}
				</div>

				<button type="submit" className={styles.button}>
					Add Recipe
				</button>
			</form>
		</div>
	);
};

export default AddRecipe;
