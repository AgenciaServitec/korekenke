import React, { useEffect } from "react";
import styled from "styled-components";
import { Button, Col, Form, Row, Select } from "../../../../../../components";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../../../../../hooks";
import { mediaQuery } from "../../../../../../styles";

export const PersonalInformation = ({
  dasRequest,
  loadingStep2,
  onSavePersonalInformationStep2,
}) => {
  const schema = yup.object({
    requestType: yup.string().required(),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { required, error, errorMessage } = useFormUtils({ errors, schema });

  useEffect(() => {
    resetForm();
  }, []);

  const resetForm = () => {
    reset({
      requestType: dasRequest?.requestType || "",
    });
  };

  const onSubmit = (formData) => onSavePersonalInformationStep2(formData);

  return (
    <Container>
      <div className="form-wrapper">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Controller
                name="requestType"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Select
                    label="Tipo de Solicitud"
                    variant="outlined"
                    name={name}
                    value={value}
                    options={[
                      {
                        label: "Tarifa Preferencial en Instituto",
                        value: "institutes",
                      },
                      {
                        label: "Tarifa Preferencial en Academia",
                        value: "academies",
                      },
                      {
                        label: "Recategorización en Universidad",
                        value: "universities",
                      },
                    ]}
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
            <Col xs={24} sm={6} md={4}>
              <Button
                type="primary"
                size="large"
                block
                htmlType="submit"
                disabled={loadingStep2}
                loading={loadingStep2}
              >
                Siguiente
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  .form-wrapper {
    width: 100%;
    margin: auto;
    ${mediaQuery.minDesktop} {
      width: 50%;
    }
  }
`;
