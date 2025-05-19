import React, { useEffect, useState } from "react";
import {
  Acl,
  Button,
  Col,
  Form,
  Input,
  Legend,
  notification,
  Row,
  Title,
} from "../../../components";
import { useNavigate, useParams } from "react-router";
import { useAuthentication } from "../../../providers";
import { assign, isEmpty } from "lodash";
import * as yup from "yup";
import {
  addVisit,
  fetchVisit,
  getVisitsId,
  updateVisit,
} from "../../../firebase/collections";
import { useDefaultFirestoreProps, useFormUtils } from "../../../hooks";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useApiPersonDataByDniGet } from "../../../api";

export const VisitsIntegration = () => {
  const navigate = useNavigate();

  const { authUser } = useAuthentication();
  const { visitId } = useParams();
  const { assignCreateProps, assignUpdateProps } = useDefaultFirestoreProps();

  const [visit, setVisit] = useState({});
  const [savingVisit, setSavingVisit] = useState(false);

  const isNew = visitId === "new";

  const onGoBack = () => navigate(-1);
  const onGoToVisits = () => navigate("/visits");

  useEffect(() => {
    (async () => {
      const visit_ = isNew ? { id: getVisitsId() } : await fetchVisit(visitId);

      if (!visit_) return onGoBack();

      setVisit(visit_);
    })();
  }, []);

  const onSaveVisit = async (formData) => {
    try {
      setSavingVisit(true);

      isNew
        ? await addVisit(assignCreateProps(mapVisit(visit, formData)))
        : await updateVisit(
            visit.id,
            assignUpdateProps(mapVisit(visit, formData)),
          );
      notification({ type: "success" });
      onGoToVisits();
    } catch (error) {
      console.error("Error: ", error);
      notification({ type: "error" });
    }
  };

  const mapVisit = (visit, formData) =>
    assign(
      {},
      {
        id: visit.id,
        firstName: formData.firstName,
        paternalSurname: formData.paternalSurname,
        maternalSurname: formData.maternalSurname,
        dni: formData.dni,
        dependency: formData.dependency,
        personVisited: {
          firstName: formData.personVisited.firstName,
          paternalSurname: formData.personVisited.paternalSurname,
          maternalSurname: formData.personVisited.maternalSurname,
          phone: {
            number: formData.personVisited.phoneNumber,
            prefix: "+51",
          },
        },
        status: visit?.status || "pending",
        userId: authUser.id,
      },
    );

  return (
    <VisitsForm
      isNew={isNew}
      visit={visit}
      onGoBack={onGoBack}
      savingVisit={savingVisit}
      onSaveVisit={onSaveVisit}
    />
  );
};

const VisitsForm = ({ isNew, onGoBack, onSaveVisit, savingVisit, visit }) => {
  const schema = yup.object({
    dni: yup.string().required(),
    firstName: yup.string().required(),
    paternalSurname: yup.string().required(),
    maternalSurname: yup.string().required(),
    dependency: yup.string().required(),
    personVisited: yup.object({
      firstName: yup.string().required(),
      paternalSurname: yup.string().required(),
      maternalSurname: yup.string().required(),
      phoneNumber: yup.number().required(),
    }),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { required, error } = useFormUtils({ errors, schema });

  const dniValue = watch("dni");

  const { getPersonDataByDni } = useApiPersonDataByDniGet();

  useEffect(() => {
    resetForm();
  }, [visit]);

  const resetForm = () => {
    reset({
      dni: visit?.dni || "",
      firstName: visit?.firstName || "",
      paternalSurname: visit?.paternalSurname || "",
      maternalSurname: visit?.maternalSurname || "",
      dependency: visit?.dependency || "",
      personVisited: {
        firstName: visit?.personVisited?.firstName || "",
        paternalSurname: visit?.personVisited?.paternalSurname || "",
        maternalSurname: visit?.personVisited?.maternalSurname || "",
        phoneNumber: visit?.personVisited?.phone?.number || "",
      },
    });
  };

  useEffect(() => {
    const fetchPerson = async () => {
      if (dniValue?.length === 8) {
        try {
          const data = await getPersonDataByDni(dniValue);
          if (!isEmpty(data)) {
            setValue("firstName", data.firstName);
            setValue("paternalSurname", data.paternalSurname);
            setValue("maternalSurname", data.maternalSurname);
          }
        } catch (error) {
          console.error("Error al obtener datos de persona:", error);
        }
      } else {
        setValue("firstName", "");
        setValue("paternalSurname", "");
        setValue("maternalSurname", "");
      }
    };

    fetchPerson();
  }, [dniValue, getPersonDataByDni, setValue]);

  return (
    <Acl
      category="public"
      subCategory="visits"
      name={isNew ? "/visits/new" : "/visits/:visitId"}
      redirect
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={2}>{isNew ? "Nueva Visita" : "Editar Visita"}</Title>
        </Col>
        <Col span={24}>
          <Form onSubmit={handleSubmit(onSaveVisit)}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Controller
                  name="dni"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      type="number"
                      label="DNI"
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
                  name="firstName"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label="Nombres"
                      name={name}
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                      disabled
                    />
                  )}
                />
              </Col>
              <Col span={24}>
                <Controller
                  name="paternalSurname"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label="Apellido paterno"
                      name={name}
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                      disabled
                    />
                  )}
                />
              </Col>
              <Col span={24}>
                <Controller
                  name="maternalSurname"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label="Apellido materno"
                      name={name}
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                      disabled
                    />
                  )}
                />
              </Col>
              <Col span={24}>
                <Controller
                  name="dependency"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label="Dependencia"
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
                <Legend title="¿A quién visita?">
                  <Row gutter={[16, 16]}>
                    <Col span={24} md={6}>
                      <Controller
                        name="personVisited.firstName"
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
                    <Col span={24} md={6}>
                      <Controller
                        name="personVisited.paternalSurname"
                        control={control}
                        render={({ field: { onChange, value, name } }) => (
                          <Input
                            label="Apellido paterno"
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
                        name="personVisited.maternalSurname"
                        control={control}
                        render={({ field: { onChange, value, name } }) => (
                          <Input
                            label="Apellido materno"
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
                        name="personVisited.phoneNumber"
                        control={control}
                        render={({ field: { onChange, value, name } }) => (
                          <Input
                            type="number"
                            label="N° celular"
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
                </Legend>
              </Col>
              <Col span={24}>
                <Row
                  justify="end"
                  gutter={[16, 16]}
                  style={{
                    marginTop: 24,
                    borderTop: "1px solid #f0f0f0",
                    paddingTop: 24,
                  }}
                >
                  <Col xs={24} sm={6} md={4}>
                    <Button
                      type="default"
                      size="large"
                      block
                      onClick={onGoBack}
                      disabled={savingVisit}
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
                      loading={savingVisit}
                    >
                      {isNew ? "Crear Visita" : "Guardar Cambios"}
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Acl>
  );
};
