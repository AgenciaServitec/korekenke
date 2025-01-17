import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Modal,
  notification,
  RadioGroup,
  Row,
} from "../../components";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDevice, useFormUtils } from "../../hooks";
import { updateCorrespondence } from "../../firebase/collections";

export const CorrespondenceProceedsModal = ({
  visibleModal,
  onSetVisibleModal,
  correspondence,
}) => {
  const { isMobile } = useDevice();
  const [loading, setLoading] = useState(false);

  const schema = yup.object({
    isProceeds: yup.boolean().required(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { required, error } = useFormUtils({ errors, schema });

  const onSubmitCorrespondenceProceeds = async (formData) => {
    try {
      setLoading(true);

      await updateCorrespondence(correspondence.id, {
        status: formData.isProceeds ? "proceeds" : "notProceeds",
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

  useEffect(() => {
    resetForm();
  }, [visibleModal]);

  const resetForm = () => {
    reset({
      isProceeds: "",
    });
  };

  return (
    <Modal
      title="Evaluación de la correspondencia"
      open={visibleModal}
      onCancel={() => onSetVisibleModal(false)}
      closable
      width={isMobile ? "90%" : "50%"}
      centered={false}
      destroyOnClose
    >
      <Form onSubmit={handleSubmit(onSubmitCorrespondenceProceeds)}>
        <Row gutter={[16, 16]}>
          <Col sm={24}>
            <Controller
              name="isProceeds"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <RadioGroup
                  label="¿Procede esta correspondencia?"
                  optionType="button"
                  buttonStyle="solid"
                  size="large"
                  style={{ display: "flex", justifyContent: "center" }}
                  animation={false}
                  onChange={onChange}
                  value={value}
                  name={name}
                  error={error(name)}
                  required={required(name)}
                  options={[
                    {
                      label: "Si",
                      value: true,
                    },
                    {
                      label: "No",
                      value: false,
                    },
                  ]}
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
