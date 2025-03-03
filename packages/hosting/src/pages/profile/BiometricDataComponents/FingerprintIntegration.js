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
          <Tag color="red">Registra tu huella digital</Tag>
        ) : (
          <Tag color="green">Huella digital registrada</Tag>
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
                    title="Huella Digital"
                    bordered
                    style={{
                      textAlign: "center",
                      backgroundColor: fingerprintTemplate
                        ? "#78d225"
                        : "#dc3122",
                      borderColor: fingerprintTemplate ? "#f6ffed" : "#f6ffed",
                    }}
                  >
                    <Paragraph style={{ color: "#f6ffed" }}>
                      {fingerprintTemplate
                        ? "Huella capturada correctamente."
                        : "No se ha detectado una huella para guardar."}
                    </Paragraph>
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
