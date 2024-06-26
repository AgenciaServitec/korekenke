import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Switch,
  Title,
  Upload,
} from "../../../../../components";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../../../../hooks";
import { InstitutesAndAcademies } from "../../../../../data-list";
import { useAuthentication } from "../../../../../providers";
import { firestore } from "../../../../../firebase";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router";

export const InstituteAcademyIntegration = () => {
  const { dasRequestId } = useParams();
  const { authUser } = useAuthentication();
  const [familyOrHeadline, setFamilyOrHeadline] = useState(false);

  const onType = (value) => {
    console.log(value);
    setFamilyOrHeadline(value);
  };

  const mapForm = (formData) => ({
    id: firestore.collection().doc().id,
    headline: {
      firstName: formData.firstName,
      paternalSurname: formData.paternalSurname,
      maternalSurname: formData.maternalSurname,
      cip: formData.cip,
      degree: formData.degree,
      phoneNumber: {
        prefix: "+51",
        number: formData.phone,
      },
      currentService: formData.currentService,
      email: formData.email,
    },
    familiar: {
      firstName: formData.firstNameFamily,
      paternalSurname: formData.paternalSurnameFamily,
      maternalSurname: formData.maternalSurnameFamily,
      cif: formData.cifFamily,
      email: formData.emailFamily,
      relationship: formData.relationship,
      documents: {
        copyCIF: formData.copyCIFFamily,
        copyDNI: formData.copyDNIFamily,
        copyLiquidacionHaberesHeadline: formData.copyLiquidacionHaberesHeadline,
      },
    },
    instituteOrAcademy: {
      name: formData.instituteOrAcademyName,
    },
  });

  const saveInstituteOrAcademy = async (formData) => {
    try {
      console.log(mapForm(formData));
    } catch (e) {
      console.log(e);
    }

    console.log(mapForm(formData));
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Title level={2}>
          Solicitud para tarifa preferencial en instituto - academia
        </Title>
      </Col>
      <Col span={24}>
        <Row justify="end" gutter={[16, 16]}>
          <Switch
            checkedChildren="Titular"
            unCheckedChildren="Familiar"
            onChange={onType}
          />
        </Row>
      </Col>
      <Col span={24}>
        <InstituteAcademy
          user={authUser}
          familyOrHeadline={familyOrHeadline}
          onSaveInstituteOrAcademy={saveInstituteOrAcademy}
        />
      </Col>
    </Row>
  );
};

const InstituteAcademy = ({
  user,
  familyOrHeadline,
  onSaveInstituteOrAcademy,
}) => {
  const schema = yup.object({
    firstName: yup.string().required(),
    paternalSurname: yup.string().required(),
    maternalSurname: yup.string().required(),
    cip: yup.string().required(),
    degree: yup.string().required(),
    phoneNumber: yup.string().required().required(),
    currentService: yup.string(),
    email: yup.string(),
    firstNameFamily: yup.string().required(),
    paternalSurnameFamily: yup.string().required(),
    maternalSurnameFamily: yup.string().required(),
    cif: yup.string().required(),
    emailFamily: yup.string(),
    relationship: yup.string().required(),
    copyCIF: yup.mixed().required(),
    copyDNI: yup.mixed().required(),
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

  useEffect(() => {
    resetForm();
  }, []);

  const resetForm = () => {
    reset({
      firstName: user.firstName || "",
      paternalSurname: user.paternalSurname || "",
      maternalSurname: user.maternalSurname || "",
      cip: user.cip || "",
      degree: user.degree || "",
      phoneNumber: user.phone.number || "",
      currentService: user.currentService || "",
      email: user.email || "",
      copyCIF: null,
      copyDNI: null,
    });
  };

  const onSubmit = (formData) => onSaveInstituteOrAcademy(formData);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title={<span style={{ fontSize: "1.5em" }}>Datos del Titular</span>}
            bordered={false}
            type="inner"
          >
            <Row gutter={[16, 16]}>
              <Col span={24} md={8}>
                <Controller
                  name="firstName"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label="Nombres"
                      name={name}
                      value={value}
                      disabled
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                    />
                  )}
                />
              </Col>
              <Col span={24} md={8}>
                <Controller
                  name="paternalSurname"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label="Apellido Paterno"
                      name={name}
                      value={value}
                      disabled
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                    />
                  )}
                />
              </Col>
              <Col span={24} md={8}>
                <Controller
                  name="maternalSurname"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label="Apellido Materno"
                      name={name}
                      value={value}
                      disabled
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                    />
                  )}
                />
              </Col>
              <Col span={24} md={8}>
                <Controller
                  name="cip"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label="N° CIP"
                      name={name}
                      value={value}
                      disabled
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                    />
                  )}
                />
              </Col>
              <Col span={24} md={8}>
                <Controller
                  name="degree"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label="Grado"
                      name={name}
                      value={value}
                      disabled
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                    />
                  )}
                />
              </Col>
              <Col span={24} md={8}>
                <Controller
                  name="phoneNumber"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label="Celular"
                      name={name}
                      value={value}
                      disabled
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                    />
                  )}
                />
              </Col>
              <Col span={24} md={12}>
                <Controller
                  name="currentService"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label="Actual Servicio"
                      name={name}
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                    />
                  )}
                />
              </Col>
              <Col span={24} md={12}>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label="Correo Electrónico"
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
          </Card>
        </Col>
        {!familyOrHeadline && (
          <Col span={24}>
            <Card
              title={<span style={{ fontSize: "1.5em" }}>Datos Familiar</span>}
              bordered={false}
              type="inner"
            >
              <Row gutter={[16, 16]}>
                <Col span={24} md={8}>
                  <Controller
                    name="firstNameFamily"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value, name } }) => (
                      <Input
                        label="Nombres"
                        name={name}
                        value={value}
                        onChange={onChange}
                        error={error(name)}
                        required={required(name)}
                      />
                    )}
                  />
                </Col>
                <Col span={24} md={8}>
                  <Controller
                    name="paternalSurnameFamily"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value, name } }) => (
                      <Input
                        label="Apellido Paterno"
                        name={name}
                        value={value}
                        onChange={onChange}
                        error={error(name)}
                        required={required(name)}
                      />
                    )}
                  />
                </Col>
                <Col span={24} md={8}>
                  <Controller
                    name="maternalSurnameFamily"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value, name } }) => (
                      <Input
                        label="Apellido Materno"
                        name={name}
                        value={value}
                        onChange={onChange}
                        error={error(name)}
                        required={required(name)}
                      />
                    )}
                  />
                </Col>
                <Col span={24} md={8}>
                  <Controller
                    name="cifFamily"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value, name } }) => (
                      <Input
                        label="N° CIF"
                        name={name}
                        value={value}
                        onChange={onChange}
                        error={error(name)}
                        required={required(name)}
                      />
                    )}
                  />
                </Col>
                <Col span={24} md={8}>
                  <Controller
                    name="emailFamily"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value, name } }) => (
                      <Input
                        label="Correo Electrónico"
                        name={name}
                        value={value}
                        onChange={onChange}
                        error={error(name)}
                        required={required(name)}
                      />
                    )}
                  />
                </Col>
                <Col span={24} md={8}>
                  <Controller
                    name="relationship"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value, name } }) => (
                      <Input
                        label="Parentesco"
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
            </Card>
          </Col>
        )}
        <Col span={24}>
          <Card
            title={
              <span style={{ fontSize: "1.5em" }}>
                Datos Instituto - Academia
              </span>
            }
            bordered={false}
            type="inner"
          >
            <Row gutter={[16, 16]}>
              <Col span={24} md={12}>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value, name } }) => (
                    <Select
                      label="Institutos - Academias"
                      name={name}
                      value={value}
                      options={InstitutesAndAcademies}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                    />
                  )}
                />
              </Col>
              <Col span={24} md={12}>
                <Controller
                  name="specialty"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label="Especialidad"
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
          </Card>
        </Col>
        {!familyOrHeadline && (
          <Col span={24}>
            <Card
              title={
                <span style={{ fontSize: "1.5em" }}>
                  Documentos del Familiar
                </span>
              }
              bordered={false}
              type="inner"
            >
              <Row gutter={[16, 16]}>
                <Col sm={24} md={12}>
                  <Controller
                    name="copyCIF"
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <Upload
                        label="Copia CIF (Familiar)"
                        accept="image/*"
                        name={name}
                        value={value}
                        fileName={`cif-foto-${uuidv4()}`}
                        filePath={`das-applicants/876543/files`}
                        buttonText="Subir archivo"
                        error={error(name)}
                        required={required(name)}
                        onChange={(file) => onChange(file)}
                      />
                    )}
                  />
                </Col>
                <Col sm={24} md={12}>
                  <Controller
                    name="copyDNI"
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <Upload
                        label="Copia de DNI (Familiar)"
                        accept="image/*"
                        name={name}
                        value={value}
                        fileName={`dni-foto-${uuidv4()}`}
                        filePath={`das-applicants/76543/files`}
                        buttonText="Subir archivo"
                        error={error(name)}
                        required={required(name)}
                        onChange={(file) => onChange(file)}
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
        <Col xs={24} sm={6} md={4}>
          <Button
            type="primary"
            size="large"
            block
            htmlType="submit"
            disabled={""}
            loading={""}
          >
            Guardar
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
