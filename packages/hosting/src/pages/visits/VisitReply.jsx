import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../hooks";
import { updateVisit } from "../../firebase/collections";
import {
  Button,
  Col,
  Form,
  notification,
  RadioGroup,
  Row,
} from "../../components";

export const VisitReply = ({ visit, onCloseModal }) => {
  const [loading, setLoading] = useState(false);

  const schema = yup.object({
    isApproved: yup.boolean().required(),
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

  const onSubmitVisitApproved = async (formData) => {
    try {
      setLoading(true);
      await updateVisit(visit.id, {
        status: formData.isApproved ? "approved" : "disapproved",
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
      isApproved: null,
    });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmitVisitApproved)}>
      <Row gutter={[16, 16]}>
        <Col sm={24}>
          <Controller
            name="isApproved"
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
