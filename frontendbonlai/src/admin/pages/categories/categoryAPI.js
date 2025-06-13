import axios from "../../../utils/axios";

export const categoryAPI = {
  // Get all categories
  getAllCategories: async () => {
    const response = await axios.get("/api/categories");
    return response; // axios interceptor already returns response.data
  },

  // Search categories by keyword
  searchCategories: async (keyword) => {
    const response = await axios.get(
      `/api/categories/search?keyword=${encodeURIComponent(keyword)}`
    );
    return response; // axios interceptor already returns response.data
  },

  // Get category by ID
  getCategoryById: async (id) => {
    const response = await axios.get(`/api/categories/${id}`);
    return response; // axios interceptor already returns response.data
  },

  // Create a new category
  createCategory: async (categoryData) => {
    const response = await axios.post("/api/categories", categoryData);
    return response; // axios interceptor already returns response.data
  },

  // Update a category
  updateCategory: async (id, categoryData) => {
    const response = await axios.put(`/api/categories/${id}`, categoryData);
    return response; // axios interceptor already returns response.data
  },

  // Delete a category
  deleteCategory: async (id) => {
    const response = await axios.delete(`/api/categories/${id}`);
    return response; // axios interceptor already returns response.data
  },

  // Get child categories
  getChildCategories: async (parentId) => {
    const response = await axios.get(`/api/categories/${parentId}/children`);
    return response; // axios interceptor already returns response.data
  },

  // Get products in a category
  getCategoryProducts: async (categoryId) => {
    const response = await axios.get(`/api/categories/${categoryId}/products`);
    return response; // axios interceptor already returns response.data
  },
};

export default categoryAPI;
