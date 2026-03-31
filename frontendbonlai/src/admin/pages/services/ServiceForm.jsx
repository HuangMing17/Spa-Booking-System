import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Switch,
  message,
  Space,
  Divider,
  Card,
  Row,
  Col,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { createService, updateService } from "./serviceAPI";
import axios from "../../../utils/axios";
import { ImageUpload } from "../../../components";

const { Option } = Select;
const { TextArea } = Input;

const ServiceForm = ({ service, onSubmitSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]); // Initialize form with service data if editing
  useEffect(() => {
    if (service) {
      // Convert variants from separate arrays to object array
      const variants = service.variantNames?.map((name, index) => ({
        name: name,
        price: service.variantPrices?.[index] || 0,
        duration: service.variantDurations?.[index] || 0,
      })) || [{ name: "", price: 0, duration: 0 }];

      // Convert attributes from separate arrays to object array
      const attributes = service.attributeNames?.map((name, index) => ({
        name: name,
        value: service.attributeValues?.[index] || "",
      })) || [{ name: "", value: "" }];

      form.setFieldsValue({
        name: service.name,
        description: service.description,
        regularPrice: service.regularPrice || service.price,
        salePrice: service.salePrice,
        categoryIds:
          service.categoryIds ||
          (service.categories && service.categories.map((cat) => cat.id)) ||
          (service.category && [service.category.id]) ||
          [],
        tags:
          service.tagNames?.map((tag) => tag.id) ||
          service.tags?.map((tag) => tag.id) ||
          [],
        isActive: service.isActive,
        thumbnail: service.thumbnail,
        images: service.images?.map((img) => img.url || img) || ["", "", ""],
        variants: variants,
        attributes: attributes,
      });
    }
  }, [service, form]);

  // Fetch categories and tags
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        setCategories(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        message.error("Không thể tải danh sách danh mục");
      }
    };

    const fetchTags = async () => {
      try {
        const response = await axios.get("/api/tags");
        setTags(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Error fetching tags:", error);
        message.error("Không thể tải danh sách tags");
      }
    };
    fetchCategories();
    fetchTags();
  }, []);

  // Handle form submission
  const onFinish = async (values) => {
    try {
      setLoading(true);

      // Filter out empty image URLs
      const filteredImages = (values.images || []).filter((url) => url);

      // Filter out empty variants and attributes
      const filteredVariants = (values.variants || []).filter(
        (variant) => variant.name && variant.price && variant.duration
      );
      const filteredAttributes = (values.attributes || []).filter(
        (attr) => attr.name && attr.value
      );

      // Prepare API values
      const apiValues = {
        ...values,
        images: filteredImages,
        variants: filteredVariants,
        attributes: filteredAttributes,
      };

      let response;

      // Create new or update existing service
      if (service) {
        response = await updateService(service.id, apiValues);
        message.success("Cập nhật dịch vụ thành công!");
      } else {
        response = await createService(apiValues);
        message.success("Tạo dịch vụ mới thành công!");
      }

      // Reset form and notify parent component
      form.resetFields();
      onSubmitSuccess();
    } catch (error) {
      console.error("Error submitting service:", error);
      message.error(
        error?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!"
      );
    } finally {
      setLoading(false);
    }
  };
  // Preview image helper
  const renderImagePreview = (url, width = 100, height = 100) => {
    if (!url) return null;
    return (
      <img
        src={url}
        alt="preview"
        style={{
          width,
          height,
          objectFit: "cover",
          borderRadius: 4,
        }}
      />
    );
  };
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        isActive: true,
        variants: [{ name: "", price: 0, duration: 0 }],
        attributes: [{ name: "", value: "" }],
        images: [""], // Khởi tạo với 1 slot ảnh trống
      }}
    >
      <Form.Item
        label="Tên dịch vụ"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ!" }]}
      >
        <Input placeholder="Nhập tên dịch vụ..." />
      </Form.Item>
      <Form.Item
        label="Danh mục"
        name="categoryIds"
        rules={[
          { required: true, message: "Vui lòng chọn ít nhất một danh mục!" },
        ]}
      >
        <Select mode="multiple" placeholder="Chọn danh mục">
          {categories.map((category) => (
            <Option key={category.id} value={category.id}>
              {category.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Mô tả"
        name="description"
        rules={[{ required: true, message: "Vui lòng nhập mô tả dịch vụ!" }]}
      >
        <TextArea rows={4} placeholder="Nhập mô tả dịch vụ..." />
      </Form.Item>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="Giá gốc (VND)"
            name="regularPrice"
            rules={[{ required: true, message: "Vui lòng nhập giá gốc!" }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              placeholder="Nhập giá gốc..."
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Giá khuyến mãi (VND)" name="salePrice">
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              placeholder="Nhập giá khuyến mãi..."
            />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="Tags" name="tags">
        <Select mode="multiple" placeholder="Chọn tags">
          {tags.map((tag) => (
            <Option key={tag.id} value={tag.id}>
              {tag.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Divider>Biến thể dịch vụ</Divider>
      <Form.List name="variants">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Card key={key} size="small" style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item
                      {...restField}
                      name={[name, "name"]}
                      label="Tên biến thể"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên biến thể!",
                        },
                      ]}
                    >
                      <Input placeholder="Ví dụ: Basic, Premium" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      {...restField}
                      name={[name, "price"]}
                      label="Giá (VND)"
                      rules={[
                        { required: true, message: "Vui lòng nhập giá!" },
                      ]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        placeholder="Giá biến thể"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      {...restField}
                      name={[name, "duration"]}
                      label="Thời gian (phút)"
                      rules={[
                        { required: true, message: "Vui lòng nhập thời gian!" },
                      ]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        min={1}
                        placeholder="Phút"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    <Form.Item label=" ">
                      <Button
                        type="text"
                        danger
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(name)}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Thêm biến thể
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Divider>Thuộc tính dịch vụ</Divider>
      <Form.List name="attributes">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Row key={key} gutter={16} style={{ marginBottom: 8 }}>
                <Col span={10}>
                  <Form.Item
                    {...restField}
                    name={[name, "name"]}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên thuộc tính!",
                      },
                    ]}
                  >
                    <Input placeholder="Ví dụ: Loại dịch vụ, Đối tượng" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    {...restField}
                    name={[name, "value"]}
                    rules={[
                      { required: true, message: "Vui lòng nhập giá trị!" },
                    ]}
                  >
                    <Input placeholder="Ví dụ: Massage trị liệu, Cả nam và nữ" />
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Button
                    type="text"
                    danger
                    icon={<MinusCircleOutlined />}
                    onClick={() => remove(name)}
                  />
                </Col>
              </Row>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Thêm thuộc tính
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>{" "}
      <Divider>Hình ảnh</Divider>
      {/* Ảnh đại diện */}
      <Form.Item
        label="Ảnh đại diện"
        name="thumbnail"
        rules={[{ required: true, message: "Vui lòng upload ảnh đại diện!" }]}
      >
        <ImageUpload placeholder="Upload ảnh đại diện" />
      </Form.Item>
      {/* Hình ảnh bổ sung */}
      <Form.Item label="Hình ảnh bổ sung (tối đa 3 ảnh)">
        <Form.List name="images">
          {(fields, { add, remove }) => (
            <Space wrap size={16}>
              {fields.map((field, index) => (
                <div key={field.key} style={{ position: "relative" }}>
                  <Form.Item {...field} style={{ margin: 0 }}>
                    <ImageUpload placeholder={`Ảnh ${index + 1}`} />
                  </Form.Item>
                  {fields.length > 1 && (
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<MinusCircleOutlined />}
                      style={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        background: "#fff",
                        border: "1px solid #ff4d4f",
                        borderRadius: "50%",
                        zIndex: 1,
                      }}
                      onClick={() => remove(field.name)}
                    />
                  )}
                </div>
              ))}
              {fields.length < 3 && (
                <Button
                  type="dashed"
                  onClick={() => add("")}
                  icon={<PlusOutlined />}
                  style={{
                    width: 200,
                    height: 200,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px dashed #d9d9d9",
                    borderRadius: 8,
                  }}
                >
                  <div>Thêm ảnh</div>
                </Button>
              )}
            </Space>
          )}
        </Form.List>
      </Form.Item>
      <Form.Item label="Trạng thái" name="isActive" valuePropName="checked">
        <Switch
          checkedChildren="Hoạt động"
          unCheckedChildren="Không hoạt động"
        />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {service ? "Cập nhật" : "Tạo mới"}
          </Button>
          <Button onClick={onCancel}>Hủy</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ServiceForm;
