import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/navbar/Navbar";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Recipes from "./components/recipes/show-recipes/Recipes";
import ProtectedRoute from "./components/protected-routes/ProtectedRoute";
import DetailsRecipe from "./components/recipes/details-recipe/DetailsRecipe";
import RecipeEdit from "./components/recipes/edit-recipe/EditRecipe";
import AddRecipe from "./components/recipes/add-recipe/AddRecipe";


function App() {
	return (
		
			<Router>
				<Navbar />
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />

					{/* Protected route for viewing and editing recipes */}
					<Route
						path="/recipes"
						element={
							<ProtectedRoute requiredRole="ROLE_USER">
								<Recipes />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/recipe/add"
						element={
							<ProtectedRoute requiredRole="ROLE_USER">
								<AddRecipe />
							</ProtectedRoute>
						}
					/>

					{/* Protected route for viewing a specific recipe's details */}
					<Route
						path="/recipe/:id"
						element={
							<ProtectedRoute requiredRole="ROLE_USER">
								<DetailsRecipe />
							</ProtectedRoute>
						}
					/>

					{/* Protected route for editing a recipe */}
					<Route
						path="/recipe/edit/:id"
						element={
							<ProtectedRoute requiredRole="ROLE_USER">
								<RecipeEdit />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</Router>
		
	);
}

export default App;
