import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/navbar/Navbar";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Recipes from "./components/recipes/show-recipes/Recipes";
import ProtectedRoute from "./components/protected-routes/ProtectedRoute";
import DetailsRecipe from "./components/recipes/details-recipe/DetailsRecipe";
import RecipeEdit from "./components/recipes/edit-recipe/EditRecipe";

function App() {
	return (
		<Router>
			<Navbar />
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />

				{/* Protected routes for anything related to recipes */}
				<Route
					path="/recipes"
					element={
						<ProtectedRoute requiredRole="ROLE_USER">
							<Routes>
								<Route path="/" element={<Recipes />} />
								<Route path="/recipe/:id" element={<DetailsRecipe />} />
								<Route path="/recipe/edit/:id" element={<RecipeEdit />} />
							</Routes>
						</ProtectedRoute>
					}
				/>
			</Routes>
		</Router>
	);
}

export default App;
