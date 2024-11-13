import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../interceptor/Interceptor"; // Import the apiClient
import styles from "./Recipes.module.css"; // Import CSS Module

const Recipes = () => {
	const [recipeList, setRecipeList] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		fetchRecipes();
	}, []);

	// Fetch recipes using the apiClient
	const fetchRecipes = async () => {
		try {
			const response = await apiClient.get("/recette"); // Use the apiClient for the request
			const recipes = Array.isArray(response.data)
				? response.data.map((recipe) => ({
						...recipe,
						thumbnailFile: recipe.thumbnailFile
							? `http://localhost:8000/${recipe.thumbnailFile}`
							: null,
				  }))
				: [];
			setRecipeList(recipes);
		} catch (error) {
			console.error("Error fetching recipes:", error);
			setRecipeList([]); // Optionally handle the error by setting an empty array or showing an error message
		}
	};

	// Navigate to the recipe details page
	const goToRecipe = (recipe) => {
		if (recipe && recipe.id) {
			navigate(`/recipe/${recipe.id}`);
		} else {
			console.error("Invalid recipe or ID");
		}
	};
    const deleteRecipe = async (id) => {
			if (id) {
				try {
					await apiClient.delete(`/recette/delete/${id}`); // Use the custom axiosClient
					alert("Recipe deleted successfully!");
                    setRecipeList((prevList) =>
											prevList.filter((recipe) => recipe.id !== id)
										);
					navigate("/recipes");
				} catch (error) {
					console.error("Error deleting recipe:", error);
				}
			}
		};

	return (
		<div className={styles.container}>
			<div className={styles.recipeList}>
				{/* Add Recipe Button */}
				<div className={styles.recipeActions}>
					<a
						href="/recipe/add"
						className={`${styles.btnAdd} ${styles.btnPrimaryAdd}`}>
						Add Recipe
					</a>
				</div>
				<br />
				<hr />
				{/* Conditional rendering for recipe list */}
				{recipeList.length > 0 ? (
					recipeList.map((recipe) => (
						<div key={recipe.id} className={styles.recipeCard}>
							<div className={styles.recipeThumbnail}>
								<img
									src={
										recipe.thumbnailFile
											? recipe.thumbnailFile
											: "/path/to/default/image.jpg"
									}
									alt={recipe.title}
									className={styles.recipeImage}
								/>
							</div>
							<div className={styles.recipeContent}>
								<h2
									onClick={() => goToRecipe(recipe)}
									className={styles.recipeTitle}>
									{recipe.title}
								</h2>
								<p>{recipe.description}</p>
								<div className={styles.recipeMeta}>
									<span>Duration: {recipe.duration}</span>
								</div>
								<div className={styles.recipeActions}>
									<button
										className={`${styles.btn} ${styles.btnEdit}`}
										onClick={() => goToRecipe(recipe)}>
										View
									</button>
									<button onClick={()=>deleteRecipe(recipe.id)} className={`${styles.btn} ${styles.btnDelete}`}>
										Delete
									</button>
								</div>
							</div>
						</div>
					))
				) : (
					<div>No recipes available.</div>
				)}
			</div>
		</div>
	);
};

export default Recipes;
