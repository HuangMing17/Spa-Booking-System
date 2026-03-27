// Các key cho session storage
export const STORAGE_KEYS = {
  TOKEN: "token",
  TOKEN_TYPE: "tokenType",
  EXPIRES_IN: "expiresIn",
  USER_TYPE: "userType",
  USER_DATA: "userData",
};

// Lưu thông tin authentication
export const setAuthData = (authResponse) => {
  const { token, tokenType, expiresIn, userType, user } = authResponse;

  // Tính thời điểm hết hạn (12 giờ)
  const expirationTime = Date.now() + 24 * 60 * 60 * 1000;

  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.TOKEN_TYPE, tokenType);
  localStorage.setItem(STORAGE_KEYS.EXPIRES_IN, expirationTime.toString());
  localStorage.setItem(STORAGE_KEYS.USER_TYPE, userType);
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
};

// Lấy token authentication
export const getAuthToken = () => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const tokenType = localStorage.getItem(STORAGE_KEYS.TOKEN_TYPE);
  return token ? `${tokenType} ${token}` : null;
};

// Lấy thông tin người dùng
export const getUserData = () => {
  const userDataStr = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  try {
    return userDataStr ? JSON.parse(userDataStr) : null;
  } catch (e) {
    console.error("Error parsing userData from storage", e);
    return null;
  }
};

// Lấy loại người dùng (admin/customer)
export const getUserType = () => {
  return localStorage.getItem(STORAGE_KEYS.USER_TYPE);
};

// Kiểm tra token có hết hạn chưa
export const isTokenExpired = () => {
  // Luôn trả về false, token không bao giờ hết hạn
  return false;
};

// Xóa tất cả thông tin authentication
export const clearAuthData = () => {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
};

// Kiểm tra user đã đăng nhập chưa
export const isAuthenticated = () => {
  const token = getAuthToken();
  // Luôn trả về true, bỏ qua việc kiểm tra hết hạn
  return token ? true : false;
};
