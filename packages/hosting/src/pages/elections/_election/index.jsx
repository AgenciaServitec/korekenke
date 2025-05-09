import React, { useEffect, useState } from "react";
import { useGlobalData } from "../../../providers";
import { useNavigate, useParams } from "react-router";
import { useDefaultFirestoreProps, useFormUtils } from "../../../hooks";
import {
  Acl,
  Row,
  Col,
  Title,
  Form,
  notification,
  Input,
  TextArea,
  DatePicker,
  Select,
  Button,
} from "../../../components";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  addElection,
  fetchElection,
  getElectionId,
  updateElection,
} from "../../../firebase/collections";
import { assign } from "lodash";
import dayjs from "dayjs";
import { userFullName } from "../../../utils";

export const ElectionsIntegration = () => {
  const navigate = useNavigate();
  const { electionId } = useParams();

  const { assignCreateProps, assignUpdateProps } = useDefaultFirestoreProps();

  const [election, setElection] = useState({});
  const [savingElection, setSavingElection] = useState(false);

  const isNew = electionId === "new";

  const onGoBack = () => navigate(-1);

  useEffect(() => {
    (async () => {
      const election_ = isNew
        ? { id: getElectionId() }
        : await fetchElection(electionId);

      if (!election_) return onGoBack();

      setElection({
        ...election_,
        startDate: election_.startDate,
        endDate: election_.endDate,
      });
    })();
  }, []);

  const onSaveElection = async (formData) => {
    try {
      setSavingElection(true);

      isNew
        ? await addElection(assignCreateProps(mapElection(election, formData)))
        : await updateElection(
            election.id,
            assignUpdateProps(mapElection(election, formData)),
          );
      notification({ type: "success" });
      onGoBack();
    } catch (error) {
      console.log("Error: ", error);
      notification({ type: "error" });
    } finally {
      setSavingElection(false);
    }
  };

  const mapElection = (election, formData) =>
    assign(
      {},
      {
        id: election.id,
        status: electionStatus(formData.startDate, formData.endDate),
        title: formData.title,
        description: formData?.description,
        startDate: dayjs(formData.startDate).format("DD-MM-YYYY"),
        endDate: dayjs(formData.endDate).format("DD-MM-YYYY"),
        allowedVoters: formData.allowedVoters,
      },
    );

  const electionStatus = (startDate, endDate) => {
    const now = dayjs();
    if (now < startDate) return "planned";
    if (now > endDate) return "closed";
    return "active";
  };

  return (
    <ElectionForm
      isNew={isNew}
      election={election}
      onGoBack={onGoBack}
      savingElection={savingElection}
      onSaveElection={onSaveElection}
    />
  );
};

const ElectionForm = ({
  isNew,
  election,
  savingElection,
  onGoBack,
  onSaveElection,
}) => {
  const { users } = useGlobalData();

  const schema = yup.object({
    title: yup.string().required(),
    description: yup.string(),
    startDate: yup.date().required().min(dayjs()),
    endDate: yup.date().required().min(yup.ref("startDate")),
    allowedVoters: yup.array().required().min(1),
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
  }, [election]);

  const resetForm = () => {
    reset({
      title: election?.title || "",
      description: election?.description || "",
      startDate: election?.startDate
        ? dayjs(election.startDate, "DD-MM-YYYY")
        : undefined,
      endDate: election?.endDate
        ? dayjs(election.endDate, "DD-MM-YYYY")
        : undefined,
      allowedVoters: election?.allowedVoters || [],
    });
  };

  const disabledDate = (current) =>
    current && current <= dayjs().startOf("day");

  return (
    <Acl
      category="public"
      subCategory="elections"
      name={isNew ? "/elections/new" : "/elections/:electionId"}
      redirect
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={2}>
            {isNew ? "Nueva Elección" : "Editar Elección"}
          </Title>
        </Col>

        <Col span={24}>
          <Form onSubmit={handleSubmit(onSaveElection)}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Controller
                  name="title"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label="Título de la elección"
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
                  name="description"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <TextArea
                      label="Descripción y objetivos"
                      name={name}
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                      rows={3}
                    />
                  )}
                />
              </Col>
              <Col xs={24} md={12}>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <DatePicker
                      label="Fecha y hora de inicio"
                      name={name}
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                      disabledDate={disabledDate}
                    />
                  )}
                />
              </Col>

              <Col xs={24} md={12}>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <DatePicker
                      label="Fecha y hora de cierre"
                      name={name}
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                      disabledDate={disabledDate}
                    />
                  )}
                />
              </Col>
              <Col span={24}>
                <Controller
                  name="allowedVoters"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <Select
                      mode="multiple"
                      label="Participantes autorizados"
                      name={name}
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                      options={users.map((user) => ({
                        value: user.id,
                        label: userFullName(user),
                      }))}
                      placeholder="Selecciona los usuarios que podrán votar"
                    />
                  )}
                />
              </Col>
              <Col span={24}>
                <div style={{ margin: "24px 0 16px 0" }}>
                  <p style={{ color: "#666", fontStyle: "italic" }}>
                    🚀 Después de guardar la elección, podrás agregar candidatos
                    desde la lista de elecciones.
                  </p>
                </div>
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
                      disabled={savingElection}
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
                      loading={savingElection}
                    >
                      {isNew ? "Crear Sorteo" : "Guardar Cambios"}
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
