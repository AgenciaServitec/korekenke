import React from "react";
import { Col, Row } from "antd";
import {
  Form,
  Title,
  Card,
  Input,
  RadioGroup,
  Button,
  TextArea,
} from "../../../../../../components";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../../../../../hooks";
import { useNavigate } from "react-router-dom";
import { EquipeMagazineProfileInformation } from "./EquipeMagazineProfileInformation";
import styled from "styled-components";

export const EquineMagazineProfileIntegration = () => {
  const navigate = useNavigate();
  const onGoBack = () => navigate(-1);

  const mapForm = (formData) => ({
    id: formData.id,
    bodyCondition: {
      code: formData.bodyCondition,
    },
  });

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card
          title={
            <Title level={4} style={{ marginBottom: 0 }}>
              Datos del Equino
            </Title>
          }
          bordered={false}
          type="inner"
        >
          <EquipeMagazineProfileInformation />
        </Card>
      </Col>
      <Col span={24}>
        <Card
          title={
            <Title level={4} style={{ marginBottom: 0 }}>
              Registro de Ficha de Revista Equina
            </Title>
          }
          bordered={false}
          type="inner"
        >
          <EquineMagazineProfile onGoBack={onGoBack} />
        </Card>
      </Col>
    </Row>
  );
};

const EquineMagazineProfile = ({ onGoBack }) => {
  const schema = yup.object({
    roleCode: yup.string().required(),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { required, error } = useFormUtils({ errors, schema });

  return (
    <Container>
      <Form>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <div className="item-sheet">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Controller
                    name="bodyCondition"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value, name } }) => (
                      <RadioGroup
                        label="Condición Corporal"
                        name={name}
                        value={value}
                        options={[
                          {
                            label: "Pobre o extremadamente flaco",
                            value: 1,
                          },
                          {
                            label: "Muy flaco",
                            value: 2,
                          },
                          {
                            label: "Flaco",
                            value: 3,
                          },
                          {
                            label: "Moderadamente flaco",
                            value: 4,
                          },
                          {
                            label: "Moderado",
                            value: 5,
                          },
                          {
                            label: "Moderadamente encarnado",
                            value: 6,
                          },
                          {
                            label: "Encarnado",
                            value: 7,
                          },
                          {
                            label: "Obeso",
                            value: 8,
                          },
                          {
                            label: "Extremadamente obeso",
                            value: 9,
                          },
                        ]}
                        onChange={onChange}
                        error={error(name)}
                        required={required(name)}
                      />
                    )}
                  />
                </Col>
                <Col span={24}>
                  <Controller
                    name="observation"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value, name } }) => (
                      <TextArea
                        label="Observaciones"
                        rows={5}
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
            </div>
          </Col>
          <Col span={24}>
            <Controller
              name="toillete"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <RadioGroup
                  label="Toillete"
                  name={name}
                  value={value}
                  options={[
                    {
                      label: "Muy bueno",
                      value: 1,
                    },
                    {
                      label: "Bueno",
                      value: 2,
                    },
                    {
                      label: "Regular",
                      value: 3,
                    },
                    {
                      label: "Malo",
                      value: 4,
                    },
                  ]}
                  onChange={onChange}
                  error={error(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>
          <Col span={24}>
            <Controller
              name="horseshoe"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <RadioGroup
                  label="Herrado"
                  name={name}
                  value={value}
                  options={[
                    {
                      label: "Muy bueno",
                      value: 1,
                    },
                    {
                      label: "Bueno",
                      value: 2,
                    },
                    {
                      label: "Regular",
                      value: 3,
                    },
                    {
                      label: "Malo",
                      value: 4,
                    },
                  ]}
                  onChange={onChange}
                  error={error(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>
          <Col span={24} md={6}>
            <Controller
              name="chestCircumference"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="PT: Perimetro toraxico (CM)"
                  name={name}
                  value={value}
                  onChange={onChange}
                  error={error(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>
          <Col span={24} md={6}>
            <Controller
              name="bodyLength"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="LG: Longitud corporal (CM)"
                  name={name}
                  value={value}
                  onChange={onChange}
                  error={error(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>
          <Col span={24} md={6}>
            <Controller
              name="heightOfTheCross"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="AC: Altura de la cruz (CM)"
                  name={name}
                  value={value}
                  onChange={onChange}
                  error={error(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>
          <Col span={24} md={6}>
            <Controller
              name="horseWeight"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Peso del caballo (Kg)"
                  name={name}
                  value={value}
                  onChange={onChange}
                  error={error(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>
          <Col span={24}>
            <Controller
              name="observation"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <TextArea
                  label="Observaciones"
                  rows={5}
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
              onClick={() => onGoBack()}
            >
              Cancelar
            </Button>
          </Col>
          <Col xs={24} sm={6} md={4}>
            <Button type="primary" size="large" block htmlType="submit">
              Guardar
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  .item-sheet {
    width: 100%;
    background: #f1f0f0;
    padding: 1em;
    border-radius: 1em;
  }
  .ant-space-item {
    width: 100%;
  }
`;
