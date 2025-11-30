import { axiosInstance } from "../axios/axiosInstance";

export const getAllReviews=()=>{
    return axiosInstance.get('/review/allreviews')
}

export const universalLogin = async (formData) => {
  return axiosInstance.post('/auth/login', formData);
};

export const logout = async () => {
  return axiosInstance.post('/auth/logout');
};

export const checkSession = async () => {
  return axiosInstance.get('/auth/check');
};

export const newUser =async (formData) => {
    return axiosInstance.post('/user/register',formData)
    
}

export const getAllRecipes =()=>{
  return axiosInstance.get("/recipe/getallrecipe");

}

export const searchRecipe = (query) => {
  return axiosInstance.get(`/recipe/search?search=${query}`);
};

export const getOneRecipe = (id) => axiosInstance.get(`/recipe/getonerecipe/${id}`);

export const getReview = (id) => axiosInstance.get(`/review/getreview/${id}`);

export const addReview = (id, data, config) =>
  axiosInstance.post(`/review/addreview/${id}`, data, config);

export const upreview = (reviewId, data, config) =>
  axiosInstance.put(`/review/updatereview/${reviewId}`, data, config);

export const myRecipe =()=>{

  return axiosInstance.get('/recipe/myrecipes')
}

export const deleteMyRecipe = (id)=>{
return axiosInstance.delete(`/recipe/deleterecipe/${id}`)
}

export const myProfile = ()=>{
  return axiosInstance.get('/user/profile')
}

export const myReview = ()=>{
  return axiosInstance.get('/review/myreviews')
}
export const deleteReview=(id)=>{
  return axiosInstance.delete(`/review/deletereview/${id}`)
}

export const updateMyProfile= (userId, formData)=>{
  return axiosInstance.put(`/user/update/${userId}`,formData)
}

export const deleteUser=(userId)=>{
  return axiosInstance.delete(`/user/delete/${userId}`)
}

export const editReview = (reviewId, data) => {
  return axiosInstance.put(`/review/updatereview/${reviewId}`, data)
};

export const createRecipe = (formData) => {
  return axiosInstance.post(`/recipe/createrecipe`, formData);
};

export const updateRecipe = (editRecipeId, formData) => {
  return axiosInstance.put(`/recipe/updaterecipe/${editRecipeId}`, formData);
};