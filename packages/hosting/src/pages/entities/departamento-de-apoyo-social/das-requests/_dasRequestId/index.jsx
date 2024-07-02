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
import { Relationships, institutions } from "../../../../../data-list";
import { useAuthentication } from "../../../../../providers";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useParams } from "react-router";
import {
  addDasApplication,
  fetchDasApplication,
  getDasApplicationId,
  updateDasApplication,
} from "../../../../../firebase/collections/dasApplications";
import styled from "styled-components";

export const InstituteAcademyIntegration = () => {
  const navigate = useNavigate();
  const { dasRequestId } = useParams();
  const { authUser } = useAuthentication();
  const { assignCreateProps, assignUpdateProps } = useDefaultFirestoreProps();
  const [dasRequest, setDasRequest] = useState({});
  const [loading, setLoading] = useState(false);
  const [headline, setHeadline] = useState(true);

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
    status: isNew ? "pending" : dasRequest.status,
    headline: {
      id: authUser.id,
      ...formData.headline,
      phone: {
        prefix: "+51",
        number: formData.headline.phoneNumber,
      },
    },
    familiar: formData?.familiar || null,
    institution: formData?.institution || null,
    applicant: {
      ...formData.applicant,
      to: headline ? "headline" : "familiar",
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
      onGoBack();
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
          headline={headline}
          onSetHeadline={setHeadline}
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
  headline,
  onSetHeadline,
}) => {
  const [_processType, setProcessType] = useState("entry");
  const [_requestType, setRequestType] = useState("institutes");

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
    familiar: headline
      ? yup.object().nullable().notRequired()
      : yup.object({
          firstName: headline
            ? yup.string().notRequired()
            : yup.string().required(),
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
    institution: yup.object({
      institutionId: yup.string().required(),
      specialty: yup.string().required(),
      processType: yup.string().when("requestType", {
        is: "universities",
        then: yup.string().required(),
        otherwise: yup.string().notRequired().nullable(),
      }),
    }),
    applicant: yup.object({
      documents: yup.object({
        copyLiquidacionHaberesHeadline: yup
          .mixed()
          .when("institution.institutionId", {
            is: "britanico",
            then: yup.mixed().required(),
            otherwise: yup.mixed().notRequired().nullable(),
          }),
        copyConstanciaIngresoUniv:
          _processType === "entry"
            ? yup.mixed().required()
            : yup.mixed().notRequired().nullable(),
        copyConsolidadoNotasUniv:
          _processType === "graduate"
            ? yup.mixed().required()
            : yup.mixed().notRequired().nullable(),
        copyBoletaPagoMatriculaUniv:
          _requestType === "universities"
            ? yup.mixed().required()
            : yup.mixed().notRequired().nullable(),
      }),
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
    defaultValues: {
      isHeadline: true,
    },
  });

  console.log({ errors });

  const { required, error } = useFormUtils({ errors, schema });

  useEffect(() => {
    resetForm();
  }, [dasRequest, _requestType]);

  const resetForm = () => {
    reset({
      isHeadline: true,
      requestType: dasRequest?.requestType || _requestType,
      headline: {
        firstName: user.firstName || "",
        paternalSurname: user.paternalSurname || "",
        maternalSurname: user.maternalSurname || "",
        cip: user.cip || "",
        degree: user.degree || "",
        phoneNumber: user.phone.number || "",
        currentService: user.currentService || "",
        email: user.email || "",
      },
      familiar: dasRequest?.familiar
        ? {
            firstName: dasRequest?.familiar?.firstName || "",
            paternalSurname: dasRequest?.familiar?.paternalSurname || "",
            maternalSurname: dasRequest?.familiar?.maternalSurname || "",
            cif: dasRequest?.familiar?.cif || "",
            email: dasRequest?.familiar?.email || "",
            relationship: dasRequest?.familiar?.relationship || "",
            documents: {
              copyCif: dasRequest?.familiar?.documents?.copyCif || null,
              copyDni: dasRequest?.familiar?.documents?.copyDni || null,
            },
          }
        : null,
      institution: {
        institutionId: dasRequest?.institution?.institutionId || "",
        specialty: dasRequest?.institution?.specialty || "",
        processType: dasRequest?.institution?.processType || "entry",
      },
      applicant: {
        documents: {
          copyLiquidacionHaberesHeadline:
            dasRequest?.applicant?.documents?.copyLiquidacionHaberesHeadline ||
            null,
          copyConstanciaIngresoUniv:
            dasRequest?.applicant?.documents?.copyConstanciaIngresoUniv || null,
          copyConsolidadoNotasUniv:
            dasRequest?.applicant?.documents?.copyConsolidadoNotasUniv || null,
          copyBoletaPagoMatriculaUniv:
            dasRequest?.applicant?.documents?.copyBoletaPagoMatriculaUniv ||
            null,
        },
      },
    });
  };

  const relationShipsView = [];

  for (const relation in Relationships) {
    relationShipsView.push({
      label: Relationships[relation],
      value: relation,
    });
  }

  const _isHeadline = watch("isHeadline") === true;
  const isUniversity = _requestType === "universities";

  const onSubmit = (formData) => onSaveInstituteOrAcademy(formData);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row gutter={[16, 16]} justify="space-between">
        <Col span={24} md={12}>
          <Controller
            name="requestType"
            control={control}
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
                onChange={(value) => {
                  onChange(value);
                  setRequestType(value);
                }}
                error={error(name)}
                required={required(name)}
              />
            )}
          />
        </Col>
        <Col span={24} md={4}>
          <Controller
            name="isHeadline"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <Container>
                <span>Titular o Familiar</span>
                <Switch
                  name={name}
                  value={value}
                  checkedChildren="Titular"
                  unCheckedChildren="Familiar"
                  size="2x"
                  onChange={(value) => {
                    onChange(value);
                    onSetHeadline(value);
                  }}
                  error={error(name)}
                  required={required(name)}
                />
              </Container>
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
                  name="headline.email"
                  control={control}
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
                    render={({ field: { onChange, value, name } }) => (
                      <Select
                        label="Parentesco"
                        name={name}
                        value={value}
                        options={relationShipsView}
                        onChange={onChange}
                        error={error(name)}
                        required={required(name)}
                      />
                    )}
                  />
                </Col>
                <Col sm={24} md={12}>
                  <Controller
                    name="familiar.documents.copyCif"
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
                    name="familiar.documents.copyDni"
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
                    name="institution.processType"
                    control={control}
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
                        onChange={(value) => {
                          onChange(value);
                          setProcessType(value);
                        }}
                        error={error(name)}
                        required={required(name)}
                      />
                    )}
                  />
                </Col>
              )}
              <Col span={24} md={8}>
                <Controller
                  name="institution.institutionId"
                  control={control}
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
                  name="institution.specialty"
                  control={control}
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

        {(isUniversity ||
          watch("institution.institutionId") === "britanico") && (
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
                    {watch("institution.processType") === "graduate" && (
                      <Col sm={24} md={12}>
                        <Controller
                          name="applicant.documents.copyConsolidadoNotasUniv"
                          control={control}
                          render={({ field: { onChange, value, name } }) => (
                            <Upload
                              key={watch("processType")}
                              label="Copias de Consolidado de notas (último ciclo)"
                              accept="image/*"
                              name={name}
                              value={value}
                              withThumbImage={false}
                              bucket="departamentoDeApoyoSocial"
                              fileName={`copyConsolidadoNotasUniv-foto-${uuidv4()}`}
                              filePath={`das-applicants/${dasRequest.id}/files`}
                              buttonText="Subir archivo"
                              error={error(name)}
                              required={required(name)}
                              onChange={(file) => onChange(file)}
                            />
                          )}
                        />
                      </Col>
                    )}
                    {watch("institution.processType") === "entry" && (
                      <Col sm={24} md={12}>
                        <Controller
                          name="applicant.documents.copyConstanciaIngresoUniv"
                          control={control}
                          render={({ field: { onChange, value, name } }) => (
                            <Upload
                              key={watch("processType")}
                              label="Copia de Constancia de Ingreso de la Universidad"
                              accept="image/*"
                              name={name}
                              value={value}
                              withThumbImage={false}
                              bucket="departamentoDeApoyoSocial"
                              fileName={`copyConstanciaIngresoUniv-foto-${uuidv4()}`}
                              filePath={`das-applicants/${dasRequest.id}/files`}
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
                        name="applicant.documents.copyBoletaPagoMatriculaUniv"
                        control={control}
                        render={({ field: { onChange, value, name } }) => (
                          <Upload
                            key={watch("processType")}
                            label="Copia de boleta pago matricula de la Universidad"
                            accept="image/*"
                            name={name}
                            value={value}
                            withThumbImage={false}
                            bucket="departamentoDeApoyoSocial"
                            fileName={`copyBoletaPagoMatriculaUniv-foto-${uuidv4()}`}
                            filePath={`das-applicants/${dasRequest.id}/files`}
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
                {watch("institution.institutionId") === "britanico" && (
                  <Col sm={24} md={12}>
                    <Controller
                      name="applicant.documents.copyLiquidacionHaberesHeadline"
                      control={control}
                      render={({ field: { onChange, value, name } }) => (
                        <Upload
                          key={watch("processType")}
                          label="Copia de Liquidación de Haberes del Titular"
                          accept="image/*"
                          name={name}
                          value={value}
                          withThumbImage={false}
                          bucket="departamentoDeApoyoSocial"
                          fileName={`copyLiquidacionHaberesHeadline-foto-${uuidv4()}`}
                          filePath={`das-applicants/${dasRequest.id}/files`}
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2em;
  span {
    font-size: 0.8em;
    font-weight: 600;
  }
`;
