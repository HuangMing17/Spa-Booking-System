import React, { useState } from "react";
import { Form, Input, Button, message, Switch, Divider } from "antd";
import axios from "../../../utils/axios";
import { ImageUpload } from "../../../components";

const CategoryForm = ({ category, onSubmitSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const isEditing = !!category;
  // Form submission handler
  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      // Prepare the data
      const formData = {
        name: values.name,
        description: values.description,
        isActive: values.isActive,
        parentId: values.parentId || null,
      };

      let categoryResponse;

      // Make API request based on whether we're editing or creating
      if (isEditing) {
        categoryResponse = await axios.put(
          `/api/categories/${category.id}`,
          formData
        );
        message.success("Cập nhật danh mục thành công!");
      } else {
        categoryResponse = await axios.post("/api/categories", formData);
        message.success("Thêm danh mục mới thành công!");
      } // If there's a thumbnail to update, make a separate API call to update the image
      if (values.thumbnail) {
        const categoryId = isEditing
          ? category.id
          : categoryResponse.id || categoryResponse.data?.id;
        if (categoryId) {
          try {
            console.log("Sending thumbnail URL:", values.thumbnail);
            console.log("Category ID:", categoryId);

            // Gửi URL ảnh dưới dạng JSON string theo API documentation
            // API mong đợi string được quoted trong JSON body
            await axios.post(
              `/api/categories/${categoryId}/image`,
              JSON.stringify(values.thumbnail),
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            console.log("Category image updated successfully");
          } catch (imageError) {
            console.error("Error updating category image:", imageError);
            message.warning(
              "Danh mục đã được lưu nhưng có lỗi khi cập nhật ảnh!"
            );
          }
        }
      }

      // Notify parent component that submission was successful
      onSubmitSuccess();
    } catch (error) {
      console.error("Error submitting category form:", error);

      // Hiển thị thông báo lỗi chi tiết hơn từ API nếu có
      const errorMsg =
        error?.response?.data?.message ||
        (isEditing
          ? "Không thể cập nhật danh mục!"
          : "Không thể tạo danh mục mới!");

      // Log chi tiết API call để debug
      if (isEditing) {
        console.log("Update category failed. Category ID:", category.id);
      }

      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }; // Set initial form values from category if editing
  React.useEffect(() => {
    if (category) {
      console.log("Received category for editing:", category);

      form.setFieldsValue({
        name: category.name,
        description: category.description,
        isActive: category.isActive,
        parentId: category.parentId,
        thumbnail: category.thumbnail,
      });
    }
  }, [category, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        isActive: true,
      }}
    >
      <Form.Item
        name="name"
        label="Tên danh mục"
        rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
      >
        <Input placeholder="Nhập tên danh mục" />
      </Form.Item>{" "}
      <Form.Item name="description" label="Mô tả">
        <Input.TextArea placeholder="Nhập mô tả danh mục" rows={4} />
      </Form.Item>
      <Divider>Hình ảnh</Divider>
      {/* Ảnh đại diện */}
      <Form.Item
        label="Ảnh đại diện"
        name="thumbnail"
        rules={[{ required: true, message: "Vui lòng upload ảnh đại diện!" }]}
      >
        <ImageUpload placeholder="Upload ảnh đại diện" />
      </Form.Item>
      <Form.Item
        name="parentId"
        label="ID danh mục cha (để trống nếu là danh mục gốc)"
      >
        <Input placeholder="Nhập ID danh mục cha (nếu có)" />
      </Form.Item>
      <Form.Item name="isActive" label="Trạng thái" valuePropName="checked">
        <Switch
          checkedChildren="Hoạt động"
          unCheckedChildren="Không hoạt động"
        />
      </Form.Item>
      <Form.Item>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEditing ? "Cập nhật" : "Tạo mới"}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default CategoryForm;
