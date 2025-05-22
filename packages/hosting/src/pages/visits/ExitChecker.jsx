import React from "react";
import { useDefaultFirestoreProps } from "../../hooks";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { Form, notification, Row, Col, Button } from "../../components";
import { updateVisit } from "../../firebase/collections";

export const ExitChecker = ({ visit, onCloseModal }) => {
  const { assignUpdateProps } = useDefaultFirestoreProps();
  const dateTime = dayjs().format("DD-MM-YYYY HH:mm");

  const { handleSubmit } = useForm();

  const onSubmit = async () => {
    const updatedVisit = {
      ...visit,
      exitDateTime: dateTime || "",
    };

    try {
      await updateVisit(visit.id, assignUpdateProps(updatedVisit));
      notification({ type: "success" });
    } catch (err) {
      notification({ type: "error" });
      console.error("Error: ", err);
    }
    onCloseModal();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Row
            justify="center"
            gutter={[16, 16]}
            style={{
              marginTop: 24,
              borderTop: "1px solid #f0f0f0",
              paddingTop: 24,
            }}
          >
            <Col xs={24} sm={6} md={4}>
              <Button type="default" size="large" block onClick={onCloseModal}>
                Cancelar
              </Button>
            </Col>
            <Col xs={24} sm={6} md={4}>
              <Button type="primary" size="large" block htmlType="submit">
                Aceptar
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  );
};
