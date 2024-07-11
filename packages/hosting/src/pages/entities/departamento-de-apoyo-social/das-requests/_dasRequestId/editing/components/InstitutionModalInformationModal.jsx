import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from "../../../../../../../components";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../../../../../../hooks";

export const InstitutionModalInformationModal = ({
  dasRequest,
  onCloseDasRequestModal,
}) => {
  const schema = yup.object({
    headline: yup.object({
      currentService: yup.string(),
      email: yup.string().email(),
    }),
    familiar: dasRequest?.isHeadline
      ? yup.object().nullable().notRequired()
      : yup.object({
          firstName: yup.string().required(),
          paternalSurname: yup.string().required(),
          maternalSurname: yup.string().required(),
          cif: yup.string().min(9).max(9).required(),
          email: yup.string().email().required(),
          relationship: yup.string().required(),
        }),
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

  return (
    <Form onSubmit={handleSubmit("")}>
      <Row gutter={[16, 16]}>
        <Col span={24} md={12}>
          <Controller
            name="headline.currentService"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <Input
                label="Tipo de Proceso"
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
        <Col span={24} md={12}>
          <Controller
            name="headline.email"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <Input
                label="Institución"
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
        <Col span={24}>
          <Card
            title={<span style={{ fontSize: "1.2em" }}>Datos Familiar</span>}
            bordered={false}
            type="inner"
          >
            <Row gutter={[16, 16]}>
              <Col span={24} md={8}>
                <Controller
                  name="familiar.firstName"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label="Especialidad"
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
          </Card>
        </Col>
      </Row>
      <Row justify="end" gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Button
            type="primary"
            size="large"
            block
            disabled={""}
            onClick={onCloseDasRequestModal}
          >
            Cancelar
          </Button>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Button
            type="primary"
            size="large"
            block
            htmlType="submit"
            disabled={""}
            loading={""}
          >
            Actualizar
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
