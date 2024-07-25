import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  notification,
  Row,
} from "../../components";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../hooks";
import * as yup from "yup";
import { updateCorrespondence } from "../../firebase/collections";

export const ReceivedByModal = ({
  visibleModal,
  onSetVisibleModal,
  correspondence,
}) => {
  const [loading, setLoading] = useState(false);

  const schema = yup.object({
    receivedBy: yup.string().required(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { required, error, errorMessage } = useFormUtils({ errors, schema });

  useEffect(() => {
    resetForm();
  }, [correspondence]);

  const resetForm = () => {
    reset({
      receivedBy: correspondence?.receivedBy || "",
    });
  };

  const onSubmitCorrespondenceReceivedBy = async (formData) => {
    try {
      setLoading(true);

      await updateCorrespondence(correspondence.id, {
        receivedBy: formData.receivedBy,
        status: "pending",
      });

      notification({ type: "success" });
      onSetVisibleModal(false);
    } catch (e) {
      console.error(e);
      notification({ type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visibleModal}
      onCancel={() => onSetVisibleModal(false)}
      title="Recibido por:"
      closable
      width="50%"
      centered={false}
      destroyOnClose
    >
      <Form onSubmit={handleSubmit(onSubmitCorrespondenceReceivedBy)}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Controller
              name="receivedBy"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label=""
                  name={name}
                  value={value}
                  onChange={onChange}
                  error={error(name)}
                  helperText={errorMessage(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>
        </Row>
        <Row justify="end" gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Button
              type="default"
              size="large"
              block
              onClick={() => onSetVisibleModal(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
          </Col>
          <Col xs={24} sm={8}>
            <Button
              type="primary"
              size="large"
              block
              htmlType="submit"
              disabled={loading}
              loading={loading}
            >
              Guardar
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
