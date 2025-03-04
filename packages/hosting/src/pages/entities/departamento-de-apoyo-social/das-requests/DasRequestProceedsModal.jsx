import React, { useEffect, useState } from "react";
import { useFormUtils } from "../../../../hooks";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Col,
  Form,
  notification,
  RadioGroup,
  Row,
} from "../../../../components";
import { updateDasRequest } from "../../../../firebase/collections/dasApplications";

export const DasRequestProceedsModal = ({ onCloseModal, dasRequest }) => {
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

      await updateDasRequest(dasRequest.id, {
        status: formData.isProceeds ? "proceeds" : "notProceeds",
      });

      notification({ type: "success" });
      onCloseModal();
    } catch (e) {
      console.error(e);
      notification({ type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    resetForm();
  }, []);

  const resetForm = () => {
    reset({
      isProceeds: "",
    });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmitCorrespondenceProceeds)}>
      <Row gutter={[16, 16]}>
        <Col sm={24}>
          <Controller
            name="isProceeds"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <RadioGroup
                label="¿Procede esta solicitud?"
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
            onClick={onCloseModal}
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
  );
};
