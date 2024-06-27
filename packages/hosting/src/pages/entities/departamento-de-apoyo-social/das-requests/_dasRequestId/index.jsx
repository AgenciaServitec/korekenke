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
  notification,
} from "../../../../../components";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDefaultFirestoreProps, useFormUtils } from "../../../../../hooks";
import { institutions } from "../../../../../data-list";
import { useAuthentication } from "../../../../../providers";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useParams } from "react-router";
import {
  addDasApplication,
  fetchDasApplication,
  getDasApplicationId,
  updateDasApplication,
} from "../../../../../firebase/collections/dasApplications";

export const InstituteAcademyIntegration = () => {
  const navigate = useNavigate();
  const { dasRequestId } = useParams();
  const { authUser } = useAuthentication();
  const { assignCreateProps, assignUpdateProps } = useDefaultFirestoreProps();
  const [dasRequest, setDasRequest] = useState({});
  const [loading, setLoading] = useState(false);
  const [headline, setHeadline] = useState(false);
  const [requestType, setRequestType] = useState("institute");

  const onGoBack = () => navigate(-1);

  const isNew = dasRequestId === "new";

  useEffect(() => {
    const _dasRequest = isNew
      ? { id: getDasApplicationId() }
      : (async () => {
          fetchDasApplication(dasRequestId).then((response) => {
            if (!response) return onGoBack();
            return;
          });
        })();

    setDasRequest(_dasRequest);
  }, []);

  const mapForm = (formData) => ({
    ...dasRequest,
    headline: {
      id: authUser.id,
      firstName: formData.firstName,
      paternalSurname: formData.paternalSurname,
      maternalSurname: formData.maternalSurname,
      cip: formData.cip,
      degree: formData.degree,
      phone: {
        prefix: "+51",
        number: formData.phoneNumber,
      },
      currentService: formData.currentService,
      email: formData.email,
    },
    familiar: {
      firstName: formData.firstNameFamily,
      paternalSurname: formData.paternalSurnameFamily,
      maternalSurname: formData.maternalSurnameFamily,
      cif: formData.cif,
      email: formData.emailFamily,
      relationship: formData.relationship,
      documents: {
        copyCif: formData.copyCif || null,
        copyDni: formData.copyDni || null,
      },
    },
    institution: {
      type: dasRequest?.institution?.type || requestType,
      name: formData.institutionId,
      specialty: formData.specialty,
      processType: formData.processType,
    },
    applicant: {
      to: dasRequest?.applicant?.to || headline ? "headline" : "familiar",
      documents: {
        copyLiquidacionHaberesHeadline:
          formData.copyLiquidacionHaberesHeadline || null,
        copyConstanciaIngresoUniv: formData.copyConstanciaIngresoUniv || null,
        copyConsolidadoNotasUniv: formData.copyConsolidadoNotasUniv || null,
        copyBoletaPagoMatriculaUniv:
          formData.copyBoletaPagoMatriculaUniv || null,
      },
    },
  });

  const saveInstituteOrAcademy = async (formData) => {
    try {
      setLoading(true);

      isNew
        ? await addDasApplication(assignCreateProps(mapForm(formData)))
        : await updateDasApplication(
            dasRequest.id,
            assignUpdateProps(mapForm(formData))
          );

      notification({ type: "success" });
    } catch (e) {
      console.error("ErrorSaveDasRequest: ", e);
      notification({ type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Title level={2}>Solicitud para Institución</Title>
      </Col>
      <Col span={24}>
        <InstituteAcademy
          user={authUser}
          onSaveInstituteOrAcademy={saveInstituteOrAcademy}
          dasRequest={dasRequest}
          loading={loading}
          onSetHeadline={setHeadline}
          onSetRequestType={setRequestType}
        />
      </Col>
    </Row>
  );
};

const InstituteAcademy = ({
  user,
  onSaveInstituteOrAcademy,
  dasRequest,
  loading,
  onSetHeadline,
  onSetRequestType,
}) => {
  const schema = yup.object({
    isHeadline: yup.boolean().required(),
    requestType: yup.string().required(),
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

    familiar: yup.object({
      firstName: yup.string().when("isHeadline", {
        is: true,
        then: yup.string().nullable(),
        otherwise: yup.string().required(),
      }),
      paternalSurname: yup.string().when("isHeadline", {
        is: true,
        then: yup.string().nullable(),
        otherwise: yup.string().required(),
      }),
      maternalSurname: yup.string().when("isHeadline", {
        is: true,
        then: yup.string().nullable(),
        otherwise: yup.string().required(),
      }),
      cif: yup.string().when("isHeadline", {
        is: true,
        then: yup.string().nullable(),
        otherwise: yup.string().min(9).max(9).required(),
      }),
      email: yup.string().email().when("isHeadline", {
        is: true,
        then: yup.string().email().nullable(),
        otherwise: yup.string().email().required(),
      }),
      relationship: yup.string().when("isHeadline", {
        is: true,
        then: yup.string().nullable(),
        otherwise: yup.string().required(),
      }),
      documents: yup.object({
        copyCif: yup.mixed().when("isHeadline", {
          is: true,
          then: yup.mixed().nullable(),
          otherwise: yup.mixed().required(),
        }),
        copyDni: yup.mixed().when("isHeadline", {
          is: true,
          then: yup.mixed().nullable(),
          otherwise: yup.mixed().required(),
        }),
      }),
    }),
    institutionId: yup.string().when("requestType", {
      is: "institutes",
      then: yup.string().required(),
      otherwise: yup.string().notRequired(),
    }),
    specialty: yup.string().required(),
    processType: yup.string().when("requestType", {
      is: "universities",
      then: yup.string().required(),
      otherwise: yup.string().notRequired(),
    }),
    copyLiquidacionHaberesHeadline: yup.mixed().when("requestType", {
      is: "britanico",
      then: yup.mixed().required(),
      otherwise: yup.mixed().notRequired(),
    }),
    copyConstanciaIngresoUniv: yup.mixed().when("requestType", {
      is: "universities",
      then: yup.mixed().required(),
      otherwise: yup.mixed().notRequired(),
    }),
    copyConsolidadoNotasUniv: yup.mixed().when("requestType", {
      is: "universities",
      then: yup.mixed().required(),
      otherwise: yup.mixed().notRequired(),
    }),
    copyBoletaPagoMatriculaUniv: yup.mixed().when("requestType", {
      is: "universities",
      then: yup.mixed().required(),
      otherwise: yup.mixed().notRequired(),
    }),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { isHeadline: true },
  });

  const { required, error } = useFormUtils({ errors, schema });

  console.log(error);
  console.log(errors);

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
      requestType: "institutes",
      processType: dasRequest?.applicant?.processType || "entry",
    });
  };

  useEffect(() => {
    onSetHeadline(watch("headline"));
  }, [watch("headline")]);

  useEffect(() => {
    onSetRequestType(watch("requestType"));
  }, [watch("requestType")]);

  const _isHeadline = watch("isHeadline") === true;
  const isUniversity = watch("requestType") === "universities";

  const onSubmit = (formData) => onSaveInstituteOrAcademy(formData);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Controller
            name="isHeadline"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value, name } }) => (
              <Switch
                name={name}
                value={value}
                checkedChildren="Titular"
                unCheckedChildren="Familiar"
                onChange={onChange}
                error={error(name)}
                required={required(name)}
              />
            )}
          />
        </Col>
        <Col span={24} md={12}>
          <Controller
            name="requestType"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value, name } }) => (
              <Select
                label="Tipo de Solicitud"
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
                required={required(name)}
              />
            )}
          />
        </Col>
      </Row>
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
        {!_isHeadline && (
          <Col span={24}>
            <Card
              title={<span style={{ fontSize: "1.5em" }}>Datos Familiar</span>}
              bordered={false}
              type="inner"
            >
              <Row gutter={[16, 16]}>
                <Col span={24} md={8}>
                  <Controller
                    name="familiar.firstName"
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
                    name="familiar.paternalSurname"
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
                    name="familiar.maternalSurname"
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
                    name="familiar.cif"
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
                    name="familiar.email"
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
                    name="familiar.relationship"
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
                <Col sm={24} md={12}>
                  <Controller
                    name="familiar.documents.copyCIF"
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <Upload
                        label="Copia CIF (Familiar)"
                        accept="image/*"
                        name={name}
                        value={value}
                        bucket="departamentoDeApoyoSocial"
                        fileName={`cif-foto-${uuidv4()}`}
                        filePath={`departamento-de-apoyo-social/${dasRequest.id}/files`}
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
                    name="familiar.documents.copyDNI"
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <Upload
                        label="Copia de DNI (Familiar)"
                        accept="image/*"
                        name={name}
                        value={value}
                        bucket="departamentoDeApoyoSocial"
                        fileName={`dni-foto-${uuidv4()}`}
                        filePath={`departamento-de-apoyo-social/${dasRequest.id}/files`}
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
        <Col span={24}>
          <Card
            title={<span style={{ fontSize: "1.5em" }}>Datos Institución</span>}
            bordered={false}
            type="inner"
          >
            <Row gutter={[16, 16]}>
              {isUniversity && (
                <Col span={24} md={8}>
                  <Controller
                    name="processType"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value, name } }) => (
                      <Select
                        label="Tipo de Proceso"
                        name={name}
                        value={value}
                        options={[
                          {
                            label: "Ingresante",
                            value: "entry",
                          },
                          {
                            label: "Egresado",
                            value: "graduate",
                          },
                        ]}
                        onChange={onChange}
                        error={error(name)}
                        required={required(name)}
                      />
                    )}
                  />
                </Col>
              )}
              <Col span={24} md={8}>
                <Controller
                  name="institutionId"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value, name } }) => (
                    <Select
                      label="Instituciones"
                      name={name}
                      value={value}
                      options={institutions?.[watch("requestType")] || []}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                    />
                  )}
                />
              </Col>
              <Col span={24} md={8}>
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
        {(isUniversity || watch("institutionId") === "britanico") && (
          <Col span={24}>
            <Card
              title={
                <span style={{ fontSize: "1.5em" }}>
                  Documentos del Aplicante
                </span>
              }
              bordered={false}
              type="inner"
            >
              <Row gutter={[16, 16]}>
                {isUniversity && (
                  <>
                    {watch("processType") === "graduate" && (
                      <Col sm={24} md={12}>
                        <Controller
                          name="copyConsolidadoNotasUniversity"
                          control={control}
                          render={({ field: { onChange, value, name } }) => (
                            <Upload
                              label="Copias de Consolidado de notas (último ciclo)"
                              accept="image/*"
                              name={name}
                              value={value}
                              bucket="departamentoDeApoyoSocial"
                              fileName={`cif-foto-${uuidv4()}`}
                              filePath={`departamento-de-apoyo-social/${dasRequest.id}/files`}
                              buttonText="Subir archivo"
                              error={error(name)}
                              required={required(name)}
                              onChange={(file) => onChange(file)}
                            />
                          )}
                        />
                      </Col>
                    )}
                    {watch("processType") === "entry" && (
                      <Col sm={24} md={12}>
                        <Controller
                          name="CopyCertificateAdmissionUniversity"
                          control={control}
                          render={({ field: { onChange, value, name } }) => (
                            <Upload
                              label="Copia de Constancia de Ingreso de la Universidad"
                              accept="image/*"
                              name={name}
                              value={value}
                              bucket="departamentoDeApoyoSocial"
                              fileName={`cif-foto-${uuidv4()}`}
                              filePath={`departamento-de-apoyo-social/${dasRequest.id}/files`}
                              buttonText="Subir archivo"
                              error={error(name)}
                              required={required(name)}
                              onChange={(file) => onChange(file)}
                            />
                          )}
                        />
                      </Col>
                    )}
                    <Col sm={24} md={12}>
                      <Controller
                        name="CopyUniversityTuitionPaymenReceipt"
                        control={control}
                        render={({ field: { onChange, value, name } }) => (
                          <Upload
                            label="Copia de boleta pago matricula de la Universidad"
                            accept="image/*"
                            name={name}
                            value={value}
                            bucket="departamentoDeApoyoSocial"
                            fileName={`dni-foto-${uuidv4()}`}
                            filePath={`departamento-de-apoyo-social/${dasRequest.id}/files`}
                            buttonText="Subir archivo"
                            error={error(name)}
                            required={required(name)}
                            onChange={(file) => onChange(file)}
                          />
                        )}
                      />
                    </Col>
                  </>
                )}
                {watch("institutionId") === "britanico" && (
                  <Col sm={24} md={12}>
                    <Controller
                      name="copyLiquidacionHaberesHeadline"
                      control={control}
                      render={({ field: { onChange, value, name } }) => (
                        <Upload
                          label="Copia de Liquidación de Haberes del Titular"
                          accept="image/*"
                          name={name}
                          value={value}
                          bucket="departamentoDeApoyoSocial"
                          fileName={`dni-foto-${uuidv4()}`}
                          filePath={`departamento-de-apoyo-social/${dasRequest.id}/files`}
                          buttonText="Subir archivo"
                          error={error(name)}
                          required={required(name)}
                          onChange={(file) => onChange(file)}
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
        <Col xs={24} sm={6} md={4}>
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
