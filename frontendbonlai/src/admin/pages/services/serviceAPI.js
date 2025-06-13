import axios from "../../../utils/axios";

// Fetch all services
export const fetchServices = async () => {
  const response = await axios.get("/api/products");
  return response; // axios interceptor already returns response.data
};

// Get service by ID
export const getServiceById = async (id) => {
  const response = await axios.get(`/api/products/${id}`);
  return response; // axios interceptor already returns response.data
};

// Search services by keyword
export const searchServices = async (keyword) => {
  const response = await axios.get(`/api/products/search?keyword=${keyword}`);
  return response; // axios interceptor already returns response.data
};

// Filter services by category
export const getServicesByCategory = async (categoryId) => {
  const response = await axios.get(`/api/products/category/${categoryId}`);
  return response; // axios interceptor already returns response.data
};

// Filter services by tag
export const getServicesByTag = async (tagId) => {
  const response = await axios.get(`/api/products/tag/${tagId}`);
  return response; // axios interceptor already returns response.data
};

// Create new service
export const createService = async (serviceData) => {
  const response = await axios.post("/api/products", serviceData);
  return response; // axios interceptor already returns response.data
};

// Update service
export const updateService = async (id, serviceData) => {
  const response = await axios.put(`/api/products/${id}`, serviceData);
  return response; // axios interceptor already returns response.data
};

// Delete service
export const deleteService = async (id) => {
  const response = await axios.delete(`/api/products/${id}`);
  return response; // axios interceptor already returns response.data
};

// Upload service images
export const uploadServiceImages = async (id, formData) => {
  const response = await axios.post(`/api/products/${id}/images`, formData);
  return response; // axios interceptor already returns response.data
};

// Delete service image
export const deleteServiceImage = async (serviceId, imageId) => {
  const response = await axios.delete(
    `/api/products/${serviceId}/images/${imageId}`
  );
  return response; // axios interceptor already returns response.data
};

// Update service status
export const updateServiceStatus = async (id, isActive) => {
  const response = await axios.put(`/api/products/${id}/status`, { isActive });
  return response; // axios interceptor already returns response.data
};
