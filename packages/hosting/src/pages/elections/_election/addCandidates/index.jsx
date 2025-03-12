import React from "react";
import { useNavigate, useParams } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  notification,
  Title,
} from "../../../../components";
import { userFullName } from "../../../../utils";
import { useGlobalData } from "../../../../providers";
import { addCandidate } from "../../../../firebase/collections";
import { useFormUtils } from "../../../../hooks";

export const AddCandidates = () => {
  const navigate = useNavigate();
  const { electionId } = useParams();
  const { users } = useGlobalData();

  const onGoBack = () => navigate(-1);

  const schema = yup.object({
    userId: yup.string().required("Nombre es obligatorio"),
    slogan: yup.string(),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { required, error } = useFormUtils({ errors, schema });

  const onSubmit = async (formData) => {
    try {
      const user = users.find((u) => u.id === formData.userId);
      if (!user) throw new Error("Usuario no encontrado");

      await addCandidate(electionId, formData.userId, {
        name: userFullName(user),
        slogan: formData.slogan,
      });

      reset();
      notification({ type: "success", message: "¡Candidato agregado!" });
    } catch (error) {
      notification({ type: "error", message: error.message });
    }
  };

  return (
    <div>
      <Title level={2}>Añadir Candidatos a la Elección</Title>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Controller
              name="userId"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <Select
                  label="Seleccionar Candidato"
                  options={users.map((user) => ({
                    value: user.id,
                    label: userFullName(user),
                  }))}
                  onChange={onChange}
                  value={value}
                  error={error(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>
          <Col span={24}>
            <Controller
              name="slogan"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Slogan"
                  name={name}
                  value={value}
                  onChange={onChange}
                  error={error(name)}
                />
              )}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]} justify="end">
          <Col xs={24} sm={6} md={4}>
            <Button type="default" size="large" block onClick={onGoBack}>
              Cancelar
            </Button>
          </Col>
          <Col xs={24} sm={6} md={4}>
            <Button type="primary" size="large" htmlType="submit">
              Guardar Candidato
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
