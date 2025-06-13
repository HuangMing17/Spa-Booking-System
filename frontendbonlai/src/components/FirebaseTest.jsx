import React, { useState } from "react";
import { Button, Card, Typography, Space, Alert } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { firebaseAuthService } from "../utils/firebase";
import axiosInstance from "../utils/axios";

const { Title, Text } = Typography;

const FirebaseTest = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testFirebaseAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      // Test Firebase Google Sign-in
      const firebaseResult = await firebaseAuthService.signInWithGoogle();
      const idToken = await firebaseResult.user.getIdToken();

      // Test backend Firebase endpoint
      const backendResponse = await axiosInstance.post(
        "/auth/customer/firebase-login",
        {
          firebaseToken: idToken,
        }
      );

      setResult({
        firebase: {
          user: firebaseResult.user.displayName,
          email: firebaseResult.user.email,
          uid: firebaseResult.user.uid,
        },
        backend: backendResponse,
        token: idToken.substring(0, 50) + "...",
      });
    } catch (err) {
      setError(err.message || "Test failed");
      console.error("Firebase test error:", err);
    } finally {
      setLoading(false);
    }
  };

  const testAuthMethods = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/auth/customer/auth-methods");
      setResult({ authMethods: response });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testFirebaseHealth = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        "/auth/customer/firebase-health"
      );
      setResult({ health: response });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ maxWidth: 600, margin: "20px auto" }}>
      <Title level={3}>Firebase Authentication Test</Title>

      <Space direction="vertical" style={{ width: "100%" }}>
        <Button
          type="primary"
          icon={<GoogleOutlined />}
          loading={loading}
          onClick={testFirebaseAuth}
          block
        >
          Test Firebase Google Login
        </Button>

        <Button loading={loading} onClick={testAuthMethods} block>
          Test Auth Methods
        </Button>

        <Button loading={loading} onClick={testFirebaseHealth} block>
          Test Firebase Health
        </Button>

        {error && (
          <Alert message="Error" description={error} type="error" showIcon />
        )}

        {result && (
          <Alert
            message="Success"
            description={
              <pre style={{ whiteSpace: "pre-wrap" }}>
                {JSON.stringify(result, null, 2)}
              </pre>
            }
            type="success"
            showIcon
          />
        )}
      </Space>
    </Card>
  );
};

export default FirebaseTest;
