
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import UserLayout from '../layout/UserLayout';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import RecipesPage from '../pages/RecipesPage';
import LoginPage from '../pages/LoginPage';
import UserDashboard from '../pages/user/UserDashboard';
import AdminDashboard from '../pages/admin/AdminDashborad';
import RecipeDetailPage from '../pages/user/RecipeDetailPage';
import UserProfile from '../pages/user/UserProfile';
import SignUpPage from '../pages/SignUpPage';
import AddRecipe from '../pages/admin/AddRecipe';
import UpdateRecipe from '../pages/admin/UpdateRecipe';
import DeleteRecipe from '../pages/admin/DeleteRecipe';
import DeleteReview from '../pages/admin/DeleteReview';
import DeleteUser from '../pages/admin/DeleteUser';
import AdminLayout from '../layout/AdminLayout';
export const router = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />,
    errorElement: <h1>Error Page</h1>,
    children: [
      { path: "", element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "searchrecipe", element: <RecipesPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignUpPage /> },
      { path: "userdashboard", element: <UserDashboard /> },
      { path: "recipe/:id", element: <RecipeDetailPage /> },
      { path: "userprofile", element: <UserProfile /> },

    ],
  },

  // ✅ Nested routes under /admindashboard
  {
    path: "/admindashboard",
    element: <AdminLayout />,
    errorElement: <h1>Admin Error Page</h1>,
    children: [
      {path: "", element: <AdminDashboard /> },
      { path: "add", element: <AddRecipe /> },
      { path: "update", element: <UpdateRecipe /> },
      { path: "delete", element: <DeleteRecipe /> },
      { path: "reviews", element: <DeleteReview /> },
      { path: "users", element: <DeleteUser /> },
    ],
  },
]);
