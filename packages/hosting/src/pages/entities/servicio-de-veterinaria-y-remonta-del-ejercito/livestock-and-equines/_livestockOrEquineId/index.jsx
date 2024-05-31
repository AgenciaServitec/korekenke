import React from "react";
import { Acl, Button, Col, Form, Input, Row, Select, Title } from "../../../../../components";
import {Controller, useForm} from "react-hook-form";
import {useParams} from "react-router";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useFormUtils} from "../../../../../hooks";

export const LiveStockAndEquineIntegration = () => {
  const { livestockOrEquineId } = useParams();

  const isNew = livestockOrEquineId === "new";

  return <LiveStockAndEquine />;
};

const LiveStockAndEquine = () => {
  const schema = yup.object({
    name: yup.string().required(),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { required, error } = useFormUtils({ errors, schema });

  const onSubmit = (formData) => console.log(formData);

  return (
      <Acl name={''} redirect>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Title level={3}>Equino</Title>
          </Col>
          <Col span={24}>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Controller
                      name="name"
                      control={control}
                      render={({ field: { onChange, value, name } }) => (
                          <Input
                              label="Nombre"
                              name={name}
                              value={value}
                              onChange={onChange}
                              error={error(name)}
                              required={required(name)}
                          />
                      )}
                  />
                </Col>
              </Row>
              <Row justify="end" gutter={[16, 16]}>
                <Col xs={24} sm={6} md={4}>
                  <Button
                      type="default"
                      size="large"
                      block
                  >
                    Cancelar
                  </Button>
                </Col>
                <Col xs={24} sm={6} md={4}>
                  <Button
                      type="primary"
                      size="large"
                      block
                      htmlType="submit"
                      loading={false}
                  >
                    Guardar
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Acl>
  );
};