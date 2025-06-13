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
  const expirationTime = Date.now() + 12 * 60 * 60 * 1000;

  sessionStorage.setItem(STORAGE_KEYS.TOKEN, token);
  sessionStorage.setItem(STORAGE_KEYS.TOKEN_TYPE, tokenType);
  sessionStorage.setItem(STORAGE_KEYS.EXPIRES_IN, expirationTime.toString());
  sessionStorage.setItem(STORAGE_KEYS.USER_TYPE, userType);
  sessionStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
};

// Lấy token authentication
export const getAuthToken = () => {
  const token = sessionStorage.getItem(STORAGE_KEYS.TOKEN);
  const tokenType = sessionStorage.getItem(STORAGE_KEYS.TOKEN_TYPE);
  return token ? `${tokenType} ${token}` : null;
};

// Lấy thông tin người dùng
export const getUserData = () => {
  const userDataStr = sessionStorage.getItem(STORAGE_KEYS.USER_DATA);
  return userDataStr ? JSON.parse(userDataStr) : null;
};

// Kiểm tra token có hết hạn chưa
export const isTokenExpired = () => {
  // Luôn trả về false, token không bao giờ hết hạn
  return false;
};

// Xóa tất cả thông tin authentication
export const clearAuthData = () => {
  Object.values(STORAGE_KEYS).forEach((key) => {
    sessionStorage.removeItem(key);
  });
};

// Kiểm tra user đã đăng nhập chưa
export const isAuthenticated = () => {
  const token = getAuthToken();
  // Luôn trả về true, bỏ qua việc kiểm tra hết hạn
  return token ? true : false;
};
