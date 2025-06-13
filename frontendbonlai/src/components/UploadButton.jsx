import React from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "../utils/axios";

const UploadButton = ({
  onSuccess,
  accept = "image/*",
  maxSize = 5,
  buttonText = "Chọn file",
  loading,
  disabled,
}) => {
  const handleUpload = async (file) => {
    // Kiểm tra kích thước file
    const isLtMaxSize = file.size / 1024 / 1024 < maxSize;
    if (!isLtMaxSize) {
      message.error(`File phải nhỏ hơn ${maxSize}MB!`);
      return false;
    }

    // Kiểm tra định dạng file nếu là ảnh
    if (accept === "image/*" && !file.type.startsWith("image/")) {
      message.error("Chỉ được upload file ảnh!");
      return false;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedUrl = response.data || response;
      let fullUrl = uploadedUrl;

      if (uploadedUrl.startsWith("/uploads/")) {
        fullUrl = `${window.location.origin}${uploadedUrl}`;
      }

      onSuccess?.(fullUrl);
      message.success("Upload thành công!");
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Upload thất bại!");
    }

    return false;
  };

  return (
    <Upload
      beforeUpload={handleUpload}
      showUploadList={false}
      accept={accept}
      disabled={disabled}
    >
      <Button icon={<UploadOutlined />} loading={loading} disabled={disabled}>
        {buttonText}
      </Button>
    </Upload>
  );
};

export default UploadButton;
