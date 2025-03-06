import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Card,
  Form,
  notification,
  Paragraph,
  Row,
  Tag,
} from "../../../components";
import { useAuthentication, useModal } from "../../../providers";
import { useDevice, useFingerprint } from "../../../hooks";
import {
  apiErrorNotification,
  getApiErrorResponse,
  useApiUserPut,
} from "../../../api";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { assign } from "lodash";
import styled from "styled-components";
import {
  CheckCircleFilled,
  CheckCircleOutlined,
  ExclamationCircleFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

export const FingerprintIntegration = () => {
  const { authUser } = useAuthentication();
  const { putUser, putUserLoading, putUserResponse } = useApiUserPut();
  const { onShowModal, onCloseModal } = useModal();
  const { isTablet } = useDevice();

  const [fingerprintTemplate, setFingerprintTemplate] = useState(null);
  const [isDetected, setIsDetected] = useState(false);

  const showAlert = !authUser?.fingerprintTemplate;

  const schema = yup.object({
    fingerprintTemplate: yup.string().default(""),
  });

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const updateProfile = async (formData) => {
    try {
      const response = await putUser(
        assign({}, formData, {
          id: authUser.id,
          phone: authUser.phone,
          email: authUser.email,
          fingerprintTemplate: fingerprintTemplate || "",
        }),
      );
      if (!putUserResponse.ok) {
        throw new Error(response);
      }
      notification({ type: "success" });
    } catch (e) {
      const errorResponse = await getApiErrorResponse(e);
      apiErrorNotification(errorResponse);
    }
  };

  useEffect(() => {
    reset({
      fingerprintTemplate: authUser?.fingerprintTemplate || "",
    });
  }, [authUser, reset]);

  const onSubmit = async (formData) => {
    await updateProfile(formData);
  };

  const onShowFingerprintModal = () => {
    onShowModal({
      title: "Registro de Huella Digital",
      width: `${isTablet ? "60%" : "30%"}`,
      onRenderBody: () => (
        <UserFingerprint onFingerprintCaptured={onFingerprintCaptured} />
      ),
    });
  };

  const onFingerprintCaptured = (template) => {
    if (!template || template.length < 10) {
      notification({ type: "error", message: "Error al capturar la huella" });
      return;
    }
    setFingerprintTemplate(template);
    setIsDetected(true);
    onCloseModal();
  };

  return (
    <Row
      gutter={[16, 16]}
      justify="center"
      align="middle"
      style={{ padding: 16 }}
    >
      <Col span={24} style={{ textAlign: "center" }}>
        {showAlert ? (
          <Tag
            icon={<ExclamationCircleOutlined />}
            color="#fff1f0"
            style={{
              color: "#cf1322",
              border: "1px solid #ffccc7",
              borderRadius: 20,
              padding: "8px 16px",
              fontSize: "0.9rem",
              fontWeight: 500,
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            Registre su Huella Dactilar
          </Tag>
        ) : (
          <Tag
            icon={<CheckCircleOutlined />}
            color="#f6ffed"
            style={{
              color: "#389e0d",
              border: "1px solid #b7eb8f",
              borderRadius: 20,
              padding: "8px 16px",
              fontSize: "0.9rem",
              fontWeight: 500,
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            Huella Dactilar Registrado
          </Tag>
        )}
      </Col>
      <Col span={24} style={{ textAlign: "center", marginBottom: 16 }}>
        <Button type="primary" onClick={onShowFingerprintModal} size="large">
          {authUser.fingerprintTemplate
            ? "Actualizar Huella"
            : "Registrar Huella"}
        </Button>
      </Col>
      <Col span={24}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Controller
                control={control}
                name="fingerprintTemplate"
                render={() => (
                  <Card
                    style={{
                      textAlign: "center",
                      backgroundColor: fingerprintTemplate
                        ? "rgba(120, 210, 37, 0.1)"
                        : "rgb(200,211,47,0.1)",
                      border: `2px solid ${fingerprintTemplate ? "#78d225" : "#c8d32f"}`,
                      maxWidth: 400,
                      margin: "0 auto",
                      padding: 16,
                      borderRadius: 12,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        justifyContent: "center",
                      }}
                    >
                      {fingerprintTemplate ? (
                        <CheckCircleFilled
                          style={{ color: "#78d225", fontSize: 20 }}
                        />
                      ) : (
                        <ExclamationCircleFilled
                          style={{ color: "#c8d32f", fontSize: 20 }}
                        />
                      )}
                      <Paragraph
                        style={{
                          color: fingerprintTemplate ? "#78d225" : "#c8d32f",
                          fontWeight: 500,
                          margin: 0,
                          fontSize: 14,
                        }}
                      >
                        {fingerprintTemplate
                          ? "Huella Lista para Guardar"
                          : "Se habilitará el botón al detectar su huella"}
                      </Paragraph>
                    </div>
                  </Card>
                )}
              />
            </Col>
            <Col xs={24} sm={12} md={8} style={{ margin: "0 auto" }}>
              <Button
                type="primary"
                size="large"
                block
                htmlType="submit"
                loading={putUserLoading}
                disabled={!isDetected}
              >
                Guardar
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};

const UserFingerprint = ({ onFingerprintCaptured }) => {
  const { device, isReady, startCapture } = useFingerprint(
    onFingerprintCaptured,
  );
  const [isCapturing, setIsCapturing] = useState(false);

  const handleCapture = async () => {
    setIsCapturing(true);
    try {
      await startCapture();
    } catch (error) {
      notification({
        type: "error",
      });
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <Container>
      <p>Presiona capturar huella para registrar</p>
      <Button
        onClick={handleCapture}
        disabled={!isReady || isCapturing} // Deshabilitar si no está listo
      >
        {isCapturing
          ? "Capturando..."
          : isReady
            ? "Capturar Huella"
            : "Conectando dispositivo..."}
      </Button>
      {!isReady && <p>Conectando con el lector de huellas...</p>}
    </Container>
  );
};

const Container = styled.div`
  text-align: center;
  font-size: 16px;
  padding: 20px;
  color: #555;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
`;
