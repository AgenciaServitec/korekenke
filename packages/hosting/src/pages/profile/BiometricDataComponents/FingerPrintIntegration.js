import React from "react";
import { Button, Col, Row, Tag } from "../../../components";
import { useModal } from "../../../providers";
import { useDevice } from "../../../hooks";

export const FingerPrintIntegration = () => {
  const { onShowModal, onCloseModal } = useModal();
  const { isTablet } = useDevice();

  const onDetectFingerprint = () => {
    onShowModal({
      title: "Registro de huella digital",
      width: `${isTablet ? "60%" : "30%"}`,
      onRenderBody: () => <FingerPrint />,
    });
  };

  const showAlert = true;

  return (
    <Row
      gutter={[16, 16]}
      justify="center"
      align="middle"
      style={{ padding: 16 }}
    >
      <Col span={24} style={{ texAlign: "center" }}>
        {showAlert ? (
          <Tag color="red">Registra tu huella digital</Tag>
        ) : (
          <Tag color="green">Huella digital registrada</Tag>
        )}
      </Col>
      <Col span={24} style={{ textAlign: "center", marginBottom: 16 }}>
        <Button type="primary" onClick={onDetectFingerprint} size="large">
          Registrar Huella
        </Button>
      </Col>
    </Row>
  );
};

const FingerPrint = () => {
  return <div>HOLA</div>;
};
