import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../../interceptor/Interceptor"; // Import the custom Axios instance with the interceptor
import CategoryService from "../../../services/category/CategoryService"; 
import styles from "./DetailsRecipe.module.css"; // Import the CSS module

const DetailsRecipe = () => {
	const { id } = useParams(); // Get the recipe ID from the URL
	const [recipe, setRecipe] = useState(null);
	const [category, setCategory] = useState(null); // State for category
	const navigate = useNavigate();

	// Fetch recipe and category details
	useEffect(() => {
		if (id) {
			fetchRecipeDetails(id);
		}
	}, [id]);

	const fetchRecipeDetails = async (id) => {
		try {
			const response = await apiClient.get(`/recette/${id}`); // Use the custom axiosClient
			const res = response.data;

			// Convert date fields if they exist
			if (res.createdAt && res.createdAt.date) {
				res.createdAt = new Date(res.createdAt.date);
			}
			if (res.updatedAt && res.updatedAt.date) {
				res.updatedAt = new Date(res.updatedAt.date);
			}

			// Update the thumbnailFile to prepend the correct base URL
			if (res.thumbnailFile) {
				res.thumbnailFile = `http://localhost:8000/${res.thumbnailFile}`;
			}

			// Set the fetched recipe data
			setRecipe(res);

			// Fetch the category if recipe has a category ID
			if (res.category) {
				fetchCategoryDetails(res.category);
			}
		} catch (error) {
			console.error("Error fetching recipe details:", error);
		}
	};

	// Fetch category details
	const fetchCategoryDetails = async (categoryId) => {
		try {
			const response = await CategoryService.getCategory(categoryId);
			setCategory(response.data);
		} catch (error) {
			console.error("Error fetching category details:", error);
		}
	};

	const onEdit = (recipeId) => {
		navigate(`/recipe/edit/${recipeId}`);
	};

	const deleteRecipe = async () => {
		if (id) {
			try {
				await apiClient.delete(`/recette/delete/${id}`); // Use the custom axiosClient
				alert("Recipe deleted successfully!");
				navigate("/recipes");
			} catch (error) {
				console.error("Error deleting recipe:", error);
			}
		}
	};

	if (!recipe) return <div>Loading...</div>;

	return (
		<div className={styles.recipeDetail}>
			<h1>{recipe.title}</h1>
			<img
				src={
					recipe.thumbnailFile
						? recipe.thumbnailFile
						: "/assets/default-thumbnail.jpg"
				}
				alt={recipe.title}
				className={styles.recipeImage}
			/>
			<p>{recipe.content}</p>

			<div className={styles.recipeMeta}>
				<span>
					<strong>Duration:</strong> {recipe.duration} mins
				</span>
				<span>
					<strong>Created At:</strong>{" "}
					{new Date(recipe.createdAt).toLocaleDateString()}
				</span>
				<span>
					<strong>Updated At:</strong>{" "}
					{new Date(recipe.updatedAt).toLocaleDateString()}
				</span>
				<span>
					<strong>Category:</strong> {category ? category.name : "Loading..."}
				</span>
			</div>

			<div className={styles.recipeActions}>
				<button
					onClick={() => onEdit(recipe.id)}
					className={`${styles.btn} ${styles.btnEdit}`}>
					Edit
				</button>
				<button
					onClick={deleteRecipe}
					className={`${styles.btn} ${styles.btnDelete}`}>
					Delete
				</button>
			</div>
		</div>
	);
};

export default DetailsRecipe;
