import React, { useState, useEffect } from "react";
import { Upload, Button, message, Image, Space } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import axios, { API_BASE_URL } from "../utils/axios";
import { getImageUrl, getPlaceholderImage } from "../utils/imageUtils";

const ImageUpload = ({
  value = "",
  onChange,
  placeholder = "Upload ảnh",
  maxSizeMB = 5,
}) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(value);
  useEffect(() => {
    // Use getImageUrl to properly format the URL
    const formattedUrl = getImageUrl(value);
    console.log("ImageUpload - Original value:", value);
    console.log("ImageUpload - Formatted URL:", formattedUrl);
    setImageUrl(formattedUrl);
  }, [value]);

  // Kiểm tra định dạng và kích thước file
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ được upload file ảnh!");
      return false;
    }

    const isLessThan5MB = file.size / 1024 / 1024 < maxSizeMB;
    if (!isLessThan5MB) {
      message.error(`Ảnh phải nhỏ hơn ${maxSizeMB}MB!`);
      return false;
    }

    return true;
  };

  const handleUpload = async (file) => {
    if (!beforeUpload(file)) {
      return false;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const response = await axios.post("/api/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload response:", response);

      // API trả về URL: "/uploads/filename.jpg"
      const uploadedUrl = response.data || response;
      console.log("Uploaded URL from API:", uploadedUrl);

      let fullUrl = uploadedUrl;

      // Nếu URL không có protocol, thêm base URL của backend
      if (uploadedUrl.startsWith("/uploads/")) {
        fullUrl = `${API_BASE_URL}${uploadedUrl}`;
      }

      console.log("Full URL to be saved:", fullUrl);

      setImageUrl(fullUrl);
      onChange?.(fullUrl);
      message.success("Upload ảnh thành công!");
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Upload ảnh thất bại! Vui lòng thử lại.");
    } finally {
      setUploading(false);
    }

    return false; // Ngăn upload mặc định của antd
  };

  const handleRemove = () => {
    setImageUrl("");
    onChange?.("");
  };

  const uploadButton = (
    <div style={{ textAlign: "center" }}>
      {uploading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>
        {uploading ? "Đang upload..." : placeholder}
      </div>
    </div>
  );

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {imageUrl && !uploading ? (
        <div style={{ position: "relative" }}>
          <Image
            src={imageUrl}
            alt="uploaded"
            width={200}
            height={200}
            style={{
              objectFit: "cover",
              borderRadius: 8,
              border: "1px solid #d9d9d9",
            }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN2Mge3ABOHMBp7NAhXABG7hAhG+wEL8BpStwCG5YEGm9qQaDoFE2Sb0eTqaKlp6erq/vl90ktqrva3e9596m6//3kypEjR44cOXLkyJEjR44cOXLkyJEjR44cOXLkyJEjR44cOXLkyJEjR44cOXLkyJEjR44cOXLkyJEjR44cOXLkyJEjR44cOXLkyJEjR44cOXLkyJEjR44cOXLkyJEjR44cOXLkyJEjR44cOXLkyJEjR44c+f/e+fPnW1mWZS8vL29fv379+uXLlwe+8cYbB1999dXB119/ffDNN98cfPvtt+0///nP9l//+tf2008/3f75z3++/ac//en2H//4x+0f/vCH7d/97ne3f/vb325/+9vf3v71r3+9/Ytf/OL2z3/+8+1f/epXt3/84x9v/+IXv7j9k5/85PbPfvazmz/+8Y+v/+AHP7j+gx/84PoPf/jD6z/60Y+u/+zP/uz6j3/842s/+clPrv30pz+99rOf/eza7373u2u/+93vrv3mN7+59utf//rqr3/962u//OUvr/7qV7+69otf/OLqz3/+86s///nPr/785z+/+rOf/ezqT3/606s/+clPrv74xz+++qMf/ejqD3/4w6vf//73r37v9767+t3vfvfq7373u1e/+93vXv32t7999Zvf/ObVr3/961e/+tWvXv3yl7989Ytf/OLVL37xi1c///nPX/385z9/9bOf/ezVT3/601c/+clPXv34xz9+9aMf/ejVD3/4w1ff//73X33ve9979d3vfvfVd77znVff/va3X33rW9969c1vfvPVN77xjVdf//rXX3396197VdMm6fMAAAAASUVORK5CYII="
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            size="small"
            style={{
              position: "absolute",
              top: 4,
              right: 4,
              background: "rgba(255,255,255,0.9)",
              borderRadius: "50%",
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={handleRemove}
          />
        </div>
      ) : (
        <Upload
          beforeUpload={handleUpload}
          showUploadList={false}
          accept="image/*"
          disabled={uploading}
        >
          <div
            style={{
              width: 200,
              height: 200,
              border: "1px dashed #d9d9d9",
              borderRadius: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: uploading ? "not-allowed" : "pointer",
              backgroundColor: uploading ? "#f5f5f5" : "#fafafa",
            }}
          >
            {uploadButton}
          </div>
        </Upload>
      )}
    </div>
  );
};

export default ImageUpload;
