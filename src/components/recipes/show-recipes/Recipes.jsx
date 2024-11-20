import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../interceptor/Interceptor"; // Import the apiClient
import styles from "./Recipes.module.css"; // Import CSS Module
import AuthContext from "../../../services/JWTTokenService/AuthContext"; // Import AuthContext to access user roles
import JWTTokenService from "../../../services/JWTTokenService/JWTTokenService"; // Import JWTTokenService to check token validity

const Recipes = () => {
	const [recipeList, setRecipeList] = useState([]);
	const [loading, setLoading] = useState(true); // Loading state for fetching recipes
	const [error, setError] = useState(null); // Error state for error handling
	const { userRoles } = useContext(AuthContext); // Get the user's roles from context
	const navigate = useNavigate();

	useEffect(() => {
		// Check if the token is valid before fetching data
		if (JWTTokenService.isTokenExpired()) {
			JWTTokenService.removeToken();
			navigate("/login");
			return;
		}
		fetchRecipes();
	}, [navigate]);

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
			setError("Error fetching recipes. Please try again later.");
			console.error("Error fetching recipes:", error);
		} finally {
			setLoading(false);
		}
	};

	// Navigate to the recipe details page
	const goToRecipe = (recipe) => {
		if (recipe && recipe.id) {
			const path = userRoles.includes("ROLE_ADMIN")
				? `/admin/recipe/${recipe.id}` // Admin path
				: `/recipe/${recipe.id}`; // User path
			navigate(path);
		} else {
			console.error("Invalid recipe or ID");
		}
	};

	// Delete recipe
	const deleteRecipe = async (id) => {
		if (id && userRoles.includes("ROLE_ADMIN")) {
			// Only allow delete for admin
			try {
				await apiClient.delete(`/recette/delete/${id}`); // Use the custom axiosClient
				alert("Recipe deleted successfully!");
				setRecipeList((prevList) =>
					prevList.filter((recipe) => recipe.id !== id)
				);
			} catch (error) {
				setError("Error deleting recipe. Please try again later.");
				console.error("Error deleting recipe:", error);
			}
		} else {
			alert("You do not have permission to delete this recipe.");
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.recipeList}>
				{/* Add Recipe Button (only for admins) */}
				{userRoles.includes("ROLE_ADMIN") && (
					<div className={styles.recipeActions}>
						<a
							href={
								userRoles.includes("ROLE_ADMIN")
									? "/admin/recipe/add"
									: "/recipe/add"
							} // Conditional href based on user role
							className={`${styles.btnAdd} ${styles.btnPrimaryAdd}`}>
							Add Recipe
						</a>
					</div>
				)}
				<br />
				<hr />
				{/* Error Handling */}
				{error && <div className={styles.error}>{error}</div>}

				{/* Loading state */}
				{loading ? (
					<div>Loading recipes...</div>
				) : // Conditional rendering for recipe list
				recipeList.length > 0 ? (
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
									{userRoles.includes("ROLE_ADMIN") && (
										<button
											onClick={() => deleteRecipe(recipe.id)}
											className={`${styles.btn} ${styles.btnDelete}`}>
											Delete
										</button>
									)}
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
