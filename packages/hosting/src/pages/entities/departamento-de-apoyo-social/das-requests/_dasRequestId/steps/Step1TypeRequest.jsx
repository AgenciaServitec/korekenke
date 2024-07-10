import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Button,
  Col,
  Form,
  RadioGroup,
  Row,
  Select,
} from "../../../../../../components";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../../../../../hooks";
import { getLocalStorage, setLocalStorage } from "../../../../../../utils";
import { mediaQuery } from "../../../../../../styles";
import { isBoolean, omit } from "lodash";
import { DasRequestList } from "../../../../../../data-list";

export const Step1TypeRequest = ({ onNextStep }) => {
  const [loading, setLoading] = useState(false);

  const dasRequest = getLocalStorage("dasRequest");

  const schema = yup.object({
    requestType: yup.string().required(),
    isHeadline: yup.boolean().required(),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      isHeadline: true,
    },
  });

  const { required, error, errorMessage } = useFormUtils({ errors, schema });

  useEffect(() => {
    resetForm();
  }, []);

  useEffect(() => {
    if (dasRequest?.requestType) {
      if (dasRequest.requestType !== watch("requestType")) {
        setLocalStorage("dasRequest", omit(dasRequest, ["applicant"]));
      }
    }
  }, [getLocalStorage("dasRequest")]);

  const resetForm = () => {
    reset({
      requestType: dasRequest?.requestType || "",
      isHeadline: isBoolean(dasRequest?.isHeadline)
        ? dasRequest?.isHeadline
        : true,
    });
  };

  const onSubmit = (formData) => {
    try {
      setLoading(true);
      setLocalStorage("dasRequest", {
        ...getLocalStorage("dasRequest"),
        ...formData,
        to: formData?.isHeadline ? "headline" : "familiar",
      });

      onNextStep();
    } catch (e) {
      console.error("Step1: ", e);
    } finally {
      setLoading(false);
    }
  };

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
                    options={DasRequestList.map((_dasRequest) => ({
                      label: _dasRequest.name,
                      value: _dasRequest.id,
                    }))}
                    onChange={onChange}
                    error={error(name)}
                    helperText={errorMessage(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col span={24}>
              <Controller
                name="isHeadline"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <Container>
                    <RadioGroup
                      variant="outlined"
                      label="¿La solicitud es para el Titular o Familiar?"
                      options={[
                        {
                          label: "Titular",
                          value: true,
                        },
                        {
                          label: "Familiar",
                          value: false,
                        },
                      ]}
                      name={name}
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      helperText={errorMessage(name)}
                      required={required(name)}
                    />
                  </Container>
                )}
              />
            </Col>
          </Row>
          <Row justify="end" gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Button
                type="primary"
                size="large"
                block
                htmlType="submit"
                disabled={loading}
                loading={loading}
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
