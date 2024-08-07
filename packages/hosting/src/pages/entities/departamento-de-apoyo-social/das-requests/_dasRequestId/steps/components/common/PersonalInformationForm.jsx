import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from "../../../../../../../../components";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../../../../../../../hooks";
import { Relationships } from "../../../../../../../../data-list";

export const PersonalInformationForm = ({
  user,
  onPrevStep,
  dasRequest,
  loadingStep2,
  onSavePersonalInformationStep2,
}) => {
  const [relationship, setRelationship] = useState(
    dasRequest?.familiar?.relationship || "",
  );

  const schema = yup.object({
    headline: yup.object({
      firstName: yup.string().required(),
      paternalSurname: yup.string().required(),
      maternalSurname: yup.string().required(),
      cip: yup.string().required(),
      degree: yup.string().required(),
      phoneNumber: yup.string().required(),
      currentService: yup.string(),
      email: yup.string().email(),
    }),
    familiar: dasRequest?.isHeadline
      ? yup.object().nullable().notRequired()
      : yup.object({
          firstName: yup.string().required(),
          paternalSurname: yup.string().required(),
          maternalSurname: yup.string().required(),
          email: yup.string().email().required(),
          relationship: yup.string().required(),
          cif:
            relationship === "brother"
              ? yup.string().nullable().notRequired()
              : yup.string().min(9).max(9).required(),
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

  useEffect(() => {
    resetForm();
  }, []);

  const resetForm = () => {
    reset({
      headline: {
        firstName: dasRequest?.headline?.firstName || user?.firstName,
        paternalSurname:
          dasRequest?.headline?.paternalSurname || user?.paternalSurname,
        maternalSurname:
          dasRequest?.headline?.maternalSurname || user?.maternalSurname,
        cip: dasRequest?.headline?.cip || user?.cip,
        degree: dasRequest?.headline?.degree || user?.degree,
        phoneNumber: dasRequest?.headline?.phone.number || user?.phone.number,
        currentService: dasRequest?.headline?.currentService || "",
        email: dasRequest?.headline?.email || user?.email,
      },
      familiar: dasRequest?.familiar
        ? {
            firstName: dasRequest?.familiar?.firstName || "",
            paternalSurname: dasRequest?.familiar?.paternalSurname || "",
            maternalSurname: dasRequest?.familiar?.maternalSurname || "",
            cif: dasRequest?.familiar?.cif ? dasRequest?.familiar?.cif : "",
            email: dasRequest?.familiar?.email || "",
            relationship: dasRequest?.familiar?.relationship || "",
          }
        : null,
    });
  };

  const mapFormData = (formData) => ({
    headline: {
      id: user.id,
      ...formData.headline,
      phone: {
        prefix: "+51",
        number: formData.headline.phoneNumber,
      },
    },
    familiar: dasRequest?.isHeadline ? null : formData?.familiar || null,
  });

  const onSubmit = (formData) =>
    onSavePersonalInformationStep2(mapFormData(formData));

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card
              title={
                <span style={{ fontSize: "1.5em" }}>Datos del Titular</span>
              }
              bordered={false}
              type="inner"
            >
              <Row gutter={[16, 16]}>
                <Col span={24} md={8}>
                  <Controller
                    name="headline.firstName"
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <Input
                        label="Nombres"
                        name={name}
                        value={value}
                        disabled
                        onChange={onChange}
                        error={error(name)}
                        helperText={errorMessage(name)}
                        required={required(name)}
                      />
                    )}
                  />
                </Col>
                <Col span={24} md={8}>
                  <Controller
                    name="headline.paternalSurname"
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <Input
                        label="Apellido Paterno"
                        name={name}
                        value={value}
                        disabled
                        onChange={onChange}
                        error={error(name)}
                        helperText={errorMessage(name)}
                        required={required(name)}
                      />
                    )}
                  />
                </Col>
                <Col span={24} md={8}>
                  <Controller
                    name="headline.maternalSurname"
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <Input
                        label="Apellido Materno"
                        name={name}
                        value={value}
                        disabled
                        onChange={onChange}
                        error={error(name)}
                        helperText={errorMessage(name)}
                        required={required(name)}
                      />
                    )}
                  />
                </Col>
                <Col span={24} md={8}>
                  <Controller
                    name="headline.cip"
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <Input
                        label="N° CIP"
                        name={name}
                        value={value}
                        disabled
                        onChange={onChange}
                        error={error(name)}
                        helperText={errorMessage(name)}
                        required={required(name)}
                      />
                    )}
                  />
                </Col>
                <Col span={24} md={8}>
                  <Controller
                    name="headline.degree"
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <Input
                        label="Grado"
                        name={name}
                        value={value}
                        disabled
                        onChange={onChange}
                        error={error(name)}
                        helperText={errorMessage(name)}
                        required={required(name)}
                      />
                    )}
                  />
                </Col>
                <Col span={24} md={8}>
                  <Controller
                    name="headline.phoneNumber"
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <Input
                        label="Celular"
                        name={name}
                        value={value}
                        disabled
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
                    name="headline.currentService"
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <Input
                        label="Actual Servicio (En donde trabajas)"
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
                        label="Correo Electrónico"
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
          {!dasRequest?.isHeadline && (
            <Col span={24}>
              <Card
                title={
                  <span style={{ fontSize: "1.5em" }}>Datos Familiar</span>
                }
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
                          label="Nombres"
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
                  <Col span={24} md={8}>
                    <Controller
                      name="familiar.paternalSurname"
                      control={control}
                      render={({ field: { onChange, value, name } }) => (
                        <Input
                          label="Apellido Paterno"
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
                  <Col span={24} md={8}>
                    <Controller
                      name="familiar.maternalSurname"
                      control={control}
                      render={({ field: { onChange, value, name } }) => (
                        <Input
                          label="Apellido Materno"
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
                  <Col span={24} md={8}>
                    <Controller
                      name="familiar.relationship"
                      control={control}
                      render={({ field: { onChange, value, name } }) => (
                        <Select
                          label="Parentesco"
                          name={name}
                          value={value}
                          options={Object.entries(Relationships).map(
                            ([key, value]) => ({
                              label: value,
                              value: key,
                            }),
                          )}
                          onChange={(value) => {
                            setRelationship(value);
                            onChange(value);
                          }}
                          error={error(name)}
                          helperText={errorMessage(name)}
                          required={required(name)}
                        />
                      )}
                    />
                  </Col>
                  <Col span={24} md={8}>
                    <Controller
                      name="familiar.email"
                      control={control}
                      render={({ field: { onChange, value, name } }) => (
                        <Input
                          label="Correo Electrónico"
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
                  {relationship !== "brother" && (
                    <Col span={24} md={8}>
                      <Controller
                        name="familiar.cif"
                        control={control}
                        render={({ field: { onChange, value, name } }) => (
                          <InputNumber
                            label="N° CIF"
                            name={name}
                            value={value}
                            hidden={true}
                            onChange={onChange}
                            error={error(name)}
                            helperText={errorMessage(name)}
                            required={required(name)}
                          />
                        )}
                      />
                    </Col>
                  )}
                </Row>
              </Card>
            </Col>
          )}
        </Row>
        <Row justify="end" gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Button
              type="primary"
              size="large"
              block
              disabled={loadingStep2}
              onClick={onPrevStep}
            >
              Atras
            </Button>
          </Col>
          <Col xs={24} sm={12} md={6}>
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
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;
