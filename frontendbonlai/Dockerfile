# Build stage cho React/Vite
FROM node:18-alpine AS build

WORKDIR /app
# Cài đặt dependencies
COPY package*.json ./
RUN npm install

# Copy toàn bộ code và cấp quyền
COPY . .

# Thay đổi VITE_API_URL về URL tương đối để tránh lỗi CORS
ENV VITE_API_URL=/api

# Chạy build lấy thư mục 'dist'
RUN npm run build

# Production stage - Dùng Nginx
FROM nginx:alpine

# Copy file cấu hình Nginx do chúng ta tạo ra (nếu có)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy thư mục build từ Stage 1 sang Nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
