import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../../interceptor/Interceptor";
import CategoryService from "../../../services/category/CategoryService"; // Import CategoryService
import styles from "./EditRecipe.module.css";

const EditRecipe = () => {
	const { id } = useParams();
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

	// Fetch recipe details for editing
	useEffect(() => {
		if (id) {
			fetchRecipeDetails(id);
		}
	}, [id]);

	const fetchRecipeDetails = async (id) => {
		try {
			const response = await apiClient.get(`/recette/${id}`);
			const res = response.data;
			setRecipe({
				title: res.title,
				content: res.content,
				duration: res.duration,
				thumbnailFile: res.thumbnailFile || "",
				categoryId: res.categoryId, // Preset categoryId for edit
			});
		} catch (error) {
			console.error("Error fetching recipe details:", error);
		}
	};

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
			await apiClient.post(`/recette/edit/${id}`, formData, {
				// Changed to PUT
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			alert("Recipe updated successfully");
			navigate("/recipes");
		} catch (error) {
			console.error("Error updating recipe:", error);
			alert("An error occurred while updating the recipe.");
		}
	};

	return (
		<div className={styles.recipeEdit}>
			<h1>Edit Recipe</h1>
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
						{categories.map((category) => (
							<option key={category.id} value={category.id}>
								{category ? category.name : "Loading..."}
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

				<button type="submit" className={styles.btnSubmit}>
					Update Recipe
				</button>
			</form>
		</div>
	);
};

export default EditRecipe;
