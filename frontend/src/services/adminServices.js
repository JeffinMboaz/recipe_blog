import { axiosInstance } from "../axios/axiosInstance";

export const admAddRecipe = (data) => {
  return axiosInstance.post("/admin/addrecipe", data, {
    withCredentials: true,
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const admAllRecipe = () => {
  return axiosInstance.get("/admin/allrecipes", {
    withCredentials: true,
  });
};

export const admDeleteRecipe = (recipeId) => {
  return axiosInstance.delete(`/admin/deleterecipe/${recipeId}`, {
    withCredentials: true,
  });
};

export const admAllReview = () => {
  return axiosInstance.get("/admin/allreviews", { withCredentials: true });
};

/**
 * Delete a review (admin only)
 */
export const admDeleteReview = (reviewId) => {
  return axiosInstance.delete(`/admin/deletereview/${reviewId}`, {
    withCredentials: true,
  });
};

export const admAllUsers = () => {
  return axiosInstance.get("/admin/allusers", { withCredentials: true });
};

/** ✅ Delete user (admin only) */
export const admDeleteUser = (id) => {
  return axiosInstance.delete(`/admin/deleteuser/${id}`, { withCredentials: true });
};

export const admAllStats = () => {
  return axiosInstance.get("/admin/stats", { withCredentials: true });
};

// ✅ FIX: Add this function
export const admUpdateRecipe = (recipeId, data) => {
  return axiosInstance.put(`/admin/updaterecipe/${recipeId}`, data, {
    withCredentials: true,
    headers: { "Content-Type": "multipart/form-data" },
  });
};
