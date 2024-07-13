import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  notification,
  Row,
  Select,
} from "../../../../../../../components";
import { Controller, useForm } from "react-hook-form";
import { Relationships } from "../../../../../../../data-list";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../../../../../../hooks";
import { updateDasApplication } from "../../../../../../../firebase/collections/dasApplications";

export const PersonalInformationModal = ({
  dasRequest,
  onCloseDasRequestModal,
}) => {
  const [loading, setLoading] = useState(false);

  console.log({ dasRequest });

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

  useEffect(() => {
    resetForm();
  }, []);

  const resetForm = () => {
    reset({
      headline: {
        currentService: dasRequest?.headline?.currentService || "",
        email: dasRequest?.headline?.email,
      },
      familiar: dasRequest?.familiar
        ? {
            firstName: dasRequest?.familiar?.firstName || "",
            paternalSurname: dasRequest?.familiar?.paternalSurname || "",
            maternalSurname: dasRequest?.familiar?.maternalSurname || "",
            cif: dasRequest?.familiar?.cif || "",
            email: dasRequest?.familiar?.email || "",
            relationship: dasRequest?.familiar?.relationship || "",
          }
        : null,
    });
  };

  const headlineAndFamiliarMap = (formData) => ({
    headline: {
      ...dasRequest.headline,
      currentService: formData?.headline?.currentService || "",
      email: formData?.headline?.email,
    },
    ...(formData?.familiar && {
      familiar: {
        ...dasRequest.familiar,
        ...formData.familiar,
      },
    }),
  });

  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      const headlineAndFamiliarInformation = headlineAndFamiliarMap(formData);

      await updateDasApplication(dasRequest.id, headlineAndFamiliarInformation);
      onCloseDasRequestModal();

      notification({ type: "success" });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row gutter={[16, 16]}>
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
        {!dasRequest?.isHeadline && (
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
                    name="familiar.cif"
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <InputNumber
                        label="N° CIF"
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
                          })
                        )}
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
        )}
      </Row>
      <Row justify="end" gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Button
            type="primary"
            size="large"
            block
            disabled={loading}
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
            disabled={loading}
            loading={loading}
          >
            Actualizar
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
