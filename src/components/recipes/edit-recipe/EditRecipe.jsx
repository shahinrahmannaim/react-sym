import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../../interceptor/Interceptor"; // Import the custom Axios instance with the interceptor
import styles from "./EditRecipe.module.css"; // Import the CSS module

const EditRecipe = () => {
	const { id } = useParams(); // Get the recipe ID from the URL
	const [recipe, setRecipe] = useState({
		title: "",
		content: "",
		duration: "",
		thumbnailFile: "",
	});
	const navigate = useNavigate();

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

			// Set the fetched recipe data
			setRecipe({
				title: res.title,
				content: res.content,
				duration: res.duration,
				thumbnailFile: res.thumbnailFile || "",
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
		if (recipe.thumbnailFile) {
			formData.append("thumbnailFile", recipe.thumbnailFile);
		}

		try {
			await apiClient.put(`/recette/edit/${id}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data", // Set the content type for file uploads
				},
			});
			alert("Recipe updated successfully!");
			navigate(`/recipe/${id}`); // Redirect to the recipe details page
		} catch (error) {
			console.error("Error updating recipe:", error);
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
					<label htmlFor="thumbnailFile">Thumbnail</label>
					<input
						type="file"
						id="thumbnailFile"
						name="thumbnailFile"
						onChange={handleFileChange}
					/>
					{recipe.thumbnailFile && (
						<img
							src={URL.createObjectURL(recipe.thumbnailFile)}
							alt="Preview"
							className={styles.thumbnailPreview}
						/>
					)}
				</div>

				<button type="submit" className={styles.btnSubmit}>
					Update Recipe
				</button>
			</form>
		</div>
	);
};

export default EditRecipe;
