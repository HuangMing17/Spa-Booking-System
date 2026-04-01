import React, { useState, useEffect } from "react";
import {
  Descriptions,
  Button,
  Spin,
  Tag,
  Typography,
  Card,
  message,
} from "antd";
import axios from "../../../utils/axios";

const { Title, Paragraph, Text } = Typography;

const CategoryDetail = ({ category }) => {
  const [childCategories, setChildCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      fetchCategoryDetails();
    }
  }, [category]);
  const fetchCategoryDetails = async () => {
    setLoading(true);
    try {
      // Fetch child categories
      const childrenUrl = `/api/categories/${category.id}/children`;
      console.log("Fetching children from URL:", childrenUrl);
      const childResponse = await axios.get(childrenUrl);
      // Axios instance đã được cấu hình để trả về response.data
      setChildCategories(Array.isArray(childResponse) ? childResponse : []); // Fetch products in this category
      const productsUrl = `/api/categories/${category.id}/products`;
      console.log("Fetching products from URL:", productsUrl);
      const productsResponse = await axios.get(productsUrl);
      // Axios instance đã được cấu hình để trả về response.data
      setProducts(Array.isArray(productsResponse) ? productsResponse : []);
      console.log("Child categories:", childResponse);
      console.log("Products response:", productsResponse);
      console.log(
        "Products data structure:",
        JSON.stringify(productsResponse, null, 2)
      );

      // Debug individual products
      if (Array.isArray(productsResponse) && productsResponse.length > 0) {
        console.log("First product keys:", Object.keys(productsResponse[0]));
        console.log("First product:", productsResponse[0]);
      }
    } catch (error) {
      console.error("Error fetching category details:", error);
      message.error("Không thể tải thông tin chi tiết danh mục!");
    } finally {
      setLoading(false);
    }
  };

  if (!category) {
    return <div>Không có thông tin danh mục</div>;
  }

  return (
    <div className="category-detail">
      {loading ? (
        <div style={{ textAlign: "center", padding: 20 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>

          <Descriptions title="Thông tin danh mục" bordered column={2}>
            <Descriptions.Item label="Tên danh mục" span={2}>
              <Text strong>{category.name}</Text>
            </Descriptions.Item>

            <Descriptions.Item label="Mô tả" span={2}>
              {category.description || "Không có mô tả"}
            </Descriptions.Item>



            <Descriptions.Item label="Trạng thái">
              <Tag color={category.isActive ? "green" : "red"}>
                {category.isActive ? "Đang hoạt động" : "Không hoạt động"}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="ID">{category.id}</Descriptions.Item>
            <Descriptions.Item label="Danh mục cha">
              {category.parentId || "Không có (Danh mục gốc)"}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {new Date(category.createdAt).toLocaleString("vi-VN")}
            </Descriptions.Item>
            <Descriptions.Item label="Cập nhật lần cuối">
              {new Date(category.updatedAt).toLocaleString("vi-VN")}
            </Descriptions.Item>
          </Descriptions>
          {childCategories.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <Title level={4}>Danh mục con ({childCategories.length})</Title>
              <ul>
                {childCategories.map((child) => (
                  <li key={child.id}>
                    <Paragraph>
                      <strong>{child.name}</strong> -{" "}
                      {child.description || "Không có mô tả"}
                    </Paragraph>
                  </li>
                ))}
              </ul>
            </div>
          )}{" "}
          {products.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <Title level={4}>
                Sản phẩm trong danh mục ({products.length})
              </Title>

              {/* Check if products have valid data */}
              {products.every(
                (product) =>
                  !product.name && !product.title && !product.serviceName
              ) ? (
                <Card
                  style={{
                    backgroundColor: "#f6f8fa",
                    border: "1px dashed #d0d7de",
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  <Text type="secondary">
                    <strong>
                      Có {products.length} sản phẩm được liên kết với danh mục
                      này
                    </strong>
                    <br />
                    Tuy nhiên, thông tin chi tiết sản phẩm chưa được tải đầy đủ
                    từ API.
                    <br />
                    <small>
                      API endpoint:{" "}
                      <code>/api/categories/{category.id}/products</code> trả về
                      dữ liệu không đầy đủ.
                    </small>
                  </Text>
                </Card>
              ) : (
                <ul>
                  {products.map((product, index) => {
                    // Try to extract name from various possible fields
                    const productName =
                      product.name ||
                      product.title ||
                      product.serviceName ||
                      product.productName ||
                      product.itemName ||
                      `Sản phẩm ${index + 1}`;

                    // Try to extract description from various possible fields
                    const productDesc =
                      product.description ||
                      product.desc ||
                      product.serviceDescription ||
                      product.summary ||
                      product.details ||
                      "";

                    // Check if product has any meaningful data
                    const hasValidData =
                      product.name ||
                      product.title ||
                      product.serviceName ||
                      product.description ||
                      product.regularPrice;

                    return (
                      <li key={product.id || index}>
                        <Paragraph>
                          <strong>{productName}</strong>
                          {productDesc && <span> - {productDesc}</span>}
                          {!productDesc && (
                            <span style={{ color: "#999" }}>
                              {" "}
                              - Không có mô tả
                            </span>
                          )}

                          {/* Show price if available */}
                          {product.regularPrice && (
                            <span style={{ color: "#1890ff", marginLeft: 8 }}>
                              -{" "}
                              {new Intl.NumberFormat("vi-VN").format(
                                product.regularPrice
                              )}{" "}
                              VND
                            </span>
                          )}

                          {/* Show ID for debugging if no valid data */}
                          {!hasValidData && (
                            <span style={{ color: "#999", fontSize: "12px" }}>
                              <br />
                              ID: {product.id}
                            </span>
                          )}
                        </Paragraph>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryDetail;
