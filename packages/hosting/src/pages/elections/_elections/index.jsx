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
        startDate: election_.startDate?.toDate(),
        endDate: election_.endDate?.toDate(),
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
        startDate: dayjs(formData.startDate).toDate(),
        endDate: dayjs(formData.endDate).toDate(),
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
      startDate: election?.startDate ? dayjs(election.startDate) : undefined,
      endDate: election?.endDate ? dayjs(election.endDate) : undefined,
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
                      label="Titulo"
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
                      label="Descripción"
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
                  name="startDate"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <DatePicker
                      label="Fecha de inicio"
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
                  name="endDate"
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <DatePicker
                      label="Fecha de finalización"
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
                      label="Votantes Autorizados"
                      name={name}
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                      options={users.map((user) => ({
                        value: user.id,
                        label: userFullName(user),
                      }))}
                    />
                  )}
                />
              </Col>
              <Col xs={24} sm={6} md={4}>
                <Button
                  type="default"
                  size="large"
                  block
                  onClick={() => onGoBack()}
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
