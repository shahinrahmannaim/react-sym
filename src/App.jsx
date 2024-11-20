// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./services/JWTTokenService/AuthContext"; // Import AuthProvider here
import Navbar from "./components/navbar/Navbar";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Recipes from "./components/recipes/show-recipes/Recipes";
import ProtectedRoute from "./components/protected-routes/ProtectedRoute";
import DetailsRecipe from "./components/recipes/details-recipe/DetailsRecipe";
import RecipeEdit from "./components/recipes/edit-recipe/EditRecipe";
import AddRecipe from "./components/recipes/add-recipe/AddRecipe";
import AdminDashboard from "./components/admin/admin-dashboard/AdminDashboard";
import AllUsers from "./components/admin/users/all-users/AllUsers";
import Categories from "./components/admin/category/Category";
import Department from "./components/admin/department/Department";
import ForbiddenComponent from "./components/forbidden/Forbidden"; // Import Forbidden Component

import "./App.css";

function App() {
	return (
		<AuthProvider>
			<Router>
				<Navbar />
				<Routes>
					{/* Public Routes */}
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />

					{/* User Routes */}
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
					<Route
						path="/recipe/:id"
						element={
							<ProtectedRoute requiredRole="ROLE_USER">
								<DetailsRecipe />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/recipe/edit/:id"
						element={
							<ProtectedRoute requiredRole="ROLE_USER">
								<RecipeEdit />
							</ProtectedRoute>
						}
					/>

					{/* Admin Routes */}
					<Route
						path="/admin/*"
						element={
							<ProtectedRoute requiredRole="ROLE_ADMIN">
								<AdminDashboard />
							</ProtectedRoute>
						}>
						{/* Admin nested routes */}
						<Route path="users" element={<AllUsers />} />
						<Route
							path="users/add"
							element={
								<ProtectedRoute requiredRole="ROLE_ADMIN">
									<AllUsers /> {/* Component to add users */}
								</ProtectedRoute>
							}
						/>
						<Route path="recipes" element={<Recipes />} />
						<Route path="recipe/edit/:id" element={<RecipeEdit />} />
						<Route path="recipe/:id" element={<DetailsRecipe />} />
						<Route path="recipe/add" element={<AddRecipe />} />
						<Route path="categories" element={<Categories />} />
						<Route path="department" element={<Department />} />
					</Route>

					{/* 404 / Forbidden Route */}
					<Route path="*" element={<ForbiddenComponent />} />
				</Routes>
			</Router>
		</AuthProvider>
	);
}

export default App;
