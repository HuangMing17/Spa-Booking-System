import { API_BASE_URL } from "./axios";

/**
 * Chuyển đổi relative URL thành absolute URL cho ảnh
 * @param {string} imageUrl - URL ảnh (có thể là relative hoặc absolute)
 * @returns {string} - Absolute URL
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return "";

  // Xử lý trường hợp URL có dấu ngoặc kép (từ JSON.stringify)
  let cleanUrl = imageUrl;
  if (typeof imageUrl === "string") {
    // Loại bỏ dấu ngoặc kép ở đầu và cuối nếu có
    cleanUrl = imageUrl.replace(/^["']|["']$/g, "");
  }

  // Nếu đã là absolute URL, trả về nguyên vẹn
  if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")) {
    return cleanUrl;
  }

  // Nếu là relative URL, thêm base URL
  if (cleanUrl.startsWith("/uploads/")) {
    return `${API_BASE_URL}${cleanUrl}`;
  }

  // Nếu chỉ là filename, thêm đường dẫn đầy đủ
  if (!cleanUrl.startsWith("/")) {
    return `${API_BASE_URL}/uploads/${cleanUrl}`;
  }

  return cleanUrl;
};

/**
 * Kiểm tra xem URL ảnh có hợp lệ không
 * @param {string} imageUrl - URL ảnh
 * @returns {boolean} - true nếu hợp lệ
 */
export const isValidImageUrl = (imageUrl) => {
  if (!imageUrl) return false;

  try {
    new URL(getImageUrl(imageUrl));
    return true;
  } catch {
    return false;
  }
};

/**
 * Tạo fallback URL cho ảnh
 * @param {number} width - Chiều rộng
 * @param {number} height - Chiều cao
 * @returns {string} - Placeholder URL
 */
export const getPlaceholderImage = (width = 300, height = 300) => {
  return `https://placehold.co/${width}x${height}/f5f5f5/999999.png?text=No+Image`;
};
