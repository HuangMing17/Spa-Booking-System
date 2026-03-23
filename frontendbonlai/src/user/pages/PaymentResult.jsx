import React, { useEffect, useState } from "react";
import { Result, Button, Card, Typography, Spin } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { HomeOutlined, ShoppingCartOutlined } from "@ant-design/icons";

const { Text } = Typography;

const PaymentResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [messageText, setMessageText] = useState("Đang xử lý kết quả giao dịch...");
  
  useEffect(() => {
    // Read query parameters từ VNPay trả về trên thanh trình duyệt
    const searchParams = new URLSearchParams(location.search);
    const responseCode = searchParams.get("vnp_ResponseCode");
    const transactionNo = searchParams.get("vnp_TransactionNo");
    
    if (!responseCode) {
      setStatus("error");
      setMessageText("Không tìm thấy thông tin giao dịch hợp lệ trên URL.");
      return;
    }

    if (responseCode === "00") {
      setStatus("success");
      setMessageText(`Thanh toán dịch vụ thành công! Mã đối soát từ VNPay: ${transactionNo || "N/A"}`);
    } else {
      setStatus("error");
      switch(responseCode) {
        case "24": 
            setMessageText("Giao dịch bị huỷ bởi người dùng (Khách hàng chủ động đóng cửa sổ VNPay).");
            break;
        case "51":
            setMessageText("Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.");
            break;
        case "65":
            setMessageText("Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.");
            break;
        case "75":
            setMessageText("Ngân hàng thanh toán đang bảo trì.");
            break;
        default:
            setMessageText("Thanh toán thất bại do lỗi không xác định từ phía ngân hàng.");
      }
    }
  }, [location.search]);

  if (status === "loading") {
    return (
      <div style={{ textAlign: "center", padding: "100px", minHeight: "60vh" }}>
        <Spin size="large" />
        <div style={{ marginTop: 20 }}>{messageText}</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 20px', minHeight: "60vh" }}>
      <Card style={{ maxWidth: 600, width: '100%', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Result
          status={status}
          title={status === "success" ? "Giao Dịch Thành Công!" : "Giao Dịch Thất Bại!"}
          subTitle={messageText}
          extra={[
            <Button 
                type="primary" 
                key="bookings" 
                icon={<ShoppingCartOutlined />}
                onClick={() => navigate("/lich-hen")}
            >
              Kiểm tra Lịch hẹn
            </Button>,
            <Button 
                key="home" 
                icon={<HomeOutlined />}
                onClick={() => navigate("/")}
            >
              Về trang chủ
            </Button>
          ]}
        >
          {status === "success" && (
            <div style={{textAlign: "center"}}>
              <Text type="secondary">
                Thông tin hoàn tất đặt lịch đã được ghi nhận. Cảm ơn quý khách đã tin tưởng dịch vụ của SPA Bon Lai!
              </Text>
            </div>
          )}
        </Result>
      </Card>
    </div>
  );
};

export default PaymentResult;
