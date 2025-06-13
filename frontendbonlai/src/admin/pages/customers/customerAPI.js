import axios from "../../../utils/axios";

const API_BASE_URL = "/api/customers";

// Get all customers
export const getCustomers = async () => {
  try {
    console.log("Calling getCustomers API...");
    const response = await axios.get(API_BASE_URL);
    console.log("getCustomers response:", response);
    console.log("getCustomers response type:", typeof response);
    console.log("getCustomers is array:", Array.isArray(response));

    // Vì axios interceptor đã return response.data, nên response chính là data
    // Kiểm tra các trường hợp có thể xảy ra:
    if (Array.isArray(response)) {
      // Backend trả về array trực tiếp
      console.log("Response is array, returning directly");
      return response;
    } else if (response && Array.isArray(response.data)) {
      // Backend trả về object wrapper với data là array
      console.log("Response has data array, returning response.data");
      return response.data;
    } else if (response && Array.isArray(response.content)) {
      // Spring Boot pagination với content array
      console.log("Response has content array, returning response.content");
      return response.content;
    } else if (
      response &&
      response.data &&
      Array.isArray(response.data.content)
    ) {
      // Nested pagination structure
      console.log(
        "Response has nested content array, returning response.data.content"
      );
      return response.data.content;
    } else {
      // Fallback - return as is or empty array
      console.log(
        "Unknown response structure, returning response or empty array"
      );
      return response || [];
    }
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};

// Get recent customers (last 30 days)
export const getRecentCustomers = async () => {
  try {
    console.log("Calling getRecentCustomers API...");
    const response = await axios.get(`${API_BASE_URL}/recent`);
    console.log("getRecentCustomers response:", response);
    console.log("getRecentCustomers response type:", typeof response);
    console.log("getRecentCustomers is array:", Array.isArray(response));

    // Handle different response structures like getCustomers
    if (Array.isArray(response)) {
      console.log("Response is array, returning directly");
      return response;
    } else if (response && Array.isArray(response.data)) {
      console.log("Response has data array, returning response.data");
      return response.data;
    } else if (response && Array.isArray(response.content)) {
      console.log("Response has content array, returning response.content");
      return response.content;
    } else if (
      response &&
      response.data &&
      Array.isArray(response.data.content)
    ) {
      console.log(
        "Response has nested content array, returning response.data.content"
      );
      return response.data.content;
    } else {
      console.log(
        "Unknown response structure, returning response or empty array"
      );
      return response || [];
    }
  } catch (error) {
    console.error("Error fetching recent customers:", error);
    // Return empty array as fallback instead of throwing error
    return [];
  }
};

// Get customer by ID
export const getCustomerById = async (id) => {
  try {
    console.log("Calling getCustomerById API for id:", id);
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    console.log("getCustomerById response:", response);

    return response;
  } catch (error) {
    console.error("Error fetching customer:", error);
    throw error;
  }
};

// Create new customer
export const createCustomer = async (customerData) => {
  try {
    console.log("Calling createCustomer API with data:", customerData);
    const response = await axios.post(API_BASE_URL, customerData);
    console.log("createCustomer response:", response);

    return response;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};

// Update customer
export const updateCustomer = async (id, customerData) => {
  try {
    console.log(
      "Calling updateCustomer API for id:",
      id,
      "with data:",
      customerData
    );
    const response = await axios.put(`${API_BASE_URL}/${id}`, customerData);
    console.log("updateCustomer response:", response);

    return response;
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
};

// Delete customer
export const deleteCustomer = async (id) => {
  try {
    console.log("Calling deleteCustomer API for id:", id);
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    console.log("deleteCustomer response:", response);

    return response;
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
};

// Search customers
export const searchCustomers = async (keyword) => {
  try {
    console.log("Calling searchCustomers API with keyword:", keyword);
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: { keyword },
    });
    console.log("searchCustomers response:", response);
    console.log("searchCustomers response type:", typeof response);
    console.log("searchCustomers is array:", Array.isArray(response));

    // Xử lý response tương tự như getCustomers
    if (Array.isArray(response)) {
      return response;
    } else if (response && Array.isArray(response.data)) {
      return response.data;
    } else if (response && Array.isArray(response.content)) {
      return response.content;
    } else if (
      response &&
      response.data &&
      Array.isArray(response.data.content)
    ) {
      return response.data.content;
    } else {
      return response || [];
    }
  } catch (error) {
    console.error("Error searching customers:", error);
    throw error;
  }
};

// Update customer status
export const updateCustomerStatus = async (id, isActive) => {
  try {
    console.log(
      "Calling updateCustomerStatus API for id:",
      id,
      "isActive:",
      isActive
    );
    const response = await axios.put(`${API_BASE_URL}/${id}/status`, null, {
      params: { isActive },
    });
    console.log("updateCustomerStatus response:", response);

    return response;
  } catch (error) {
    console.error("Error updating customer status:", error);
    throw error;
  }
};

// Add address
export const addCustomerAddress = async (customerId, addressData) => {
  try {
    console.log(
      "Calling addCustomerAddress API for customerId:",
      customerId,
      "with data:",
      addressData
    );
    const response = await axios.post(
      `${API_BASE_URL}/${customerId}/addresses`,
      addressData
    );
    console.log("addCustomerAddress response:", response);

    return response;
  } catch (error) {
    console.error("Error adding customer address:", error);
    throw error;
  }
};

// Update address
export const updateCustomerAddress = async (
  customerId,
  addressId,
  addressData
) => {
  try {
    console.log(
      "Calling updateCustomerAddress API for customerId:",
      customerId,
      "addressId:",
      addressId,
      "with data:",
      addressData
    );
    const response = await axios.put(
      `${API_BASE_URL}/${customerId}/addresses/${addressId}`,
      addressData
    );
    console.log("updateCustomerAddress response:", response);

    return response;
  } catch (error) {
    console.error("Error updating customer address:", error);
    throw error;
  }
};

// Delete address
export const deleteCustomerAddress = async (customerId, addressId) => {
  try {
    console.log(
      "Calling deleteCustomerAddress API for customerId:",
      customerId,
      "addressId:",
      addressId
    );
    const response = await axios.delete(
      `${API_BASE_URL}/${customerId}/addresses/${addressId}`
    );
    console.log("deleteCustomerAddress response:", response);

    return response;
  } catch (error) {
    console.error("Error deleting customer address:", error);
    throw error;
  }
};

// Set default address
export const setDefaultAddress = async (customerId, addressId) => {
  try {
    console.log(
      "Calling setDefaultAddress API for customerId:",
      customerId,
      "addressId:",
      addressId
    );
    const response = await axios.put(
      `${API_BASE_URL}/${customerId}/addresses/${addressId}/default`
    );
    console.log("setDefaultAddress response:", response);

    return response;
  } catch (error) {
    console.error("Error setting default address:", error);
    throw error;
  }
};
