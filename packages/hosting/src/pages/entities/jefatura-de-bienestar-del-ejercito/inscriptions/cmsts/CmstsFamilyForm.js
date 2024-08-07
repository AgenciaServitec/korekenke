import React from "react";
import {
  Button,
  Col,
  Form,
  Input,
  modalConfirm,
  notification,
  Row,
  Select,
} from "../../../../../components";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useFormUtils } from "../../../../../hooks";
import { CmstsTable } from "./CmstsTable";

export const CmstsFamilyForm = ({ familyMembers, onSetFamilyMembers }) => {
  const exitsFamilyMember = (dni) =>
    !!(familyMembers || []).find((familyMember) => familyMember?.dni === dni);

  const onSubmitSaveFamilyUser = async (formData) => {
    try {
      const familyMember = exitsFamilyMember(formData.dni);

      if (familyMember)
        return notification({
          type: "warning",
          title: "El DNI ya esta registrado.",
        });

      onSetFamilyMembers((prevState) => [...prevState, formData]);
      clearForm();
    } catch (e) {
      console.log("ErrorUpdateUser: ", e);
      notification({ type: "error" });
    }
  };

  const schema = yup.object({
    firstName: yup.string().required(),
    paternalSurname: yup.string().required(),
    maternalSurname: yup.string().required(),
    relationship: yup.string().required(),
    age: yup.number().required(),
    cciiffs: yup.string().min(6).max(6).required(),
    dni: yup.string().min(8).max(8).required(),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const clearForm = () =>
    reset({
      firstName: "",
      paternalSurname: "",
      maternalSurname: "",
      relationship: "",
      age: "",
      cciiffs: "",
      dni: "",
    });

  const { required, error } = useFormUtils({ errors, schema });

  const onConfirmDeleteFamilyMember = (dni) =>
    modalConfirm({
      title: "¿Estás seguro de que quieres eliminar este familiar?",
      onOk: () => deleteFamilyMember(dni),
    });

  const deleteFamilyMember = async (dni) => {
    try {
      const _familyMembers = familyMembers.filter(
        (familyMember) => familyMember.dni !== dni,
      );

      onSetFamilyMembers(_familyMembers);

      notification({ type: "success" });
    } catch (e) {
      console.log("ErrorUpdateUser: ", e);
      notification({ type: "error" });
    }
  };

  const onSubmit = (formData) => onSubmitSaveFamilyUser(formData);

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row gutter={[16, 16]}>
            <Col span={24} md={4}>
              <Controller
                name="firstName"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Nombres del Familiar"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col span={24} md={4}>
              <Controller
                name="paternalSurname"
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
            <Col span={24} md={4}>
              <Controller
                name="maternalSurname"
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
            <Col span={24} md={3}>
              <Controller
                name="relationship"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Select
                    label="Parentesco"
                    defaultValue=""
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                    options={[
                      {
                        value: "son",
                        label: "Hijo (a)",
                      },
                      {
                        value: "brother",
                        label: "Hermano (a)",
                      },
                      {
                        value: "husband",
                        label: "Esposo (a)",
                      },
                    ]}
                  />
                )}
              />
            </Col>
            <Col span={24} md={2}>
              <Controller
                name="age"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Edad"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col span={24} md={3}>
              <Controller
                name="cciiffs"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="CCIIFFS"
                    type="number"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col span={24} md={4}>
              <Controller
                name="dni"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
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
          </Row>
          <Row justify="end" gutter={[16, 16]}>
            <Col xs={24} sm={6} md={4}>
              <Button size="large" block htmlType="submit">
                Añadir Familiar
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
      <Col span={24}>
        <CmstsTable
          familyMembers={familyMembers}
          onDeleteFamilyMember={onConfirmDeleteFamilyMember}
        />
      </Col>
    </Row>
  );
};
