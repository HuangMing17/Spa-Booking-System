import axios from '../../../utils/axios';

// API service cho quản lý mã giảm giá
export const couponAPI = {
  // Lấy danh sách tất cả mã giảm giá
  getAllCoupons: async () => {
    try {
      const response = await axios.get('/api/coupons');
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Error fetching coupons:', error);
      return [];
    }
  },

  // Lấy chi tiết mã giảm giá theo ID
  getCouponById: async (id) => {
    try {
      const response = await axios.get(`/api/coupons/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching coupon by ID:', error);
      throw error;
    }
  },

  // Tạo mã giảm giá mới
  createCoupon: async (couponData) => {
    try {
      const response = await axios.post('/api/coupons', couponData);
      return response;
    } catch (error) {
      console.error('Error creating coupon:', error);
      throw error;
    }
  },

  // Cập nhật mã giảm giá
  updateCoupon: async (id, couponData) => {
    try {
      const response = await axios.put(`/api/coupons/${id}`, couponData);
      return response;
    } catch (error) {
      console.error('Error updating coupon:', error);
      throw error;
    }
  },

  // Xóa mã giảm giá
  deleteCoupon: async (id) => {
    try {
      await axios.delete(`/api/coupons/${id}`);
    } catch (error) {
      console.error('Error deleting coupon:', error);
      throw error;
    }
  },

  // Tìm kiếm mã giảm giá
  searchCoupons: async (keyword) => {
    try {
      const response = await axios.get('/api/coupons/search', {
        params: { keyword }
      });
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Error searching coupons:', error);
      return [];
    }
  },

  // Lấy danh sách mã còn hiệu lực
  getValidCoupons: async () => {
    try {
      const response = await axios.get('/api/coupons/valid');
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Error fetching valid coupons:', error);
      return [];
    }
  },

  // Lấy danh sách mã sắp hết hạn
  getExpiringCoupons: async (days = 7) => {
    try {
      const response = await axios.get('/api/coupons/expiring', {
        params: { days }
      });
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Error fetching expiring coupons:', error);
      return [];
    }
  },

  // Kiểm tra tính hợp lệ của mã giảm giá
  validateCoupon: async (code, orderId, customerId) => {
    try {
      const response = await axios.get('/api/coupons/validate', {
        params: { code, orderId, customerId }
      });
      return response;
    } catch (error) {
      console.error('Error validating coupon:', error);
      throw error;
    }
  },

  // Áp dụng mã giảm giá
  applyCoupon: async (code, orderId, customerId) => {
    try {
      const response = await axios.post('/api/coupons/apply', null, {
        params: { code, orderId, customerId }
      });
      return response;
    } catch (error) {
      console.error('Error applying coupon:', error);
      throw error;
    }
  },
  
  // Hủy áp dụng mã giảm giá
  removeCoupon: async (orderId) => {
    try {
      const response = await axios.delete('/api/coupons/remove', {
        params: { orderId }
      });
      return response;
    } catch (error) {
      console.error('Error removing coupon:', error);
      throw error;
    }
  }
};

// Export individual functions for easier import
export const getAllCoupons = couponAPI.getAllCoupons;
export const getCouponById = couponAPI.getCouponById;
export const createCoupon = couponAPI.createCoupon;
export const updateCoupon = couponAPI.updateCoupon;
export const deleteCoupon = couponAPI.deleteCoupon;
export const searchCoupons = couponAPI.searchCoupons;
export const getValidCoupons = couponAPI.getValidCoupons;
export const getExpiringCoupons = couponAPI.getExpiringCoupons;

// Updated validateCoupon function for booking page
export const validateCoupon = async (code, orderAmount = 0) => {
  try {
    const response = await axios.get('/api/coupons/validate', {
      params: { code, orderAmount }
    });
    return response.data;
  } catch (error) {
    console.error('Error validating coupon:', error);
    throw error;
  }
};

// Updated applyCoupon function for booking page
export const applyCoupon = async (code, orderAmount = 0, customerId = null) => {
  try {
    const response = await axios.post('/api/coupons/apply', {
      code,
      orderAmount,
      customerId
    });
    return response.data;
  } catch (error) {
    console.error('Error applying coupon:', error);
    throw error;
  }
};

export const removeCoupon = couponAPI.removeCoupon;
